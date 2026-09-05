//借用于ⅠCBM
/**
* v5.2.5-fixed‑fix2
* 修复：移除错误 new ItemArr / new LiquidArr；此类类不能在js层new；全部改用仅判空跳过逻辑，不再手动实例化内部类
* 仅删除UI：制造进度条、阶段工艺进度条；业务逻辑全部保留
* 修复ReqImage构造器参数类型崩溃，全部使用Boolp，移除错误TextureRegionDrawable包装
* 液体全方向输入输出，修复严格模式隐式全局变量
*/
/**
* v5.2.5-fixed
* 仅删除UI：制造进度条、阶段工艺进度条；业务逻辑全部保留
* 修复ReqImage构造器参数类型崩溃，全部使用Boolp，移除错误TextureRegionDrawable包装
* 液体全方向输入输出，修复严格模式隐式全局变量
*/
/**
* v5.1.1
* 添加了制造进度显示条，工艺进度显示条
* stages中，title决定在数据库中的工艺标题，bartitle决定在工艺进度显示条上显示的内容，weight决定当前工艺在总制造时间中的比重，input和output用于编排的数据库中的工艺说明
* 修复了数据库显示中配方被异常居中的问题
*/
/**
* v5.0.1
* 对该文件进行了大量修改
* 目前MultiCrafter只会接收/输出与当前配方相关的物品/液体
* 重新设计了数据库中的配方显示并添加了新的stages和group可供引用
* 对文件内的许多地方进行了注释
* 该文件最下方有使用示例
*
* 仍然不能使用热量
*/
/**
* v4
* 修复由于臭猫删东西导致的闪退，适配147
*/
/**
* v3
* 没啥，就是适配136的更新
*/
/**
* v2
* 第二个版本发布是因为发现物品一直会跳
* 这个版本就是将这个bug修复(其实就是把原本覆盖的去除用原版的table)，其次物品消耗stat框颜色可以自己更改了，看下面注释，其实就是小改，主要怕你们删错，以后可能会改展示
* 保留所有注释，如有侵权，立即删除
*/
/**
* @author < (main) younggam 6.0 : v1 >
* @author < guiY 7.0 adapter&remake : v2 >
* @author < 晓伟 136 adapter : v3 >
* @应该不算anthor < R 147 adapter : v4 >
* @readme <
    Version 6.0 To version 7.0 Not available due to changes in game source code,
    for example, NumberValue becomes StatValues.number, This means that some parameters and internal functions are changed,
    i just change some parameters and functions, to make it can adapt ver 7.0(and StatValue can be extended[line 554])
    Item display has been fixed
>
* @anthor < 冰汐Angel 148 adapter : v5.*.*>
* @readme <
    The modification of this file has been approved by guiY
    I have made many modifications to this file to make it more user‑friendly(Maybe)
>
*/
//stat color
//RGB can be used  可以使用RGB格式
const colorStat = Pal.accent;
//Pal为内置颜色，自定义颜色格式
//const colorStat = Color.valueOf("ffffff");//纯白色
function MultiCrafterBuild() {
    this.acceptItem = function(source, item) {
        if(this._toggle < 0) return false;
        if(typeof this.block["getInputItemSet"] !== "function") return false;
        if(this.items == null) return false;
        if(this.items.get(item) >= this.getMaximumAccepted(item)) return false;
        if(this._toggle >= 0) {
            const recipe = this.block.getRecipes()[this._toggle];
            return recipe.input.items.some(stack => stack.item === item);
        }
        return false;
    };
    // ===== 修复：补全液体接收判断，全方向无限制 =====
    this.canAcceptLiquid = function(source, liquid) {
        if(this._toggle < 0) return false;
        if(typeof this.block["getInputLiquidSet"] !== "function") return false;
        if(this.liquids == null) return false;
        if(this.liquids.get(liquid) >= this.block.liquidCapacity) return false;
        if(this._toggle >= 0) {
            const recipe = this.block.getRecipes()[this._toggle];
            return recipe.input.liquids.some(stack => stack.liquid === liquid);
        }
        return false;
    };
    this.acceptLiquid = function(source, liquid, amount) {
        if(!this.canAcceptLiquid(source, liquid)) return 0;
        if(this.liquids == null) return 0;
        var addAmount = Math.min(amount, this.block.liquidCapacity - this.liquids.get(liquid));
        this.liquids.add(liquid, addAmount);
        return addAmount;
    };
    this.removeStack = function(item, amount) {
        var ret = this.super$removeStack(item, amount);
        if(this.items != null && !this.items.has(item)) this.toOutputItemSet.remove(item);
        return ret;
    };
    this.handleItem = function(source, item) {
        var current = this._toggle;
        if(current > -1 && this.block.getRecipes()[current].output.items.some(a => a.item == item)) {
            this.toOutputItemSet.add(item);
        }
        if(this.items != null) this.items.add(item, 1);
    };
    this.handleStack = function(item, amount, tile, source) {
        var current = this._toggle;
        if(current > -1 && this.block.getRecipes()[current].output.items.some(a => a.item == item)) {
            this.toOutputItemSet.add(item);
        }
        if(this.items != null) this.items.add(item, amount);
    };
    // ===== 修复ReqImage：使用正确参数，uiIcon是TextureRegion，回调使用Boolp =====
    this.displayConsumption = function(table) {
        if(typeof this.block["getRecipes"] !== "function") return;
        const recs = this.block.getRecipes();
        var current = this.config() != null ? this.config() : -1;
        if (current >= 0){
            var items = recs[current].input.items;
            var _items = recs[current].output.items;
            var liquids = recs[current].input.liquids;
            var _liquids = recs[current].output.liquids;
            table.left();
            for(var j = 0, len = items.length; j < len; j++) {
                (function(that, stack) {
                    var cond = extend(Boolp, {
                        get: function() {
                            return that.items != null && that.items.has(stack.item, stack.amount);
                        }
                    });
                    table.add(new ReqImage(stack.item.uiIcon, cond)).size(8 * 4);
                })(this, items[j]);
            }
            for(var k = 0, len = liquids.length; k < len; k++) {
                (function(that, stack) {
                    if(stack.liquid == null) return;
                    var cond = extend(Boolp, {
                        get: function() {
                            return that.liquids != null && that.liquids.get(stack.liquid) >= stack.amount;
                        }
                    });
                    table.add(new ReqImage(stack.liquid.uiIcon, cond)).size(8 * 4);
                })(this, liquids[k]);
            }
            table.add(" => ");
            for(var l = 0, len = _items.length; l < len; l++) {
                (function(that, stack) {
                    var cond = extend(Boolp, {
                        get: function() {
                            return that.items != null && that.items.has(stack.item, stack.amount);
                        }
                    });
                    table.add(new ReqImage(stack.item.uiIcon, cond)).size(8 * 4);
                })(this, _items[l]);
            }
            for(var m = 0, len = _liquids.length; m < len; m++) {
                (function(that, stack) {
                    if(stack.liquid == null) return;
                    var cond = extend(Boolp, {
                        get: function() {
                            return that.liquids != null && that.liquids.get(stack.liquid) >= stack.amount;
                        }
                    });
                    table.add(new ReqImage(stack.liquid.uiIcon, cond)).size(8 * 4);
                })(this, _liquids[m]);
            }
        }else{
            table.left();
            table.add("  未选择配方");
        }
    };
    this.getPowerProduction = function() {
        var i = this._toggle;
        if(i < 0 || typeof this.block["getRecipes"] !== "function") return 0;
        var oPower = this.block.getRecipes()[i].output.power;
        if(oPower > 0 && this._cond) {
            if(this.block.getRecipes()[i].input.power > 0) {
                this._powerStat = this.efficiency();
                return oPower * this.efficiency();
            } else {
                this._powerStat = 1;
                return oPower;
            }
        }
        this._powerStat = 0;
        return 0;
    };
    this.getProgressIncreaseA = function(i, baseTime) {
        if(typeof this.block["getRecipes"] !== "function" || this.block.getRecipes()[i].input.power > 0) return this.getProgressIncrease(baseTime);
        else return 1 / baseTime * this.delta();
    };
    this.checkinput = function(i) {
        const recs = this.block.getRecipes();
        var items = recs[i].input.items;
        var liquids = recs[i].input.liquids;
        if(this.items == null || !this.items.has(items)) return true;
        for(var j = 0, len = liquids.length; j < len; j++) {
            if(liquids[j].liquid == null) continue;
            if(this.liquids == null || this.liquids.get(liquids[j].liquid) + 0.001 < liquids[j].amount) return true;
        }
        return false;
    };
    this.checkoutput = function(i) {
        const recs = this.block.getRecipes();
        var items = recs[i].output.items;
        var liquids = recs[i].output.liquids;
        for(var j = 0, len = items.length; j < len; j++) {
            if(this.items == null || this.items.get(items[j].item) + items[j].amount > this.getMaximumAccepted(items[j].item)) return true;
        }
        for(var j = 0, len = liquids.length; j < len; j++) {
            if(liquids[j].liquid == null) continue;
            if(this.liquids == null || this.liquids.get(liquids[j].liquid) + liquids[j].amount > this.block.liquidCapacity) return true;
        }
        return false;
    };
    this.checkCond = function(i) {
        if(this.block.getRecipes()[i].input.power > 0 && this.power.status <= 0) {
            this._condValid = false;
            this._cond = false;
            return false;
        } else if(this.checkinput(i)) {
            this._condValid = false;
            this._cond = false;
            return false;
        } else if(this.checkoutput(i)) {
            this._condValid = true;
            this._cond = false;
            return false;
        }
        this._condValid = true;
        this._cond = true;
        return true;
    };
    this.customCons = function(i) {
        const recs = this.block.getRecipes();
        if(this.checkCond(i)) {
            if(this.progressArr[i] != 0 && this.progressArr[i] != null) {
                this.progress = this.progressArr[i];
                this.progressArr[i] = 0;
            }
            this.progress += this.getProgressIncreaseA(i, recs[i].craftTime);
            this.totalProgress += this.delta();
            this.warmup = Mathf.lerpDelta(this.warmup, 1, 0.02);
            if(Mathf.chance(Time.delta * this.updateEffectChance)) Effects.effect(this.updateEffect, this.x + Mathf.range(this.size * 4), this.y + Mathf.range(this.size * 4));
        } else this.warmup = Mathf.lerp(this.warmup, 0, 0.02);
    };
    // ===== 修复：液体产出逻辑，删除错误的handleLiquid调用 =====
    this.customProd = function(i) {
        const recs = this.block.getRecipes();
        var inputItems = recs[i].input.items;
        var inputLiquids = recs[i].input.liquids;
        var outputItems = recs[i].output.items;
        var outputLiquids = recs[i].output.liquids;
        if(this.items == null) return;
        var eItems = this.items;
        for(var k = 0, len = inputItems.length; k < len; k++) eItems.remove(inputItems[k]);
        if(this.liquids != null){
            for(var j = 0, len = inputLiquids.length; j < len; j++) {
                if(inputLiquids[j].liquid == null) continue;
                this.liquids.remove(inputLiquids[j].liquid, inputLiquids[j].amount);
            }
        }
        for(var a = 0, len = outputItems.length; a < len; a++) {
            for(var aa = 0, amount = outputItems[a].amount; aa < amount; aa++) {
                var oItem = outputItems[a].item;
                if(!this.put(oItem)) {
                    if(!eItems.has(oItem)) this.toOutputItemSet.add(oItem);
                    eItems.add(oItem, 1);
                }
            }
        }
        if(this.liquids != null){
            for(var j = 0, len = outputLiquids.length; j < len; j++) {
                if(outputLiquids[j].liquid == null) continue;
                var oLiquid = outputLiquids[j].liquid;
                var oAmount = outputLiquids[j].amount;
                this.liquids.add(oLiquid, oAmount);
                if(!this.toOutputLiquidSet.contains(oLiquid)) this.toOutputLiquidSet.add(oLiquid);
            }
        }
        this.block.craftEffect.at(this.x, this.y);
        this.progress = 0;
    };
    this.updateTile = function() {
        if(typeof this.block["getRecipes"] !== "function") return;
        if(this.timer.get(1, 60)) {
            this.itemHas = 0;
            if(this.items != null) this.items.each(item => this.itemHas++);
        }
        if(!Vars.headless) this.block.invFrag.hide();
        const recs = this.block.getRecipes();
        var current = this._toggle;
        if(typeof this["customUpdate"] === "function") this.customUpdate();
        if(current >= 0) {
            this.customCons(current);
            if(this.progress >= 1) this.customProd(current);
        }
        if(this.block.doDumpToggle() && current == -1) return;
        var que = this.toOutputItemSet.orderedItems(),
            len = que.size,
            itemEntry = this.dumpItemEntry;
        if(this.timer.get(this.block.dumpTime) && len > 0) {
            for(var i = 0; i < len; i++) {
                var candidate = que.get((i + itemEntry) % len);
                if(this.items != null && this.put(candidate)) {
                    this.items.remove(candidate, 1);
                    if(!this.items.has(candidate)) this.toOutputItemSet.remove(candidate);
                    break;
                }
            }
            if(i != len) this.dumpItemEntry = (i + itemEntry) % len;
        }
        // ===== 修复：液体全方向输出，不指定方向自动遍历所有相邻面 =====
        if(current >= 0 && this.liquids != null) {
            var outLiquids = recs[current].output.liquids;
            for(var l = 0; l < outLiquids.length; l++){
                var liq = outLiquids[l].liquid;
                if(liq == null) continue;
                if(this.liquids.get(liq) > 0.001) {
                    this.dumpLiquid(liq, 8);
                }
            }
        }
        // 浮点数兼容：液体清空时清理集合【修复：liquids null保护】
        var totalLiq = 0;
        if(this.liquids != null){
            this.liquids.each(function(l, a){ totalLiq += a; });
        }
        if(totalLiq <= 0.01) {
            this.toOutputLiquidSet.clear();
        }
    };
    this.shouldConsume = function() {
        return this._condValid && this.productionValid();
    };
    this.productionValid = function() {
        return this._cond && this.enabled;
    };
    this.buildConfiguration = function(table) {
        if(typeof this.block["getRecipes"] !== "function") return;
        const recs = this.block.getRecipes(),
            invFrag = this.block.getInvFrag();
        if(!invFrag.isBuilt()) invFrag.build(table.parent);
        if(invFrag.isShown()) {
            invFrag.hide();
            Vars.control.input.frag.config.hideConfig();
            return;
        }
        var group = new ButtonGroup();
        group.setMinCheckCount(0);
        group.setMaxCheckCount(1);
        for(var i = 0; i < recs.length; i++) {
            table.table(cons(recipeRow => {
                recipeRow.left();
                (function(i, that) {
                    var output = recs[i].output;
                    var button = recipeRow.button(Tex.pane,40,() => that.configure(button.isChecked() ? i : -1))
                        .group(group)
                        .get();
                    button.getStyle().up = Styles.black3;
                    button.getStyle().down = Styles.flatOver;
                    button.getStyle().checked = Styles.accentDrawable;
                    let icon = Icon.cancel;
                    if(output.items.length > 0 && output.items[0].item != null) {
                        icon = output.items[0].item.uiIcon;
                    } else if(output.liquids.length > 0 && output.liquids[0].liquid != null) {
                        icon = output.liquids[0].liquid.uiIcon;
                    } else if(output.power > 0) {
                        icon = Icon.power;
                    }
                    button.getStyle().imageUp = new TextureRegionDrawable(icon);
                    button.update(() => button.setChecked(i==that._toggle));
                })(i, this);
                recipeRow.table(cons(outputTable => {
                    outputTable.left();
                    for(var j = 0; j < recs[i].output.items.length; j++) {
                        outputTable.image(recs[i].output.items[j].item.uiIcon)
                            .size(24)
                            .padRight(4);
                    }
                    for(var j = 0; j < recs[i].output.liquids.length; j++) {
                        if(recs[i].output.liquids[j].liquid == null) continue;
                        outputTable.image(recs[i].output.liquids[j].liquid.uiIcon)
                            .size(24)
                            .padRight(4);
                    }
                    if(recs[i].output.power > 0) {
                        outputTable.image(Icon.power)
                            .size(24)
                            .padRight(4);
                    }
                })).padLeft(10);
            })).left().fillX().row();
        }
    };
    this.configured = function(player, value) {
        if(isNaN(value) || typeof value != "number") {
            this._toggle = -1;
            this._cond = false;
            this._condValid = false;
            return;
        }
        var current = this._toggle;
        if(current >= 0) this.progressArr[current] = this.progress;
        if(value == -1) {
            this._condValid = false;
            this._cond = false;
        }
        if(this.block.doDumpToggle()) {
            this.toOutputItemSet.clear();
            this.toOutputLiquidSet.clear();
            if(value > -1) {
                var oItems = this.block.getRecipes()[value].output.items;
                for(var i = 0, len = oItems.length; i < len; i++) {
                    var item = oItems[i].item;
                    if(this.items != null && this.items.has(item)) this.toOutputItemSet.add(item);
                }
                var oLiquids = this.block.getRecipes()[value].output.liquids;
                for(var i = 0, len = oLiquids.length; i < len; i++) {
                    var liquid = oLiquids[i].liquid;
                    if(liquid != null && this.liquids != null && this.liquids.get(liquid) > 0.001) this.toOutputLiquidSet.add(liquid);
                }
            }
        }
        this.progress = 0;
        this._toggle = value;
    };
    this.onConfigureTileTapped = function(other) {
        return (this.items != null && this.items.total() > 0) ? true : this != other;
    };
    this.getToggle = function() {
        return this._toggle;
    };
    this._toggle = 0;
    this.progressArr = [];
    this.getCond = function() {
        return this._cond;
    };
    this._cond = false;
    this._condValid = false;
    this.getCondValid = function() {
        return this._condValid;
    };
    this.getPowerStat = function() {
        return this._powerStat;
    };
    this._powerStat = 0;
    this.toOutputItemSet = new OrderedSet();
    this.toOutputLiquidSet = new OrderedSet();
    this.dumpItemEntry = 0;
    this.dumpLiquidEntry = 0;
    this.itemHas = 0;

    //【已删除错误 new ItemArr / new LiquidArr，父类GenericCrafterBuild原生会初始化items、liquids；旧损坏存档遇到null仅做判断跳过】

    this.config = function() {
        return this._toggle;
    };
    this.write = function(write) {
        this.super$write(write);
        write.s(this._toggle);
        var queItem = this.toOutputItemSet.orderedItems(),
            len = queItem.size;
        write.s(len);
        for(var i = 0; i < len; i++) write.s(queItem.get(i).id);
        var queLiquid = this.toOutputLiquidSet.orderedItems(),
            lenLiquid = queLiquid.size;
        write.s(lenLiquid);
        for(var i = 0; i < lenLiquid; i++) write.s(queLiquid.get(i).id);
    };
    this.read = function(read, revision) {
        this.super$read(read, revision);
        this._toggle = read.s();
        this.toOutputItemSet.clear();
        var lenItem = read.s(),
            vc = Vars.content,
            ci = ContentType.item;
        for(var i = 0; i < lenItem; i++) this.toOutputItemSet.add(vc.getByID(ci, read.s()));
        this.toOutputLiquidSet.clear();
        var lenLiquid = read.s(),
            cl = ContentType.liquid;
        for(var i = 0; i < lenLiquid; i++) this.toOutputLiquidSet.add(vc.getByID(cl, read.s()));
        //【已删除错误 new ItemArr / new LiquidArr】
    };
}
function MultiCrafterBlock() {
    this.tmpRecs = [];
    var recs = [];
    var infoStyle = null;
    this.getRecipes = function() {
        return recs;
    };
    this._liquidSet = new ObjectSet();
    this.getLiquidSet = function() {
        return this._liquidSet;
    };
    this.hasOutputItem = false;
    this._inputItemSet = new ObjectSet();
    this.getInputItemSet = function() {
        return this._inputItemSet;
    };
    this._inputLiquidSet = new ObjectSet();
    this.getInputLiquidSet = function() {
        return this._inputLiquidSet;
    };
    this._outputItemSet = new ObjectSet();
    this.getOutputItemSet = function() {
        return this._outputItemSet;
    };
    this._outputLiquidSet = new ObjectSet();
    this.getOutputLiquidSet = function() {
        return this._outputLiquidSet;
    };
    this.dumpToggle = false;
    this.doDumpToggle = function() {
        return this.dumpToggle;
    };
    this.powerBarI = false;
    this.powerBarO = false;
    this._invFrag = extend(BlockInventoryFragment, {
        _built: false,
        isBuilt() {
            return this._built;
        },
        visible: false,
        isShown() {
            return this.visible;
        },
        showFor(t) {
            this.visible = true;
            this.super$showFor(t);
        },
        hide() {
            this.visible = false;
            this.super$hide();
        },
        build(parent) {
            this._built = true;
            this.super$build(parent);
        }
    });
    this.getInvFrag = function() {
        return this._invFrag;
    };
    this.init = function() {
        for(var i = 0; i < this.tmpRecs.length; i++) {
            var tmp = this.tmpRecs[i];
            var isInputExist = tmp.input != null,
                isOutputExist = tmp.output != null;
            var tmpInput = tmp.input;
            var tmpOutput = tmp.output;
            if(isInputExist && tmpInput.power > 0) this.powerBarI = true;
            if(isOutputExist && tmpOutput.power > 0) this.powerBarO = true;
            recs[i] = {
                input: {
                    items: [],
                    liquids: [],
                    power: isInputExist ? typeof tmpInput.power == "number" ? tmpInput.power : 0 : 0
                },
                output: {
                    items: [],
                    liquids: [],
                    power: isOutputExist ? typeof tmpOutput.power == "number" ? tmpOutput.power : 0 : 0
                },
                stages: tmp.stages || [],
                craftTime: typeof tmp.craftTime == "number" ? tmp.craftTime : 80,
                group: tmp.group || "group",
                title: tmp.title || "配方"
            };
            var vc = Vars.content;
            var ci = ContentType.item;
            var cl = ContentType.liquid;
            var realInput = recs[i].input;
            var realOutput = recs[i].output;
            if(isInputExist) {
                if(tmpInput.items != null) {
                    for(var j = 0, len = tmpInput.items.length; j < len; j++) {
                        if(typeof tmpInput.items[j] != "string") throw "It is not string at " + j + "th input item in " + i + "th recipe";
                        var words = tmpInput.items[j].split("/");
                        if(words.length != 2) throw "Malform at " + j + "th input item in " + i + "th recipe";
                        var item = vc.getByName(ci, words[0]);
                        if(item == null) throw "Invalid item: " + words[0] + " at " + j + "th input item in " + i + "th recipe";
                        this._inputItemSet.add(item);
                        if(isNaN(words[1])) throw "Invalid amount: " + words[1] + " at " + j + "th input item in " + i + "th recipe";
                        realInput.items[j] = new ItemStack(item, words[1] * 1);
                    }
                }
                if(tmpInput.liquids != null) {
                    for(var j = 0, len = tmpInput.liquids.length; j < len; j++) {
                        if(typeof tmpInput.liquids[j] != "string") throw "It is not string at " + j + "th input liquid in " + i + "th recipe";
                        var words = tmpInput.liquids[j].split("/");
                        if(words.length != 2) throw "Malform at " + j + "th input liquid in " + i + "th recipe";
                        var liquid = vc.getByName(cl, words[0]);
                        if(liquid == null) throw "Invalid liquid: " + words[0] + " at " + j + "th input liquid in " + i + "th recipe";
                        this._inputLiquidSet.add(liquid);
                        this._liquidSet.add(liquid);
                        if(isNaN(words[1])) throw "Invalid amount: " + words[1] + " at " + j + "th input liquid in " + i + "th recipe";
                        realInput.liquids[j] = new LiquidStack(liquid, words[1] * 1);
                    }
                }
            }
            if(isOutputExist) {
                if(tmpOutput.items != null) {
                    for(var j = 0, len = tmpOutput.items.length; j < len; j++) {
                        if(typeof tmpOutput.items[j] != "string") throw "It is not string at " + j + "th output item in " + i + "th recipe";
                        var words = tmpOutput.items[j].split("/");
                        if(words.length != 2) throw "Malform at " + j + "th output item in " + i + "th recipe";
                        var item = vc.getByName(ci, words[0]);
                        if(item == null) throw "Invalid item: " + words[0] + " at " + j + "th output item in " + i + "th recipe";
                        this._outputItemSet.add(item);
                        if(isNaN(words[1])) throw "Invalid amount: " + words[1] + " at " + j + "th output item in " + i + "th recipe";
                        realOutput.items[j] = new ItemStack(item, words[1] * 1);
                    }
                    if(j != 0) this.hasOutputItem = true;
                }
                if(tmpOutput.liquids != null) {
                    for(var j = 0, len = tmpOutput.liquids.length; j < len; j++) {
                        if(typeof tmpOutput.liquids[j] != "string") throw "It is not string at " + j + "th output liquid in " + i + "th recipe";
                        var words = tmpOutput.liquids[j].split("/");
                        if(words.length != 2) throw "Malform at " + j + "th output liquid in " + i + "th recipe";
                        var liquid = vc.getByName(cl, words[0]);
                        if(liquid == null) throw "Invalid liquid: " + words[0] + " at " + j + "th output liquid in " + i + "th recipe";
                        this._outputLiquidSet.add(liquid);
                        this._liquidSet.add(liquid);
                        if(isNaN(words[1])) throw "Invalid amount: " + words[1] + " at " + j + "th output liquid in " + i + "th recipe";
                        realOutput.liquids[j] = new LiquidStack(liquid, words[1] * 1);
                    }
                }
            }
        }
        this.hasPower = this.powerBarI || this.powerBarO;
        if(this.powerBarI) this.consumeBuilder.add(extend(ConsumePower, {
            requestedPower(entity) {
                if(typeof entity["getToggle"] !== "function") return 0;
                var i = entity.getToggle();
                if(i < 0) return 0;
                var input = entity.block.getRecipes()[i].input.power;
                if(input > 0 && entity.getCond()) return input;
                return 0;
            }
        }));
        this.consumesPower = this.powerBarI;
        this.outputsPower = this.powerBarO;
        this.super$init();
        if(!this._outputLiquidSet.isEmpty()) this.outputsLiquid = true;
        this.timers++;
        if(!Vars.headless) infoStyle = Core.scene.getStyle(Button.ButtonStyle);
    };
    this.setStats = function() {
        this.super$setStats();
        if(this.powerBarI) this.stats.remove(Stat.powerUse);
        this.stats.remove(Stat.productionTime);
        this.stats.add(Stat.input, new JavaAdapter(StatValue, {
        display(table){
        var groupedRecs = {};
        var defaultGroupCounter = 0;
        for (var i = 0; i < recs.length; i++) {
                var rec = recs[i];
                if (rec.group == "group") {
                    rec.group = "@group" + defaultGroupCounter.toString();
                    defaultGroupCounter++;
                }
                if (!groupedRecs[rec.group]) {
                    groupedRecs[rec.group] = [];
                }
                groupedRecs[rec.group].push(rec);
            }
        table.row();
        for (var groupName in groupedRecs) {
            var groupRecs = groupedRecs[groupName];
            var groupTable = table.table(Styles.grayPanel, function(groupTable) {
                if (groupName.indexOf("@group") !== 0) {
                    groupTable.add("[accent]" + groupName).expandX().left().row();
                    groupTable.add().size(8).row();
                }
                for (var j = 0; j < groupRecs.length; j++) {
                    var rec = groupRecs[j];
                    var outputItems = rec.output.items,
                        inputItems = rec.input.items;
                    var outputLiquids = rec.output.liquids,
                        inputLiquids = rec.input.liquids;
                    var inputPower = rec.input.power,
                        outputPower = rec.output.power;
                    groupTable.table(Styles.none, function(part) {
                        part.defaults().pad(2);
                        part.add("[accent]  [" + rec.title + "]").left().row();
                        part.add().size(5).row();
                        part.table(cons(function(row) {
                            row.add("[lightgray]    " + Stat.input.localized() + ":[]").left().padRight(8);
                            for (var l = 0, len = inputItems.length; l < len; l++)
                                row.add(StatValues.displayItem(inputItems[l].item, inputItems[l].amount, true)).padRight(5);
                                row.add(" || ").padRight(5);
                            for (var l = 0, len = inputLiquids.length; l < len; l++)
                                row.add(StatValues.displayLiquid(inputLiquids[l].liquid, inputLiquids[l].amount, false)).padRight(5);
                        })).left().row();
                        part.table(cons(function(row) {
                            row.add("[lightgray]    " + Stat.output.localized() + ":[]").left().padRight(8);
                            for (var jj = 0, len = outputItems.length; jj < len; jj++)
                                row.add(StatValues.displayItem(outputItems[jj].item, outputItems[jj].amount, true)).padRight(5);
                                row.add(" || ").padRight(5);
                            for (var jj = 0, len = outputLiquids.length; jj < len; jj++)
                                row.add(StatValues.displayLiquid(outputLiquids[jj].liquid, outputLiquids[jj].amount, false)).padRight(5);
                        })).left().row();
                        if (inputPower > 0 || outputPower > 0) {
                            part.table(cons(function(row) {
                                if (inputPower > 0) {
                                    row.add("[lightgray]    " + Stat.powerUse.localized() + ":[]").padRight(4);
                                    (StatValues.number(rec.input.power * 60, StatUnit.powerSecond)).display(row);
                                    row.add().size(10);
                                }
                                if (outputPower > 0) {
                                    row.add("[lightgray]    " + Stat.basePowerGeneration.localized() + ":[]").padRight(4);
                                    (StatValues.number(rec.output.power * 60, StatUnit.powerSecond)).display(row);
                                }
                            })).left().row();
                        }
                        part.table(cons(function(row) {
                            row.add("[lightgray]    " + Stat.productionTime.localized() + ":[]").padRight(4);
                            (StatValues.number(rec.craftTime / 60, StatUnit.seconds)).display(row);
                        })).pad(5).left().row();
                        if (typeof this["customDisplay"] === "function") this.customDisplay(part, j);
                        if (rec.stages.length > 0) {
                            part.add("[white]  阶段工艺").left().row();
                            part.table(cons(function(row) {
                                for (var s = 0; s < rec.stages.length; s++) {
                                    var stage = rec.stages[s];
                                    row.add().size(5).row();
                                    var minorIndex = stage.title.indexOf("@minor");
                                    if (minorIndex >= 0) {
                                        var beforeMinor = stage.title.substring(0, minorIndex);
                                        var afterMinor = stage.title.substring(minorIndex + 6);
                                        row.add("[lightgray]    " + beforeMinor + "[gray]" + afterMinor + "[]").left().row();
                                    } else {
                                        row.add("[lightgray]    " + stage.title + "[]").left().row();
                                    }
                                    if (stage.input && stage.input.length > 0) {
                                        row.add("[grey]      " + stage.input.join(" + ") + " ==> " + stage.output.join(" + ")).left().row();
                                    }
                                }
                            })).left().row();
                        }
                    }).pad(5).left().row();
                }
            }).pad(10).left().row();
            table.add().size(18).row();
            }
        },
        }));
    };
    this.setBars = function() {
        this.super$setBars();
        this.removeBar("items");
        if(!this.powerBarI && this.hasPower) this.removeBar("power");
        if(this.powerBarO) this.addBar("poweroutput", entity => new Bar(() => Core.bundle.format("bar.poweroutput", entity.getPowerProduction() * 60 * entity.timeScale), () => Pal.powerBar, () => typeof entity["getPowerStat"] === "function" ? entity.getPowerStat() : 0));
        var i = 0;
        // 已删除 newBar、stageBar
        if(!this._liquidSet.isEmpty()) {
            this._liquidSet.each(k => {
                this.addBar("liquid" + i, entity => new Bar(() => k.localizedName, () => k.barColor == null ? k.color : k.barColor, () => (entity.liquids != null) ? entity.liquids.get(k) / this.liquidCapacity : 0));
                i++;
            });
        }
    };
    this.outputsItems = function() {
        return this.hasOutputItem;
    };
}
function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof obj[i] == "object" && obj[i] != null) clone[i] = cloneObject(obj[i]);
        else clone[i] = obj[i];
    }
    return clone;
}
module.exports = {
    MultiCrafter(Type, EntityType, name, recipes, def, ExtraEntityDef) {
        const block = new MultiCrafterBlock();
        Object.assign(block, def);
        // 默认液体容量兜底，避免未设置时容量为0
        if(block.liquidCapacity == null) block.liquidCapacity = 200;
        const multi = extend(Type, name, block);
        multi.buildType = () => extend(EntityType, multi, Object.assign(new MultiCrafterBuild(), typeof ExtraEntityDef == "function" ? new ExtraEntityDef() : cloneObject(ExtraEntityDef)));
        multi.configurable = true;
        multi.hasItems = true;
        multi.hasLiquids = true;
        multi.hasPower = true;
        multi.tmpRecs = recipes;
        multi.saveConfig = true;
        return multi;
    }
}
/*
使用示例：
const library = require("base/library");
const chemicalPlant = library.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "化工厂", [
    {
        input: {
            items: ["玄钢重工‑钢/10"],
            liquids: ["玄钢重工‑硫酸/10"],
            power: 1
        },
        output: {
            items: ["玄钢重工‑电池/1"]
        },
        craftTime: 120,
        title: "电池合成"
    }
], {
    liquidCapacity: 300,
    itemCapacity:50,
    size:3,
    health:360
});
*/
