function r(a,m){
    var y=Math.round(a*Math.pow(10,m))/Math.pow(10,m)
    return y
}
function lerpDelta(a,b,delta){
    return a+(b-a)*delta
}

function f(x,a){
    return a*Math.pow(x,2)+((1-a)*x)
}

function po(d,range,mul,a){
    if (d < range){
        return r(f(((range+1-d)/range),a)*mul,2)
    }
    else {return 0}
}

const range=6
const mul=0.12
const a=0.63

const 风力发电机 = extend(ConsumeGenerator, '风力发电机', {
    setStats() {
        this.super$setStats();
        this.stats.add(Stat.input, new JavaAdapter(StatValue, {
            display(table) {
                table.add("风").left().row();
            }
        }));
    },

    setBars() {
		this.super$setBars();
		this.addBar("heat", func(e => new Bar(
			prov(() => "效率"+r(e.geteff()*100,2)+"%"),
			prov(() => Color.valueOf("ffd06d")),
			floatp(() => e.warmup)
		)));
	},
    drawPlace(x, y, rotation, valid){
        var tileSize = Vars.tilesize;
        var centerX = x * tileSize;
        var centerY = y * tileSize;
        var previewRange = 11;
        var halfLen = previewRange * tileSize;

        Drawf.dashSquare(Color.valueOf("#ffdd0066"), centerX, centerY, halfLen);
        
        for(let ix=-range;ix<=range;ix++){
            for(let iy=-range;iy<=range;iy++){
                let tile=Vars.world.tile(x+ix,y+iy)
                if(tile && tile.block()!=Blocks.air){
                    Draw.color(Color.valueOf("#ff444466"))
                    Draw.rect(Core.atlas.find("clear"),(x+ix)*tileSize,(y+iy)*tileSize)
                }
            }
        }
        Draw.color()
    }
})

风力发电机.warmupSpeed = 0

风力发电机.buildType = prov(() => {
    return new JavaAdapter(ConsumeGenerator.ConsumeGeneratorBuild, {
        bar:0,
        warmup:0,
        updateTile(){
            this.super$updateTile();
            let count=0
            for(let ix=-range;ix<=range;ix++){
                for(let iy=-range;iy<=range;iy++){
                    if(ix==0&&iy==0)continue
                    let tile=Vars.world.tile(this.tileX()+ix,this.tileY()+iy)
                    if(!tile)continue
                    let other=tile.build
                    if(tile.block()!==Blocks.air && other!=this){
                        count+=po(Math.abs(ix)+Math.abs(iy),range,mul,a)
                    }
                }
            }
            this.bar=count

            if (Math.abs(this.warmup-this.geteff())<0.01){
                this.warmup=this.geteff()
            }else{
                if(this.warmup<this.geteff()){
                    this.warmup=lerpDelta(this.warmup,this.geteff(),0.002*this.geteff())
                }else{
                    this.warmup-=0.002
                }
            }
        },
        getBars(){
            return Math.min(this.bar,1)
        },
		getPowerProduction(){
		    return 2*this.geteff()
		},
		geteff(){
		    return Math.max(0,1-this.getBars())
		},
    	write(write){
    		this.super$write(write)
    		write.f(this.bar);
    		write.f(this.warmup)
    	},
    	read(read, revision){
    		this.super$read(read, revision);
    		this.bar = read.f();
    		this.warmup=read.f()
    	}
    },风力发电机);
});

exports.风力发电机 = 风力发电机;
