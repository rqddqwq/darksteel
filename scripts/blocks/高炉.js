const library = require("base/library");
const myitems = require("items");

const 高炉 = library.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "高炉", [
  {
  input: {
    items: ["sand/2"],
    liquids: ["water/0.2"],
    power: 1,
  },
  output: {
    items: ["玄钢重工-玻璃/1"],
  },
  craftTime: 120,
},  
{
  input: {
    items: ["玄钢重工-石英/2","玄钢重工-铁/3"],
    power: 1,
  },
  output: {
    items: ["玄钢重工-钢/2"],
  },
  craftTime: 240,
},
{
  input: {
    items: ["sand/2","玄钢重工-石英/4"],
    power: 2,
  },
  output: {
    items: ["silicon/8"],
  },
  craftTime: 240,
},
{
  input: {
    items: ["silicon/2","玄钢重工-钢/4"],
    power: 3,
  },
  output: {
    items: ["玄钢重工-硅钢/2"],
  },
  craftTime: 360,
},
{
  input: {
    items: ["玄钢重工-铁/5","玄钢重工-石英/4","玄钢重工-钢/2"],
    power: 3,
  },
  output: {
    items: ["玄钢重工-玄钢/6"],
  },
  craftTime: 480,
}
]);