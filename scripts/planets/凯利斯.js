const blocks = require("blocks/玄钢核心")
const lib = require("base/lib");
const 凯利斯 = new Planet("凯利斯", Planets.sun, 1, 1.5);
凯利斯.meshLoader = prov(() => new MultiMesh(
new HexMesh(凯利斯, 8)
));
凯利斯.generator = extend(SerpuloPlanetGenerator, {
getDefaultLoadout() {
return Schematics.readBase64("bXNjaAF4nGNgYWABorzE3FQGnpeTZr9sn/hswY6n+5sZuJLz80pS80p8EwsYmKprGbhTUouTizILSjLz8xgYGNhyEpNSc4oZmKJjGRkkITqfbl/6ZMcsXRRjGBgYQQhIAABdRSiN")
}
});
凯利斯.cloudMeshLoader = prov(() => new MultiMesh(
new HexSkyMesh(凯利斯, 2, 0.15, 0.14, 5, Color.valueOf("#08090F"), 2, 0.42, 1, 0.43), 
new HexSkyMesh(凯利斯, 45, 15, 0.23, 5, Color.valueOf("#102038"), 2, 0.5, 1.2, 0.45), 
new HexSkyMesh(凯利斯, 14, 10, 0.18, 5, Color.valueOf("#183A66"), 2, 0.5, 1.2, 0.45), 
new NoiseMesh(凯利斯, 28, 1, Color.valueOf("#205899"),1 , 20, 0.7, 2, 0.28)
));

凯利斯.visible = 凯利斯.accessible = 凯利斯.alwaysUnlocked = true;
凯利斯.clearSectorOnLose = true;
凯利斯.tidalLock = false;
凯利斯.defaultAttributes.set(Attribute.heat, 0.8);
凯利斯.updateLighting = true;
凯利斯.lightSrcTo = 0.5;
凯利斯.allowLaunchToNumbered = false;
凯利斯.lightDstFrom = 0.2;
凯利斯.defaultEnv = Env.terrestrial;
凯利斯.defaultCore = blocks.玄钢核心;
凯利斯.localizedName = "凯利斯";
凯利斯.prebuildBase = false;
凯利斯.bloom = true;
凯利斯.startSector = 0;
凯利斯.orbitRadius = 30;
凯利斯.atmosphereRadIn = 0.02;
凯利斯.atmosphereRadOut = 0.3;
凯利斯.atmosphereColor = Color.valueOf("#05060A"); 
凯利斯.lightColor = Color.valueOf("#0E1C30");    
凯利斯.iconColor = Color.valueOf("#205899");       
//凯利斯.hiddenItems.addAll(Items.serpuloItems).remove(Items.erekirItems);
module.exports = { 凯利斯: 凯利斯 };