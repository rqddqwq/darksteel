const items = require("items")
function r(a, m){
    return Math.round(a * Math.pow(10, m)) / Math.pow(10, m);
}

const rectLength = 9;
const rectWidth  = 5;
const gap        = 1;

function getForceRect(cx, cy, rotation){
    rotation = (rotation + 1) % 4;

    const tile = Vars.tilesize;
    const len  = rectLength * tile;
    const wid  = rectWidth  * tile;
    const gapPx = gap * tile;

    let rx, ry, rw, rh;
    switch(rotation){
        case 0:
            rx = cx - len / 2;
            ry = cy - gapPx - wid;
            rw = len; rh = wid;
            break;
        case 1:
            rx = cx + gapPx;
            ry = cy - len / 2;
            rw = wid; rh = len;
            break;
        case 2:
            rx = cx - len / 2;
            ry = cy + gapPx;
            rw = len; rh = wid;
            break;
        case 3:
            rx = cx - gapPx - wid;
            ry = cy - len / 2;
            rw = wid; rh = len;
            break;
        default:
            rx = cx; ry = cy; rw = 0; rh = 0;
    }
    return { x: rx, y: ry, w: rw, h: rh };
}

const 小型立场 = extend(ForceProjector, '小型立场', {
    setStats(){
        this.super$setStats();
        this.stats.remove(Stat.range);
        this.stats.add(Stat.range, extend(StatValue, {
            display(table){
                table.add("[lightgray][]").left().padRight(6);
                table.add("[accent]" + rectLength + " × " + rectWidth + "[]").left();
            }
        }));
    }
});
小型立场.configurable = true;
小型立场.rotate = true;
小型立场.health = 800;
小型立场.size = 2;
小型立场.hasPower = true;
小型立场.consumePower(3);
小型立场.radius = 0;
小型立场.buildVisibility = BuildVisibility.shown;
小型立场.category = Category.effect;
小型立场.requirements = ItemStack.with(
	items.钢, 200,
	items.硅钢, 150,
);

小型立场.buildType = prov(() => {
    return extend(ForceProjector.ForceBuild, 小型立场, {
        broke: false,
        contain: 0,
        mul: 0,

        drawShield(){ },

        updateTile(){
            if(this.contain == null || isNaN(this.contain)) this.contain = 0;
            if(this.broke == null) this.broke = false;

            const raw = this.power ? this.power.status : 0;
            this.mul = isNaN(raw) ? 0 : r(raw, 4);

            if(this.contain > 0) this.contain -= 0.15;
            if(this.contain > 100 * this.mul) this.broke = true;
            if(this.broke && this.contain <= 0) this.broke = false;

            if(this.mul > 0.01 && !this.broke){
                const rect = getForceRect(this.x, this.y, this.rotation);
                const bullets = Groups.bullet.intersect(rect.x, rect.y, rect.w, rect.h);
                if(bullets.size > 0){
                    for(let i = 0; i < bullets.size; i++){
                        const b = bullets.get(i);
                        if(b == null || b.team === this.team) continue;
                        this.contain += b.damage / 25;
                        b.absorb();
                    }
                }
            }
        },

        draw(){
            this.super$draw();

            if(this.broke || this.mul < 0.01) return;

            const rect = getForceRect(this.x, this.y, this.rotation);

            Draw.z(Layer.shields + 0.001);
            Draw.color(this.team.color, Color.white, 0.8);
            Fill.rect(rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w, rect.h);
            Draw.reset();
        },
    });
});

module.exports = 小型立场;