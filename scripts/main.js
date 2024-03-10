import { world } from "@minecraft/server";

import { CommandSourceStack, Execute } from "./execute/index";

/*
execute
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
    .display()
*/
