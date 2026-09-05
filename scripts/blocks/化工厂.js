const library = require("base/library");
const myitems = require("items");

const 化工厂 = library.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "化工厂", [
  {
  input: {
    liquids: ["玄钢重工-石油气/10","water/0.2"],
    power: 1,
  },
  output: {
    items: ["玄钢重工-硫磺/2"]
  },
  craftTime: 60,
},
  {
  input: {
    items: ["玄钢重工-钢/10","玄钢重工-铁/20"],
    liquids: ["玄钢重工-硫酸/10"],
    power: 1,
  },
  output: {
    items: ["玄钢重工-电池/1"]
  },
  craftTime: 120,
},
{
  input: {
    items: ["玄钢重工-硫磺/5","玄钢重工-铁/20"],
    liquids: ["water/0.6"],
    power: 1,
  },
  output: {
    liquids: ["玄钢重工-硫酸/0.6"],
  },
  craftTime: 120,
},
]);