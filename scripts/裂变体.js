const items = require("items");


const 裂变体 = extend(Liquid, "裂变体", Color.valueOf("4CAF50"), {
    heatCapacity: 0.4,
    temperature: 0.54,
    viscosity: 0.85,
    flammability: 0,
    capPuddles: false,
    spreadTarget: Liquids.water,
    moveThroughBlocks: true,
    incinerable: false,
    blockReactive: false,
    colorFrom: Color.valueOf("4CAF50"),
    colorTo: Color.valueOf("2E7D32"),
    init(){
        this.canStayOn.add(Liquids.water);
        this.canStayOn.add(items["废液"]);
    }
});

exports.裂变体 = 裂变体;
