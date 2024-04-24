import { world, system } from "@minecraft/server";

import { Execute } from "./execute/index";
/*
system.runInterval(() => {
    const execute = new Execute();

    execute
    .as("@e[name=A]")
    .at("@e[name=B]")
    .positioned.$("~200000 ~ ~")
    .facing.entity("@s", "feet")
    .positioned.$("^ ^ ^100000")
    .positioned.$("~-100000 ~ ~")
    .positioned.$("~ ~ ~200000")
    .facing.entity("@s", "feet")
    .rotated.$("~ 0")
    .positioned.$("^ ^ ^100000")
    .positioned.$("~ ~ ~-100000")
    .display();
}, 5);
*/