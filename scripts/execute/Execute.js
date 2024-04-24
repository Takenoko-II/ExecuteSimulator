import { Entity, MolangVariableMap, Vector, world } from "@minecraft/server";

import { MultiDimensionalVector } from "../utils/index";

import { CommandSourceStack } from "./CommandSourceStack";

export class Execute {
    /**
     * @param {CommandSourceStack} defaultSource 
     */
    constructor(defaultSource = new CommandSourceStack()) {
        if (defaultSource instanceof CommandSourceStack) {
            this.commandSourceStacks = [defaultSource];
            this.transition = [[defaultSource]];
        }
        else throw new TypeError("第一引数はCommandSourceStack|undefinedだよ");
    }

    /**
     * @param {string | Entity[]} selector
     */
    as(selector) {
        if (typeof selector !== "string" && !Array.isArray(selector)) {
            throw new TypeError("第一引数はstring|Entity[]だよ");
        }

        if (Array.isArray(selector)) {
            if (selector.some(_ => !(_ instanceof Entity))) {
                throw new TypeError("第一引数はstring|Entity[]だよ");
            }
        }

        const result = [];

        this.commandSourceStacks.forEach(commandSourceStack => {
            const list = [];
            commandSourceStack.readSelector(selector).forEach(entity => {
                const clone = commandSourceStack.clone();
                clone.entity = entity;

                list.push(clone);
                this.transition.push([clone]);
            });

            result.push(...list);
        });

        this.commandSourceStacks = result;

        return this;
    }

    /**
     * @param {string | Entity[]} selector
     */
    at(selector) {
        if (typeof selector !== "string" && !Array.isArray(selector)) {
            throw new TypeError("第一引数はstring|Entity[]だよ");
        }

        if (Array.isArray(selector)) {
            if (selector.some(_ => !(_ instanceof Entity))) {
                throw new TypeError("第一引数はstring|Entity[]だよ");
            }
        }

        const result = [];

        this.commandSourceStacks.forEach(commandSourceStack => {
            const list = [];
            commandSourceStack.readSelector(selector).forEach(entity => {
                const clone = commandSourceStack.clone();
                clone.location = entity.location;
                clone.rotation = entity.getRotation();
                clone.dimension = entity.dimension;

                list.push(clone);
                this.transition.push([clone]);
            });

            result.push(...list);
        });

        this.commandSourceStacks = result;

        return this;
    }

    get positioned() {
        return {
            /**
             * @param {string | import("@minecraft/server").Vector3} location
             */
            $: (location) => {
                if (typeof location !== "string" && !MultiDimensionalVector.isVector3(location)) {
                    throw new TypeError("第一引数はstring|Vector3だよ");
                }

                this.commandSourceStacks = this.commandSourceStacks.map(commandSourceStack => {

                    const clone = commandSourceStack.clone();

                    clone.location = clone.readCoordinates(location);
                    clone.anchor = "feet";
    
                    this.transition.find(list => list.includes(commandSourceStack)).push(clone);

                    return clone;
                });

                return this;
            },
            /**
             * @param {string | Entity[]} selector
             */
            as: (selector) => {
                if (typeof selector !== "string" && !Array.isArray(selector)) {
                    throw new TypeError("第一引数はstring|Entity[]だよ");
                }
    
                if (Array.isArray(selector)) {
                    if (selector.some(_ => !(_ instanceof Entity))) {
                        throw new TypeError("第一引数はstring|Entity[]だよ");
                    }
                }

                const result = [];

                this.commandSourceStacks.forEach(commandSource => {
                    const list = [];
                    commandSource.readSelector(selector).forEach(entity => {
                        const clone = commandSource.clone();
                        clone.location = entity.location;
    
                        list.push(clone);
                        this.transition.push([clone]);
                    });
    
                    result.push(...list);
                });

                this.commandSourceStacks = result;

                return this;
            }
        };
    }

    set positioned(_) {
        throw new Error("positionedは読み取り専用だよ");
    }

    get rotated() {
        return {
            /**
             * @param {string | import("@minecraft/server").Vector2} rotation
             */
            $: (rotation) => {
                if (typeof rotation !== "string" && !MultiDimensionalVector.isVector2(rotation)) {
                    throw new TypeError("第一引数はstring|Vector2だよ");
                }

                this.commandSourceStacks = this.commandSourceStacks.map(commandSource => {
                    commandSource.rotation = commandSource.readRotation(rotation);
                    return commandSource;
                });

                return this;
            },
            /**
             * @param {string | Entity[]} selector
             */
            as: (selector) => {
                if (typeof selector !== "string" && !Array.isArray(selector)) {
                    throw new TypeError("第一引数はstring|Entity[]だよ");
                }
    
                if (Array.isArray(selector)) {
                    if (selector.some(_ => !(_ instanceof Entity))) {
                        throw new TypeError("第一引数はstring|Entity[]だよ");
                    }
                }

                const result = [];

                this.commandSourceStacks.forEach(commandSource => {
                    const list = [];
                    commandSource.readSelector(selector).forEach(entity => {
                        const clone = commandSource.clone();
                        clone.rotation = entity.getRotation();
    
                        list.push(clone);
                        this.transition.push([clone]);
                    });
    
                    result.push(...list);
                });

                this.commandSourceStacks = result;

                return this;
            }
        };
    }

    set rotated(_) {
        throw new Error("rotatedは読み取り専用だよ");
    }

    get facing() {
        return {
            /**
             * @param {string | import("@minecraft/server").Vector3} location
             */
            $: (location) => {
                if (typeof location !== "string" && !MultiDimensionalVector.isVector3(location)) {
                    throw new TypeError("第一引数はstring|Vector3だよ");
                }

                this.commandSourceStacks = this.commandSourceStacks.map(commandSourceStack => {
                    const clone = commandSourceStack.clone();
    
                    clone.rotation = MultiDimensionalVector.from(clone.location)
                        .add(clone.getEntityAnchor())
                        .getDirectionTo(clone.readCoordinates(location))
                        .getRotation();
                    
                    this.transition.find(list => list.includes(commandSourceStack)).push(clone);
    
                    return clone;
                });

                return this;
            },
            /**
             * @param {string | Entity[]} selector
             * @param {"eyes" | "feet"} anchor
             */
            entity: (selector, anchor) => {
                if (typeof selector !== "string" && !Array.isArray(selector)) {
                    throw new TypeError("第一引数はstring|Entity[]だよ");
                }
                else if (!["eyes", "feet"].includes(anchor)) {
                    throw new TypeError('第二引数は"eyes"|"feet"だよ');
                }
    
                if (Array.isArray(selector)) {
                    if (selector.some(_ => !(_ instanceof Entity))) {
                        throw new TypeError("第一引数はstring|Entity[]だよ");
                    }
                }

                const result = [];

                this.commandSourceStacks.forEach(commandSourceStack => {
                    const list = [];
                    commandSourceStack.readSelector(selector).forEach(entity => {
                        let targetLocation;
    
                        if (anchor === "feet") {
                            targetLocation = entity.location;
                        }
                        else {
                            targetLocation = entity.getHeadLocation();
                        }
    
                        const clone = commandSourceStack.clone();
                        clone.rotation = MultiDimensionalVector.from(clone.location)
                            .add(clone.getEntityAnchor())
                            .getDirectionTo(targetLocation)
                            .getRotation();
    
                        list.push(clone);
                        this.transition.push([clone]);
                    });
    
                    result.push(...list);
                });

                this.commandSourceStacks = result;

                return this;
            }
        };
    }

    set facing(_) {
        throw new Error("facingは読み取り専用だよ");
    }

    /**
     * @param {string} axes
     */
    align(axes) {
        if (typeof axes !== "string") {
            throw new TypeError("第一引数はstringだよ");
        }
        else if (!(axes.split("").some(axis => "xyz".split("").includes(axis)) && new Set(axes.split("")).size === axes.length)) {
            throw new SyntaxError("切り捨てる軸の指定が間違ってるよ");
        }

        this.commandSourceStacks = this.commandSourceStacks.map(commandSourceStack => {
            const clone = commandSourceStack.clone();

            axes.split("").forEach(axis => {
                clone.location[axis] = Math.floor(clone.location[axis]);
            });

            clone.anchor = "feet";

            this.transition.find(list => list.includes(commandSourceStack)).push(clone);

            return clone;
        });

        return this;
    }

    get if() {
        return {
            /**
             * @param {string | Entity[]} selector
             */
            entity: (selector) => {
                if (typeof selector !== "string" && !Array.isArray(selector)) {
                    throw new TypeError("第一引数はstring|Entity[]だよ");
                }
    
                if (Array.isArray(selector)) {
                    if (selector.some(_ => !(_ instanceof Entity))) {
                        throw new TypeError("第一引数はstring|Entity[]だよ");
                    }
                }

                this.commandSourceStacks = this.commandSourceStacks.filter(commandSource => {
                    const entities = commandSource.readSelector(selector);
                    return entities.length > 0;
                });

                return this;
            },
            /**
             * @param {string | import("@minecraft/server").Vector3} location
             * @param {string} id
             * @param {string} states
             */
            block: (location, id, states) => {
                if (typeof location !== "string" && !MultiDimensionalVector.isVector3(location)) {
                    throw new TypeError("第一引数はstring|Vector3だよ");
                }
                else if (typeof id !== "string") {
                    throw new TypeError("第二引数はstringだよ");
                }
                else if (states !== undefined && typeof states !== "string") {
                    throw new TypeError("第三引数はstring|undefinedだよ");
                }

                this.commandSourceStacks = this.commandSourceStacks.filter(commandSource => {
                    const location_ = commandSource.readCoordinates(location);
                    try {
                        const block = commandSource.dimension.getBlock(location_);
                        if (states === undefined) return block.type.id === id;
                        else return block.permutation.matches(id, CommandSourceStack.readBlockStates(states));
                    }
                    catch {
                        if (id === "air" || id === "minecraft:air") return true;
                        else return false;
                    }
                });

                return this;
            },
            /**
             * @param {string | import("@minecraft/server").Vector3} bigin
             * @param {string | import("@minecraft/server").Vector3} end
             * @param {string | import("@minecraft/server").Vector3} destination
             * @param {"all" | "masked"} scanMode
             */
            blocks: (bigin, end, destination, scanMode) => {
                if (typeof bigin !== "string" && !MultiDimensionalVector.isVector3(bigin)) {
                    throw new TypeError("第一引数はstring|Vector3だよ");
                }
                else if (typeof end !== "string" && !MultiDimensionalVector.isVector3(end)) {
                    throw new TypeError("第二引数はstring|Vector3だよ");
                }
                else if (typeof destination !== "string" && !MultiDimensionalVector.isVector3(destination)) {
                    throw new TypeError("第三引数はstring|Vector3だよ");
                }
                else if (!["all", "masked"].includes(scanMode)) {
                    throw new TypeError('第四引数は"all"|"masked"だよ');
                }

                this.commandSourceStacks = this.commandSourceStacks.filter(commandSource => {
                    const ifBlocks = [bigin, end, destination, scanMode].join(" ");
                    const { successCount } = commandSource.runCommand(`execute if blocks ${ifBlocks}`);
                    if (successCount > 0) return true;
                    else return false;
                });

                return this;
            },
            /**
             * @param {string | number} scoreA
             * @param {string} operator
             * @param {string | number} scoreB
             */
            score: (scoreA, operator, scoreB) => {
                if (!["string", "number"].includes(typeof scoreA)) {
                    throw new TypeError("第一引数はstring|numberだよ");
                }
                else if (typeof operator !== "string") {
                    throw new TypeError("第二引数はstringだよ");
                }
                else if (!["string", "number"].includes(typeof scoreB)) {
                    throw new TypeError("第三引数はstring|numberだよ");
                }

                this.commandSourceStacks = this.commandSourceStacks.filter(commandSource => {
                    const a = commandSource.readScore(scoreA);
                    const b = commandSource.readScore(scoreB);

                    if (a === undefined || b === undefined) {
                        return false;
                    }

                    switch (operator) {
                        case "=":
                            return a === b;
                        case "<":
                            return a < b;
                        case ">":
                            return a > b;
                        case "=<":
                            return a <= b;
                        case "=>":
                            return a >= b;
                        default:
                            throw new SyntaxError("存在しない演算子だよ");
                    }
                });

                return this;
            }
        };
    }

    set if(_) {
        throw new Error("ifは読み取り専用だよ");
    }

    get unless() {
        return {
            /**
             * @param {string | Entity[]} selector
             */
            entity: (selector) => {
                if (typeof selector !== "string" && !Array.isArray(selector)) {
                    throw new TypeError("第一引数はstring|Entity[]だよ");
                }
    
                if (Array.isArray(selector)) {
                    if (selector.some(_ => !(_ instanceof Entity))) {
                        throw new TypeError("第一引数はstring|Entity[]だよ");
                    }
                }

                this.commandSourceStacks = this.commandSourceStacks.filter(commandSource => {
                    const entities = commandSource.readSelector(selector);
                    return entities.length === 0;
                });

                return this;
            },
            /**
             * @param {string | import("@minecraft/server").Vector3} location
             * @param {string} id
             * @param {string} states
             */
            block: (location, id, states) => {
                if (typeof location !== "string" && !MultiDimensionalVector.isVector3(location)) {
                    throw new TypeError("第一引数はstring|Vector3だよ");
                }
                else if (typeof id !== "string") {
                    throw new TypeError("第二引数はstringだよ");
                }
                else if (states !== undefined && typeof states !== "string") {
                    throw new TypeError("第三引数はstring|undefinedだよ");
                }

                this.commandSourceStacks = this.commandSourceStacks.filter(commandSource => {
                    const location_ = commandSource.readCoordinates(location);
                    try {
                        const block = commandSource.dimension.getBlock(location_);
                        if (states === undefined) return block.type.id !== id;
                        else return !block.permutation.matches(id, CommandSourceStack.readBlockStates(states));
                    }
                    catch {
                        if (id === "air" || id === "minecraft:air") return false;
                        else return true;
                    }
                });

                return this;
            },
            /**
             * @param {string | import("@minecraft/server").Vector3} bigin
             * @param {string | import("@minecraft/server").Vector3} end
             * @param {string | import("@minecraft/server").Vector3} destination
             * @param {"all" | "masked"} scanMode
             */
            blocks: (bigin, end, destination, scanMode) => {
                if (typeof bigin !== "string" && !MultiDimensionalVector.isVector3(bigin)) {
                    throw new TypeError("第一引数はstring|Vector3だよ");
                }
                else if (typeof end !== "string" && !MultiDimensionalVector.isVector3(end)) {
                    throw new TypeError("第二引数はstring|Vector3だよ");
                }
                else if (typeof destination !== "string" && !MultiDimensionalVector.isVector3(destination)) {
                    throw new TypeError("第三引数はstring|Vector3だよ");
                }
                else if (!["all", "masked"].includes(scanMode)) {
                    throw new TypeError('第四引数は"all"|"masked"だよ');
                }

                this.commandSourceStacks = this.commandSourceStacks.filter(commandSource => {
                    const ifBlocks = [bigin, end, destination, scanMode].join(" ");
                    const { successCount } = commandSource.runCommand(`execute unless blocks ${ifBlocks}`);
                    if (successCount > 0) return false;
                    else return true;
                });

                return this;
            },
            /**
             * @param {string | number} scoreA
             * @param {string} operator
             * @param {string | number} scoreB
             */
            score: (scoreA, operator, scoreB) => {
                if (!["string", "number"].includes(typeof scoreA)) {
                    throw new TypeError("第一引数はstring|numberだよ");
                }
                else if (typeof operator !== "string") {
                    throw new TypeError("第二引数はstringだよ");
                }
                else if (!["string", "number"].includes(typeof scoreB)) {
                    throw new TypeError("第三引数はstring|numberだよ");
                }

                this.commandSourceStacks = this.commandSourceStacks.filter(commandSource => {
                    const a = commandSource.readScore(scoreA);
                    const b = commandSource.readScore(scoreB);
    
                    if (a === undefined || b === undefined) {
                        return true;
                    }
    
                    switch (operator) {
                        case "=":
                            return a !== b;
                        case "<":
                            return !(a < b);
                        case ">":
                            return !(a > b);
                        case "=<":
                            return !(a <= b);
                        case "=>":
                            return !(a >= b);
                        default:
                            throw new SyntaxError("存在しない演算子だよ");
                    }
                });

                return this;
            }
        };
    }

    set unless(_) {
        throw new Error("unlessは読み取り専用だよ");
    }

    /**
     * @param {"overworld" | "nether" | "the_end"} dimension
     */
    "in"(dimension) {
        if (!["overworld", "nether", "the_end"].includes(dimension)) {
            throw new TypeError('第一引数は"overworld"|"nether"|"the_end"だよ');
        }

        this.commandSourceStacks = this.commandSourceStacks.map(commandSource => {
            commandSource.dimension = world.getDimension(dimension);
            return commandSource;
        });

        return this;
    }

    /**
     * @param {"eyes" | "feet"} anchor
     */
    anchored(anchor) {
        if (!["eyes", "feet"].includes(anchor)) {
            throw new TypeError('第一引数は"eyes"|"feet"だよ');
        }

        this.commandSourceStacks = this.commandSourceStacks.map(commandSourceStack => {
            commandSourceStack.anchor = anchor;
            return commandSourceStack;
        });

        return this;
    }

    /**
     * @param {string} command
     */
    run(command) {
        if (typeof command !== "string") {
            throw new TypeError("第一引数はstringだよ");
        }

        for (const commandSourceStack of this.commandSourceStacks) {
            commandSourceStack.runCommand(command);
        }
    }

    display() {
        const molangVariableMap = new MolangVariableMap();

        const origin = this.transition[0][0];
        origin.dimension.spawnParticle("minecraft:obsidian_glow_dust_particle", origin.location);

        for (let i = 1; i < this.transition.length; i++) {
            const _ = this.transition[i];
            const toI = _[0];

            const fromI = this.transition.find(list => list.some(el => el.id === toI.parentId)).slice(-1)[0];
            molangVariableMap.setColorRGB("variable.color", { red: 0, green: 1, blue: 0 });

            for (let l = 1; l <= 10; l++) {
                const location = Vector.lerp(fromI.location, toI.location, l / 10);
                try {
                    fromI.dimension.spawnParticle("minecraft:colored_flame_particle", location, molangVariableMap);
                }
                catch {}
            }
            

            molangVariableMap.setColorRGB("variable.color", { red: 0, green: 0.5, blue: 1 });

            for (let j = 1; j < _.length; j++) {
                const fromJ = new MultiDimensionalVector(_[j - 1].location);
                const toJ = new MultiDimensionalVector(_[j].location);

                try {
                    _[j - 1].dimension.spawnParticle("minecraft:colored_flame_particle", fromJ, molangVariableMap);
                }
                catch {}

                try {
                    _[j - 1].dimension.spawnParticle("minecraft:colored_flame_particle", toJ, molangVariableMap);
                }
                catch {}

                const direction = fromJ.getDirectionTo(toJ);

                if (fromJ.getDistanceTo(toJ) > 50) {
                    for (let k = 1; k <= 20; k++) {
                        const locationBigin = Vector.lerp(fromJ, fromJ.add(direction.setLength(50)), k / 20);
                        const locationEnd = Vector.lerp(toJ, toJ.add(direction.setLength(-50)), k / 20);
                        try {
                            _[j - 1].dimension.spawnParticle("minecraft:colored_flame_particle", locationBigin, molangVariableMap);
                        }
                        catch {
                            try {
                                _[j - 1].dimension.spawnParticle("minecraft:colored_flame_particle", locationEnd, molangVariableMap);
                            }
                            catch {}
                        }
                    }
                }
                else {
                    for (let k = 1; k <= 10; k++) {
                        const location = Vector.lerp(fromJ, toJ, k / 10);
                        try {
                            _[j - 1].dimension.spawnParticle("minecraft:colored_flame_particle", location, molangVariableMap);
                        }
                        catch {}
                    }
                }
            }
        }

        const { location: lastLocation, rotation: lastRotation } = this.transition.slice(-1)[0].slice(-1)[0];
        const lastDirection = MultiDimensionalVector.getDirectionFromRotation(lastRotation);

        molangVariableMap.setColorRGB("variable.color", { red: 1, green: 0, blue: 0 });

        for (let i = 1; i <= 5; i++) {
            const location = Vector.lerp(lastLocation, lastDirection.add(lastLocation), i / 5);
            this.transition.slice(-1)[0].slice(-1)[0].dimension.spawnParticle("minecraft:colored_flame_particle", location, molangVariableMap);
        }
    }

    /**
     * @param {(stack: CommandSourceStack) => void} modifier
     */
    modify(modifier) {
        if (typeof modifier !== "function") {
            throw new TypeError("第一引数は(CSS: CommandSourceStack) => CommandSourceStackだよ");
        }

        this.commandSourceStacks = this.commandSourceStacks.map(CSS => {
            modifier(CSS);
            return CSS;
        });

        return this;
    }
}
