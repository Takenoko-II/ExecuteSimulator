import { world } from "@minecraft/server";

import { Execute } from "./execute/index";

world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
    if (itemStack.typeId !== "minecraft:stick") return;

    new Execute()
        .as([source])
        .at("@s")
        .anchored("eyes")
        .positioned.$("^ ^ ^2")
        .display();
});
