const 墙 = extend(Wall, "墙", {});
墙.buildType = () => extend(Wall.WallBuild, 墙, {
    updateTile(){
        this.super$updateTile();
    },
    handleDamage(X){
        if(X > 0) X = 10;
        return X;
    }
});
