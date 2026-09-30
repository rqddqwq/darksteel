const items = require("items");

const kl = new UnitType("kl");
Object.assign(kl, {
	coreUnitDock: true,
	aiController: UnitTypes.evoke.aiController,
	isEnemy: false,
	fogRadius: 0,
	lowAltitude: true,
	flying: true,
	mineSpeed: 6,
	mineHardnessScaling: true,
	mineTier: 2,
	buildSpeed: 1.5,
	drag: 0.05,
	speed: 4,
	rotateSpeed: 15,
	accel: 0.1,
	itemCapacity: 20,
	health: 300,
	engineOffset: 7,
	hitSize: 10,
	alwaysUnlocked: true,
	targetable: false,
	hittable: false,
	constructor: () => new UnitEntity.create(),
});
kl.weapons.add(
Object.assign(new Weapon(), {
	top: true,
	mirror: true,
	rotate: false,
	x: -2,
	y: 0,
	reload: 30,
	bullet: Object.assign(new BasicBulletType(), {
		speed: 5,
		lifetime: 32,
		width: 4,
		height: 8,
		ammoMultiplier: 1,
		collidesGround: true,
		damage: 30,
		buildingDamageMultiplier: 0.5,
		pierceCap: 3,
	})
})
);

const 玄钢核心 = new CoreBlock('玄钢核心');
玄钢核心.size = 3;
玄钢核心.health = 1500;
玄钢核心.configurable = true;
玄钢核心.buildVisibility = BuildVisibility.shown;
玄钢核心.category = Category.effect;
玄钢核心.alwaysUnlocked = true;
玄钢核心.solid = true;
玄钢核心.update = true;
玄钢核心.unitType = kl;
玄钢核心.itemCapacity = 3000;
玄钢核心.unitCapModifier = 8;
玄钢核心.destructible = true;
玄钢核心.requirements = ItemStack.with(
	items.玄钢, 3000,
);
玄钢核心.buildType = prov(() => extend(CoreBlock.CoreBuild, 玄钢核心, {
	updateTile(){
		this.super$updateTile();
		if(this.healthf() < 1 && this.timer.get(600)){
			this.heal(10);
		}
	}
}));

exports.玄钢核心 = 玄钢核心;
