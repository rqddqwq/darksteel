function newItem(name) {
	exports[name] = (() => {
		let myItem = extend(Item, name, {});
		return myItem;
	})();
}
function newLiquid(name, color, obj) {
	Object.assign(exports[name] = new Liquid(name,
		Color.valueOf(color)), obj);
}
newItem("硅钢")
newItem("玻璃")
newItem("电池")
newItem("玄钢")
newItem("钢")
newItem("硫磺")
newItem("石英")
newItem("铁")
newLiquid("硫酸")
newLiquid("废液")
newLiquid("石油气")
