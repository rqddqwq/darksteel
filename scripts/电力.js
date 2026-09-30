    //感谢蔚蓝行星
const item = require("items")

Attribute.add("水");

function DeepWater(floor, amount){
	return floor.attributes.set(Attribute.get("水"), amount / 4);
}
DeepWater(Blocks.deepwater,1.5)
DeepWater(Blocks.water,1)
DeepWater(Blocks.sandWater,0.5)
DeepWater(Blocks.darksandWater,0.5)

const 太阳能板 = new SolarGenerator("太阳能板");
exports.太阳能板 = 太阳能板;
Object.assign(太阳能板,{
health: 200,
size: 3,
requirements: ItemStack.with(
    item.铁, 10
    ),
powerProduction: 0.8,
buildVisibility: BuildVisibility.shown,
category: Category.power,
})
const 潮汐发电机 = new ThermalGenerator("潮汐发电机");
exports.潮汐发电机 = 潮汐发电机;
Object.assign(潮汐发电机,{
    requirements: ItemStack.with(
		item.钢, 20,
		item.铁, 60,
	),
	buildVisibility: BuildVisibility.shown,
	category: Category.power,
	powerProduction: 0.9,
	size: 2,
	floating: true,
	attribute: Attribute.get("水"),
})
const 钢电力节点 = new PowerNode("钢电力节点");
exports.钢电力节点 = 钢电力节点;
Object.assign(钢电力节点, {
	size: 1,
	maxNodes: 5,
	laserRange: 25,
	health: 100,
	category: Category.power,
	buildVisibility: BuildVisibility.shown,
	requirements: ItemStack.with(
		item.钢, 5,
	)
})
/*module.exports = {
    太阳能板: 太阳能板,      
    潮汐发电机: 潮汐发电机,
    钢电力节点: 钢电力节点
};*/