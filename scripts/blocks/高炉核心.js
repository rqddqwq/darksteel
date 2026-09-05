const coord=[-1,2,0,2,1,2,2,2,-1,1,0,1,1,1,2,1,-1,0,1,0,2,1,-1,-1,0,-1,1,-1,2,-1]
const list=[1,2,2,1,
           2,3,1,2,
           2,  3,2,
           1,2,2,1]
function bbbb(a){
	var b
	a=a.toString()
 if(a=="玄钢重工-石英墙"){b=1}
 if(a=="玄钢重工-硅墙"){b=2}
 if(a=="玄钢重工-窑壁"){b=3}
return b
}
//~~~~~~~~~~~~~~
var auto = false
const 高炉核心 = extend(GenericCrafter, '高炉核心', {});
高炉核心.configurable = true;
高炉核心.buildType = prov(() => {
	var other
	var ii=0
	var d
	var bb
	var cc
	var e
	return new JavaAdapter(GenericCrafter.GenericCrafterBuild, {
 buildConfiguration(table){
 table.button("操作", Icon.book, run(() => {
 var dialog = new BaseDialog("高炉核心");
 dialog.cont.add("").row();
 dialog.cont.add(" ").row();

 
 dialog.cont.button("教程", Icon.info, run(() => {
     var tut = new BaseDialog("教程");
     tut.cont.add("请按照以下结构搭建现在没贴图").row();
     tut.cont.image(Core.atlas.find("玄钢重工-高炉图")).row();
     tut.buttons.button("@close", () => { tut.hide(); }).size(120, 50);
     tut.show();
 })).size(140, 70).row();

 dialog.cont.add(" ").row();

 if (cc == 0) {
     dialog.cont.add("[yellow]你可以试试放前线当墙用").row();
 } else {
     dialog.cont.add("[blue]造好了还不点建造?").row();
     dialog.cont.add(" ").row();
     dialog.cont.button("建造", Icon.infoCircle, run(() => {
         dialog.hide();
         e = 1;
     })).size(140, 70);
 }

 dialog.buttons.button("@close", () => { dialog.hide(); }).size(120, 50);
 dialog.show();
 })).size(100, 50);
 },
 updateTile(){
 this.super$updateTile()
 other = Vars.world.build(this.tileX()+coord[2*ii], this.tileY()+coord[(2*ii)+1])
if (cc==1 && e==1){
    const furnace = Vars.content.block("玄钢重工-高炉");
    if(furnace != null){
        Vars.world.tile(this.tileX(), this.tileY()).setBlock(furnace, this.team);
    }
}
if (other!=null){
 bb=bbbb(other.block);
 if (other.team!=this.team){d=0}
 }else{bb=null}
 if (bb!=list[ii]){d=0}
 if (ii<11){ii=ii+1}
 else{ii=0;
 if (d==1){cc=1}
 else{cc=0;d=1}}
 }
	},高炉核心);
});
