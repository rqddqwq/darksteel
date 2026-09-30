const item = require("items");

const 石英墙 = new Wall("石英墙");
exports.石英墙 = 石英墙;
Object.assign(石英墙, {
    health: 600,
    size: 1,
    alwaysUnlocked: false,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
        item.石英, 10
    )
});

const 大型石英墙 = new Wall("大型石英墙");
exports.大型石英墙 = 大型石英墙;
Object.assign(大型石英墙, {
    health: 1200,
    size: 2,
    alwaysUnlocked: false,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
        item.石英, 20
    )
});
