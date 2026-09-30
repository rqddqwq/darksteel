const nodeProduce = TechTree.nodeProduce;
const nodeRoot = TechTree.nodeRoot;
const node = TechTree.node;

const {玄钢核心} = require("blocks/玄钢核心");
const lib = require("base/lib");
const 立场 = require("小型立场");
const {凯利斯} = require("planets/凯利斯");
const items = require("items");
const a = require("裂变体");
const 墙 = require("blocks/墙")
const 电力 = require("电力");

// ✅ 正确：nodeRoot 只接受三个参数
凯利斯.techTree = nodeRoot("凯利斯", 玄钢核心, () => {
    // 电力分支
    node(电力.太阳能板, () => {   // ✅ 改成"版"
    node(电力.钢电力节点, () => {
        node(电力.潮汐发电机, () => {});
    });
});
    node(墙.石英墙, () => {
    node(墙.大型石英墙, () => {});
    });
    // 资源分支
    nodeProduce(items.石英, () => {
        nodeProduce(items.铁, () => {
            nodeProduce(items.钢, () => {
                nodeProduce(a.裂变体, () => {});
                nodeProduce(items.玄钢, () => {
                    nodeProduce(items.电池, () => {});
                    nodeProduce(items.硅钢, () => {
                        nodeProduce(items.废液, () => {});
                    });
                    nodeProduce(items.硫酸, () => {});
                });
            });
        });
    });
});