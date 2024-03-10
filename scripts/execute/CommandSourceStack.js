import { world, Entity, Block, BlockAreaSize } from "@minecraft/server";

import { MultiDimensionalVector, Random, numberFunctions, shallowCopy } from "../utils/index";

export class CommandSourceStack {
    constructor(origin) {
        if (origin === undefined) {
            origin = "server";
        }

        this.#internal.id = Random.uuid();

        if (origin instanceof Entity) {
            this.entity = origin;
            this.location = origin.location;
            this.rotation = origin.getRotation();
            this.dimension = origin.dimension;
            this.anchor = "feet";
            this.origin = {
                typeId: origin.typeId
            };

            if (origin.typeId === "minecraft:player") {
                if (origin.isOp()) {
                    this.origin.permissionLevel = 1;
                }
                else {
                    this.origin.permissionLevel = 0;
                }
            }
            else if (origin.typeId === "minecraft:command_block_minecart") {
                this.origin.permissionLevel = 1;
            }
            else {
                this.origin.permissionLevel = 0;
            }
        }
        else if (origin instanceof Block) {
            this.entity = null;
            this.location = origin.location;
            this.rotation = { x: 0, y: 0 };
            this.dimension = origin.dimension;
            this.anchor = "feet";
            this.origin = {
                typeId: origin.type.id
            };

            if (["minecraft:command_block", "minecraft:repeating_command_block", "minecraft:chain_command_block"].includes(origin.typeId)) {
                this.origin.permissionLevel = 1;
            }
            else {
                this.origin.permissionLevel = 0;
            }
        }
        else if (origin === "server") {
            this.entity = null;
            this.location = { x: 0, y: 0, z: 0 };
            this.rotation = { x: 0, y: 0 };
            this.dimension = world.getDimension("overworld");
            this.anchor = "feet";
            this.origin = {
                typeId: "server",
                permissionLevel: 4
            };
        }
        else {
            throw new TypeError("Unexpected type passed to function argument[0].");
        }
    }

    get id() {
        return this.#internal.id;
    }

    set id(value) {
        throw new Error("idは読み取り専用だよ");
    }

    get parentId() {
        return this.#internal.parentId;
    }

    set parentId(value) {
        throw new Error("parentIdは読み取り専用だよ");
    }

    #internal = {
        id: Random.uuid(),
        parentId: undefined
    };

    clone() {
        const commandSourceStack = new CommandSourceStack();
        commandSourceStack.entity = this.entity;
        commandSourceStack.location = shallowCopy(this.location);
        commandSourceStack.rotation = shallowCopy(this.rotation);
        commandSourceStack.dimension = this.dimension;
        commandSourceStack.anchor = this.anchor;
        commandSourceStack.#internal.parentId = this.id;
        commandSourceStack.origin = shallowCopy(this.origin);
        return commandSourceStack;
    }

    readSelector(selector) {
        if (Array.isArray(selector)) {
            if (selector.every(_ => _ instanceof Entity)) return selector;
        }

        if (typeof selector !== "string") {
            throw new TypeError("Unexpected type passed to function argument[0].");
        }
        
        if (selector.charAt(0) !== "@") {
            const players = world.getPlayers({ name: selector });
            if (players.length === 0) {
                return [];
            }
            else return players;
        }

        let type = selector.slice(1, 2);
        if (!"parse".split("").includes(type)) {
            if (selector.slice(1, 10) === "initiator") {
                type = "initiator";
            }
            else throw new SyntaxError("Invalid selector type");
        }

        let parameters = (type === "initiator") ? selector.slice(10) : selector.slice(2);
        
        if (parameters !== "" && !(parameters.startsWith("[") && parameters.endsWith("]"))) {
            throw new SyntaxError("Invalid string");
        }

        parameters = parameters.slice(1, -1);

        const quoteRegExp = /"(.*?)(?<!\\)"/g;
        const braceRegExp = /\{[^\{\}]*\}/g;

        const deleted = {
            insideQuote: {
                id: Random.uuid(),
                matching: parameters.match(quoteRegExp)
            },
            insideBraces: {
                id: Random.uuid(),
                matching: parameters.match(braceRegExp)
            }
        };

        let list = parameters
            .replace(quoteRegExp, deleted.insideQuote.id)
            .replace(braceRegExp, deleted.insideBraces.id)
            .replace(/\s+/g, "")
            .split(/\s*,\s*/g);

        list = list.map(text => {
            while (text.includes(deleted.insideQuote.id) && deleted.insideQuote.matching !== null) {
                text = text.replace(deleted.insideQuote.id, deleted.insideQuote.matching[0]);
                deleted.insideQuote.matching.shift();
            }
            while (text.includes(deleted.insideBraces.id) && deleted.insideBraces.matching !== null) {
                const id = Random.uuid();
                const scoreList = deleted.insideBraces.matching[0].slice(1, -1)
                    .replace(/=/g, id).split(",")
                    .map(_ => {
                        const [name, value] = _.split(id);
                        const object = {};
                        object[name] = value;
                        return object;
                    });
                text = text.replace(deleted.insideBraces.id, JSON.stringify(scoreList));
                deleted.insideBraces.matching.shift();
            }
            return text;
        });

        list = list.map(_ => _.split("=").map((_, __, array) => {
            let value = numberFunctions.toNumber(_) ?? _;

            if (typeof value === "string") {
                if ("xyz".split("").includes(array[0]) && value.charAt(0) === "~" && numberFunctions.toNumber(value.slice(1)) !== undefined) {
                    value = this.location[array[0]] + numberFunctions.toNumber(value.slice(1));
                }
            }

            return value;
        }));

        if (list[0][0] === "" && list.length === 1) list = [];

        const queryOptions = {
            location: shallowCopy(this.location),
            excludeTypes: [],
            excludeFamilies: [],
            excludeNames: [],
            excludeTags: [],
            excludeGameModes: [],
            tags: [],
            scoreOptions: []
        };

        for (const parameter of list) {
            /**
             * @param {("string" | "int" | "float")[]} types
             * @throws
             */
            function check(...types) {
                let failFlag = true;
                for (const type of types) {
                    switch (type) {
                        case "string": {
                            if (typeof parameter[1] === "string") {
                                failFlag = false;
                            }
                            break;
                        }
                        case "int": {
                            if (Number.isInteger(parameter[1])) {
                                failFlag = false;
                            }
                            break;
                        }
                        case "float": {
                            if (typeof parameter[1] === "number" && !Number.isInteger(parameter[1])) {
                                failFlag = false;
                            }
                            break;
                        }
                    }
                }
                if (failFlag) throw new TypeError(`Unexpected type passed to selector "${parameter[0]}".`);
            }

            switch (parameter[0].replace(/\s+/g, "")) {
                case "c": {
                    check("int");
                    if (parameter[1] > 0) {
                        queryOptions.closest = parameter[1];
                    }
                    else if (parameter[1] < 0) {
                        queryOptions.farthest = -parameter[1];
                    }
                    else throw new SyntaxError("Invalid entity limit");
                    break;
                }
                case "x": {
                    check("int", "float");
                    queryOptions.location.x = parameter[1];
                    break;
                }
                case "y": {
                    check("int", "float");
                    queryOptions.location.y = parameter[1];
                    break;
                }
                case "z": {
                    check("int", "float");
                    queryOptions.location.z = parameter[1];
                    break;
                }
                case "type": {
                    check("string");
                    if (parameter[1].startsWith("!")) {
                        queryOptions.excludeTypes.push(parameter[1].slice(1));
                    }
                    else queryOptions.type = parameter[1];
                    break;
                }
                case "family": {
                    check("string");
                    if (parameter[1].startsWith("!")) {
                        queryOptions.excludeFamilies.push(parameter[1].slice(1));
                    }
                    else queryOptions.families.push(parameter[1]);
                    break;
                }
                case "name": {
                    check("string");
                    if (parameter[1].startsWith("!")) {
                        queryOptions.excludeNames.push(parameter[1].slice(1));
                    }
                    else queryOptions.name = parameter[1];
                    break;
                }
                case "tag": {
                    check("string");
                    if (parameter[1].startsWith("!")) {
                        queryOptions.excludeTags.push(parameter[1].slice(1));
                    }
                    else queryOptions.tags.push(parameter[1]);
                    break;
                }
                case "m": {
                    check("string");
                    const gameModes = {
                        survival: [0, "s", "survival"],
                        creative: [1, "c", "creative"],
                        adventure: [2, "a", "adventure"],
                        spectator: ["spectator"]
                    };
                    if (parameter[1].startsWith("!")) {
                        for (const name of Object.keys(gameModes)) {
                            if (gameModes[name].includes(parameter[1].slice(1))) {
                                queryOptions.excludeGameModes.push(name);
                                break;
                            }
                        }
                    }
                    else {
                        for (const name of Object.keys(gameModes)) {
                            if (gameModes[name].includes(parameter[1])) {
                                queryOptions.gameMode = name;
                                break;
                            }
                        }
                    }
                    break;
                }
                case "r": {
                    check("int", "float");
                    queryOptions.maxDistance = parameter[1];
                    break;
                }
                case "rm": {
                    check("int", "float");
                    queryOptions.minDistance = parameter[1];
                    break;
                }
                case "l": {
                    check("int");
                    queryOptions.maxLevel = parameter[1];
                    break;
                }
                case "lm": {
                    check("int");
                    queryOptions.minLevel = parameter[1];
                    break;
                }
                case "dx": {
                    check("int", "float");
                    if (queryOptions.volume === undefined) {
                        queryOptions.volume = new BlockAreaSize(1, 1, 1);
                    }
                    if (parameter[1] > 0) {
                        queryOptions.volume.x = parameter[1] + 1;
                    }
                    else if (parameter[1] < 0) {
                        queryOptions.volume.x = parameter[1] - 1;
                    }
                    else {
                        queryOptions.volume.x = 1;
                    }
                    break;
                }
                case "dy": {
                    check("int", "float");
                    if (queryOptions.volume === undefined) {
                        queryOptions.volume = new BlockAreaSize(1, 1, 1);
                    }
                    if (parameter[1] > 0) {
                        queryOptions.volume.y = parameter[1] + 1;
                    }
                    else if (parameter[1] < 0) {
                        queryOptions.volume.y = parameter[1] - 1;
                    }
                    else {
                        queryOptions.volume.y = 1;
                    }
                    break;
                }
                case "dz": {
                    check("int", "float");
                    if (queryOptions.volume === undefined) {
                        queryOptions.volume = new BlockAreaSize(1, 1, 1);
                    }
                    if (parameter[1] > 0) {
                        queryOptions.volume.z = parameter[1] + 1;
                    }
                    else if (parameter[1] < 0) {
                        queryOptions.volume.z = parameter[1] - 1;
                    }
                    else {
                        queryOptions.volume.z = 1;
                    }
                    break;
                }
                case "scores": {
                    try {
                        const scoreList = JSON.parse(parameter[1]);

                        for (const score of scoreList) {
                            const objective = Object.keys(score)[0];
                            if (objective === undefined) throw new SyntaxError("Invalid string");
                            let value = score[objective];

                            const option = { objective };

                            if (value.startsWith("!")) {
                                option.exclude = true;
                                value = value.slice(1);
                            }
                            if (value.slice(0, 2) === ".." && numberFunctions.toNumber(value.slice(2)) !== undefined) {
                                if (!Number.isInteger(numberFunctions.toNumber(value.slice(2)))) {
                                    throw new TypeError("Unexpected type passed to selector \"scores\".");
                                }
                                option.maxScore = numberFunctions.toNumber(value.slice(2));
                            }
                            else if (value.slice(-2) === ".." && numberFunctions.toNumber(value.slice(0, -2)) !== undefined) {
                                if (!Number.isInteger(numberFunctions.toNumber(value.slice(0, -2)))) {
                                    throw new TypeError("Unexpected type passed to selector \"scores\".");
                                }
                                option.minScore = numberFunctions.toNumber(value.slice(0, -2));
                            }
                            else if (numberFunctions.toNumber(value) !== undefined) {
                                if (!Number.isInteger(numberFunctions.toNumber(value))) {
                                    throw new TypeError("Unexpected type passed to selector \"scores\".");
                                }
                                option.maxScore = numberFunctions.toNumber(value);
                                option.minScore = numberFunctions.toNumber(value);
                            }
                            else {
                                const [min, max] = value.split("..").map(numberFunctions.toNumber);
                                if (min !== undefined && max !== undefined) {
                                    if (!Number.isInteger(min) || !Number.isInteger(max)) {
                                        throw new TypeError("Unexpected type passed to selector \"scores\".");
                                    }
                                    option.maxScore = max;
                                    option.minScore = min;
                                }
                                else throw new SyntaxError("Invalid string");
                            }
                            queryOptions.scoreOptions.push(option);
                        }
                    }
                    catch (e) {
                        throw e;
                    }
                    break;
                }
                case "rx": {
                    check("int", "float");
                    queryOptions.maxVerticalRotation = parameter[1];
                    break;
                }
                case "rxm": {
                    check("int", "float");
                    queryOptions.minVerticalRotation = parameter[1];
                    break;
                }
                case "ry": {
                    check("int", "float");
                    queryOptions.maxHorizontalRotation = parameter[1];
                    break;
                }
                case "rym": {
                    check("int", "float");
                    queryOptions.minHorizontalRotation = parameter[1];
                    break;
                }
                case "hasitem": {
                    throw new Error("hasitem=に相当するEntityQueryOptionsが存在しないため、使用できません");
                }
                case "haspermission": {
                    throw new Error("haspermission=に相当するEntityQueryOptionsが存在しないため、使用できません");
                }
                default: {
                    throw new SyntaxError("Not a selector parameter");
                }
            }
        }

        for (const optionName of Object.keys(queryOptions)) {
            if (Array.isArray(queryOptions[optionName])) {
                if (queryOptions[optionName].length === 0) {
                    queryOptions[optionName] = undefined;
                    delete queryOptions[optionName];
                }
            }
        }

        let entityList;
        switch (type) {
            case "p": {
                queryOptions.type = "minecraft:player";
                queryOptions.closest = 1;
                entityList = this.dimension.getEntities(queryOptions);
                break;
            }
            case "a": {
                entityList = this.dimension.getPlayers(queryOptions);
                break;
            }
            case "r": {
                if (!queryOptions.excludeTypes[0] && queryOptions.type === undefined) {
                    queryOptions.type = "minecraft:player";
                }
                if (queryOptions.closest > 1 || queryOptions.farthest > 1) {
                    entityList = Random.shuffle(this.dimension.getEntities(queryOptions));
                }
                else {
                    entityList = [Random.shuffle(this.dimension.getEntities(queryOptions))[0]];
                }
                break;
            }
            case "s": {
                if (this.entity) entityList = [this.entity];
                else entityList = [];
                break;
            }
            case "e": {
                delete queryOptions.gameMode;
                delete queryOptions.excludeGameModes;
                entityList = this.dimension.getEntities(queryOptions);
                break;
            }
            case "initiator": {
                throw new SyntaxError("@initiatorには対応していません");
            }
            default: {
                throw new Error("どうやってここまで？"); // never happens
            }
        }

        return entityList;
    }

    readCoordinates(coordinates) {
        if (MultiDimensionalVector.isVector3(coordinates) || MultiDimensionalVector.isVector2(coordinates)) return coordinates;

        if (typeof coordinates !== "string") throw new TypeError("Unexpected type passed to function argument[0].");

        const abs_rel = /(?:(\s*~-?\d*(?:\.\d+)?|\s*-?\d+(?:\.\d+)?)(\s*~-?\d*(?:\.\d+)?|\s+-?\d+(?:\.\d+)?)(\s*~-?\d*(?:\.\d+)?|\s+-?\d+(?:\.\d+)?))/g;
        const local = /(?:(\s*\^-?\d*(?:\.\d+)?)(\s*\^-?\d*(?:\.\d+)?)(\s*\^-?\d*(?:\.\d+)?))/g;

        const match_abs_rel = coordinates.match(abs_rel);
        const match_local = coordinates.match(local);

        function isCompletelyMatching(regExp) {
            return coordinates.replace(regExp, "").replace(/\s+/g, "") === "";
        }

        const result = {};

        if (match_abs_rel === null && match_local === null) {
            throw new SyntaxError("Invalid string");
        }
        else if (isCompletelyMatching(match_abs_rel)) {
            const match = abs_rel.exec(coordinates).slice(1).map(str => str.replace(/\s+/g, ""));
            const input = match.map((value, index) => [["x", "y", "z"][index], value]);

            for (const [component, value] of input) {
                if (value.charAt(0) === "~") {
                    if (numberFunctions.toNumber(value.slice(1) === "" ? "0" : value.slice(1)) === undefined) {
                        throw new SyntaxError("Invalid string");
                    }
                    result[component] = {
                        type: "relative",
                        value: numberFunctions.toNumber(value.slice(1) === "" ? "0" : value.slice(1))
                    };
                }
                else {
                    const add = (component !== "y" && !value.includes(".")) ? 0.5 : 0;
                    if (numberFunctions.toNumber(value) === undefined) {
                        throw new SyntaxError("Invalid string");
                    }
                    result[component] = {
                        type: "absolute",
                        value: numberFunctions.toNumber(value) + add
                    };
                }
            }
        }
        else if (isCompletelyMatching(match_local)) {
            const match = local.exec(coordinates).slice(1).map(str => str.replace(/\s+/g, ""));
            const input = match.map((value, index) => [["x", "y", "z"][index], value]);

            for (const [component, value] of input) {
                if (numberFunctions.toNumber(value.slice(1) === "" ? "0" : value.slice(1)) === undefined) {
                    throw new SyntaxError("Invalid string");
                }
                result[component] = {
                    type: "local",
                    value: numberFunctions.toNumber(value.slice(1) === "" ? "0" : value.slice(1))
                };
            }
        }
        else {
            throw new SyntaxError("Invalid string");
        }

        let location = MultiDimensionalVector.from(this.location);
        const localDirections = {};
        for (const component of ["x", "y", "z"]) {
            const { type, value } = result[component];
            switch (type) {
                case "absolute": {
                    location[component] = value;
                    break;
                }
                case "relative": {
                    location[component] += value;
                    break;
                }
                case "local": {
                    const direction = MultiDimensionalVector.getDirectionFromRotation(this.rotation).getLocalDirections()[component];
                    localDirections[component] = direction.setLength(value);
                    break;
                }
            }
        }
        if (Object.keys(localDirections)[0]) {
            const { x, y, z } = localDirections;
            location = location.add(x.add(y).add(z)).add(this.getEntityAnchor());
        }

        return location;
    }

    readRotation(rotation) {
        if (typeof rotation !== "string") throw new TypeError("Unexpected type passed to function argument[0].");

        const rot_abs_rel = /(?:(\s*~-?\d*(?:\.\d+)?|\s*-?\d+(?:\.\d+)?)(\s*~-?\d*(?:\.\d+)?|\s+-?\d+(?:\.\d+)?))/g;

        const result = {};

        const match_rot = rotation.match(rot_abs_rel);
        if (match_rot === null) {
            throw new SyntaxError("Invalid string");
        }
        else if (rotation.replace(match_rot, "").replace(/\s+/g, "") === "") {
            const match = rot_abs_rel.exec(rotation).slice(1).map(str => str.replace(/\s+/g, ""));
            const input = match.map((value, index) => [["y", "x"][index], value]);

            for (const [component, value] of input) {
                if (value.charAt(0) === "~") {
                    if (numberFunctions.toNumber(value.slice(1) === "" ? "0" : value.slice(1)) === undefined) {
                        throw new SyntaxError("Invalid string");
                    }
                    result[component] = {
                        type: "relative",
                        value: numberFunctions.toNumber(value.slice(1) === "" ? "0" : value.slice(1))
                    };
                }
                else {
                    if (numberFunctions.toNumber(value) === undefined) {
                        throw new SyntaxError("Invalid string");
                    }
                    result[component] = {
                        type: "absolute",
                        value: numberFunctions.toNumber(value)
                    };
                }
            }
        }
        else {
            throw new SyntaxError("Invalid string");
        }

        let resultRotation = MultiDimensionalVector.from(this.rotation);
        for (const component of ["y", "x"]) {
            const { type, value } = result[component];
            switch (type) {
                case "absolute": {
                    resultRotation[component] = value;
                    break;
                }
                case "relative": {
                    resultRotation[component] += value;
                    break;
                }
            }
        }

        return resultRotation;
    }
    
    readScore(score) {
        if (typeof score === "number") return score;

        if (typeof score !== "string") return;

        const quoteRegExp = /"(.*?)(?<!\\)"/g;
        const id = Random.uuid();
        const matching = score.match(quoteRegExp);

        /**
         * @type {[string, import("@minecraft/server").ScoreboardObjective | undefined]}
         */
        const [scoreHolderText, objective] = score.replace(quoteRegExp, id).split(/\s+/g)
        .map((text, index) => {
            let result = text;
            if (text.includes(id) && matching !== null) {
                result = text.replace(id, matching[0]);
                matching.shift();
            }

            if (index === 1) {
                result = world.scoreboard.getObjective(result);
            }

            return result;
        });

        if (objective === undefined) return undefined;
        let targets;

        targets = this.readSelector(scoreHolderText);
        if (targets.length === 0 && !scoreHolderText.startsWith("@")) targets = [scoreHolderText];

        if (targets.length > 1) {
            throw new Error("セレクターを満たすエンティティが複数体いるよ");
        }
        else if (targets[0] === undefined) {
            return undefined;
        }

        return objective.getScore(targets[0]);
    }

    getEntityAnchor() {
        if (!this.entity) {
            return MultiDimensionalVector.const("zero");
        }
        else if (this.anchor === "eyes") {
            return new MultiDimensionalVector(this.entity.getHeadLocation()).subtract(this.entity.location);
        }
        else if (this.anchor === "feet") {
            return MultiDimensionalVector.const("zero");
        }
        else throw new TypeError("anchorに入っている値が無効だよ");
    }

    runCommand(command) {
        if (typeof command !== "string") {
            throw new TypeError("第一引数はstringだよ");
        }

        const { x: lx, y: ly, z: lz } = this.location;
        const coords = lx.toString() + " " + ly.toString() + " " + lz.toString();

        const { x: rx, y: ry } = this.rotation;
        const rot = ry.toString() + " " + rx.toString();

        const dim = this.dimension.id.replace("minecraft:", "");

        const execute = `execute in ${dim} positioned ${coords} rotated ${rot} run ${command}`;

        try {
            if (this.entity) {
                return this.entity.runCommand(execute);
            }
            else {
                return world.getDimension("overworld").runCommand(execute);
            }
        }
        catch {
            throw new Error("コマンドからエラーが見つかったよ");
        }
    }

    static readBlockStates(text) {
        if (typeof text !== "string") {
            throw new TypeError();
        }
    
        if (!(text.startsWith("[") && text.endsWith("]"))) return;
    
        text = text.slice(1, -1);
    
        const quoteRegExp = /"(.*?)(?<!\\)"/g;
        const id = Random.uuid();
        let matching = text.match(quoteRegExp);
    
        const _ = text
            .replace(quoteRegExp, id).split(/,/g)
            .map(char => {
                while (char.includes(id) && matching !== null) {
                    char = char.replace(id, matching[0]);
                    matching.shift();
                }
    
                return char;
            })
            .map(_ => {
                matching = _.match(quoteRegExp);
                return _
                    .replace(quoteRegExp, id)
                    .split(/=/g)
                    .map(char => {
                        while (char.includes(id) && matching !== null) {
                            char = char.replace(id, matching[0]);
                            matching.shift();
                        }
            
                        return char;
                    });
            });
        
        const record = {};
        for (const [key, value] of _) {
            record[key.startsWith("\"") && key.endsWith("\"") ? key.slice(1, -1) : key] = numberFunctions.toNumber(value) ?? (value === "true" ? true : (value === "false" ? false : (value.slice(1, -1))));
        }
    
        return record;
    }
}
