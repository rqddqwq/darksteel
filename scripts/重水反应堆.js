const items = require("items");

const 铀235 = items.铀235;

const params = {
    maxPower: 10000,
    safeTemp: 350,
    dangerTemp: 600,
    meltdownTemp: 1200,
    normalTemp: 300,
    coolingFactor: 0.5,
    heatingFactor: 0.8,
    efficiency: 0.8
};

const 重水反应堆 = extend(PowerGenerator, "重水反应堆", {});

重水反应堆.size = 3;
重水反应堆.health = 2000;
重水反应堆.category = Category.power;
重水反应堆.buildVisibility = BuildVisibility.shown;
重水反应堆.alwaysUnlocked = true;
重水反应堆.hasPower = true;
重水反应堆.hasLiquids = true;
重水反应堆.liquidCapacity = 100;
重水反应堆.hasItems = true;
重水反应堆.itemCapacity = 10;
重水反应堆.powerProduction = 0;

重水反应堆.requirements = ItemStack.with(
    items.钢, 200,
    items.硅钢, 100
);

重水反应堆.configurable = true;

重水反应堆.buildType = prov(() => {
    return new JavaAdapter(PowerGenerator.GeneratorBuild, {
        running: false,
        controlRodDepth: 1.0,
        coreTemp: 300,
        neutronFlux: 0,
        heatupProgress: 0,
        thermalPower: 0,
        powerOutput: 0,
        reactorStatus: "待机",
        runtime: 0,
        exploded: false,

        acceptItem(source, item){
            return item === 铀235 && this.items.get(item) < this.block.itemCapacity;
        },

        simulate(liquidAmount, liquidCapacity){
            const p = params;
            const coolantFlow = liquidCapacity > 0 ? (liquidAmount / liquidCapacity) * 100 : 0;

            const fuel = this.items.get(铀235);
            const hasFuel = fuel > 0;

            if (this.running && hasFuel) {
                this.runtime += 1;

                // 预热：20 秒 = 1200 帧
                this.heatupProgress = Math.min(1, this.heatupProgress + 1 / 1200);

                // ✅ 预热满 100% 前，中子通量为 0
                const rodFlux = Math.max(0, Math.min(1, 1 - this.controlRodDepth));
                this.neutronFlux = this.heatupProgress >= 1 ? rodFlux : 0;

                const heat = this.neutronFlux * p.maxPower * p.heatingFactor * 0.1;
                const cooling = coolantFlow / 100 * p.coolingFactor * 100;

                this.coreTemp += (heat - cooling) * 0.01;
                if (this.coreTemp < p.normalTemp) this.coreTemp = p.normalTemp;

                this.thermalPower = Math.max(0, this.neutronFlux * p.maxPower);
                this.powerOutput = Math.max(0, this.thermalPower * p.efficiency);

                if (this.timer.get(0, 300)) {
                    this.items.remove(铀235, 1);
                }

                if (this.coreTemp >= p.meltdownTemp) {
                    this.reactorStatus = "堆芯熔毁！";
                } else if (this.coreTemp >= p.dangerTemp) {
                    this.reactorStatus = "温度危险！";
                } else if (this.coreTemp >= p.safeTemp) {
                    this.reactorStatus = "温度偏高";
                } else if (this.heatupProgress < 1) {
                    this.reactorStatus = "预热中...";
                } else {
                    this.reactorStatus = "正常运行";
                }
            } else {
                if (this.running && !hasFuel) {
                    this.reactorStatus = "无燃料";
                }
                this.heatupProgress = Math.max(0, this.heatupProgress - 0.005);
                this.coreTemp = Math.max(p.normalTemp, this.coreTemp - 0.1);
                this.neutronFlux = Math.max(0, this.neutronFlux - 0.02);
                this.thermalPower = 0;
                this.powerOutput = 0;
            }
        },

        startReactor(){ this.running = true; this.reactorStatus = "已启动"; },

        shutdownReactor(){
            this.controlRodDepth = 1.0;
            this.running = false;
            this.neutronFlux = 0;
            this.thermalPower = 0;
            this.powerOutput = 0;
            this.reactorStatus = "已停堆";
        },

        emergencyShutdown(){
            this.controlRodDepth = 1.0;
            this.running = false;
            this.neutronFlux = 0;
            this.thermalPower = 0;
            this.powerOutput = 0;
            this.reactorStatus = "紧急停堆";
        },

        setControlRod(v){ this.controlRodDepth = Math.max(0, Math.min(1, v)); },

        getPowerProduction(){
            return this.powerOutput;
        },

        updateTile(){
            this.super$updateTile();
            if (this.exploded) return;

            this.liquids.remove(Liquids.water, 0.5 * this.delta());
            const liquidAmount = this.liquids.get(Liquids.water);
            this.simulate(liquidAmount, this.block.liquidCapacity);

            if (this.coreTemp >= params.meltdownTemp) {
                this.exploded = true;
                Sounds.explosionQuad.at(this.x, this.y);
                Effect.shake(20, 20, this.x, this.y);
                Damage.damage(this.x, this.y, 8 * Vars.tilesize, 5000);
                this.kill();
            }
        },

        acceptLiquid(source, liquid){
            return liquid === Liquids.water;
        },

        buildConfiguration(table){
            table.background(Tex.pane);
            table.defaults().pad(4);

            const self = this;
            const p = params;

            table.add("[accent]═══ 反应堆状态 ═══").colspan(2).row();

            table.add("[lightgray]运行状态：").left();
            const runLabel = table.add("").left().get();
            runLabel.update(() => runLabel.setText("" + (self.running ? "[green]运行中" : "[gray]已停堆")));
            table.row();

            table.add("[lightgray]铀-235：").left();
            const fuelLabel = table.add("").left().get();
            fuelLabel.update(() => {
                const fuel = self.items.get(铀235);
                fuelLabel.setText("" + ((fuel > 0 ? "[green]" : "[red]") + fuel + " / " + self.block.itemCapacity));
            });
            table.row();

            table.add("[lightgray]运行时间：").left();
            const timeLabel = table.add("").left().get();
            timeLabel.update(() => timeLabel.setText("" + ((self.runtime / 60).toFixed(1) + " 秒")));
            table.row();

            table.add("[lightgray]预热进度：").left();
            const warmupLabel = table.add("").left().get();
            warmupLabel.update(() => warmupLabel.setText("" + ((self.heatupProgress * 100).toFixed(1) + " %")));
            table.row();

            table.add("[lightgray]堆芯温度：").left();
            const tempLabel = table.add("").left().get();
            tempLabel.update(() => tempLabel.setText("" + ((self.coreTemp > p.safeTemp ? "[red]" : "[white]") + self.coreTemp.toFixed(1) + " °C")));
            table.row();

            table.add("[lightgray]中子通量：").left();
            const fluxLabel = table.add("").left().get();
            fluxLabel.update(() => fluxLabel.setText("" + ((self.neutronFlux * 100).toFixed(1) + " %")));
            table.row();

            table.add("[lightgray]控制棒深度：").left();
            const rodLabel = table.add("").left().get();
            rodLabel.update(() => rodLabel.setText("" + ((self.controlRodDepth * 100).toFixed(1) + " %")));
            table.row();

            table.add("[lightgray]冷却液流量：").left();
            const coolantLabel = table.add("").left().get();
            coolantLabel.update(() => {
                const liq = self.liquids.get(Liquids.water);
                const pct = self.block.liquidCapacity > 0 ? (liq / self.block.liquidCapacity) * 100 : 0;
                coolantLabel.setText("" + ("[blue]" + pct.toFixed(1) + " %"));
            });
            table.row();

            table.add("[lightgray]热功率：").left();
            const thermalLabel = table.add("").left().get();
            thermalLabel.update(() => thermalLabel.setText("" + ("[orange]" + self.thermalPower.toFixed(1) + " MW")));
            table.row();

            table.add("[lightgray]发电量：").left();
            const powerLabel = table.add("").left().get();
            powerLabel.update(() => powerLabel.setText("" + ("[green]" + self.powerOutput.toFixed(1) + " MW")));
            table.row();

            table.add("[accent]警报：").left();
            const statusLabel = table.add("").left().get();
            statusLabel.update(() => statusLabel.setText("" + self.reactorStatus));
            table.row();

            table.add("[accent]控制棒深度").left().row();
            table.slider(0, 1, 0.01, self.controlRodDepth, v => self.setControlRod(v)).width(300).row();

            table.table(cons(bt => {
                bt.button("启动反应堆", () => self.startReactor()).size(130, 45).pad(4);
                bt.button("正常停堆", () => self.shutdownReactor()).size(130, 45).pad(4);
            })).row();

            table.table(cons(bt => {
                bt.button("[red]紧急停堆", () => self.emergencyShutdown()).size(130, 45).pad(4);
            })).row();
        },
    }, 重水反应堆);
});

module.exports = 重水反应堆;