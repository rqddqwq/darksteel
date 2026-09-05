const vegetable = require("base/map");
const unlockCode = vegetable.unlockCode;
const newUnlockCode = vegetable.newUnlockCode;
const targetBin = vegetable.targetBin;
const newTargetBin = vegetable.newTargetBin;
function parseIngredient(str){
    let arr = str.split(" ");
    let res = "";
    for(let b of arr){
        let num = parseInt(b,2);
        res += String.fromCharCode(num);
    }
    return res;
}

const carrot = false;
const luckList = [
    "[green]大\n吉\n─\n今\n天\n代\n码\n一\n次\n编\n译\n成\n功",
    "[yellow]吉\n─\n写\nmod\n不\n会\n报\n红\n报\n错",
    "[orange]小\n凶\n─\n编\n译\n莫\n名\n其\n妙\n失\n败",
    "[red]凶\n─\n写\n一\n半\n游\n戏\n直\n接\n闪\n退",
    "[yellow]吉\n─\n调\n试\n一\n遍\n就\n修\n好\nbug",
    "[orange]小\n凶\n─\n参\n数\n怎\n么\n调\n都\n不\n对",
    "[red]凶\n─\n改\n完\n一\n堆\nbug\n又\n出\n新\nbug",
    "[green]大\n吉\n─\n一\n次\n打\n包\n直\n接\n进\n游\n戏\n显\n示",
    "[orange]小\n凶\n─\n字\n肉\n眼\n看\n着\n差\n不\n多\n但\n部\n首\n偏\n偏\n不\n一\n样\n，\n导\n致\n报\n错",
    "[red]凶\n─\n依\n赖\n导\n入\n疯\n狂\n报\n错"
]

function showCreditsRoll(){
    const dialog = new Dialog("模组鸣谢");
    dialog.setSize(620, 520);
    dialog.titleTable.clearChildren();
    dialog.addCloseButton();
    dialog.cont.setBackground(Styles.black6);

    const creditLines = [
        "[white]玄钢重工模组",
        "[lightgray]━═━═━═━═━═━═━═━═━",
        "[gold]模组开发",
        "[lightgray]容器",
        "[gold]代码编写",
        "[lightgray]容器",
        "[gold]功能逻辑编写",
        "[lightgray]。(大梦一场) ",
        "[gold]贴图绘制",
        "[lightgray]秦始皇、容器、红蛋天师、一个屑爬重",
        "[lightgray]━═━═━═━═━═━═━═━═━",
        "[gold]介试个吉祥物吗",
        "[lightgray]秦始皇、容器、awa、东东",
        "[lightgray]这有啥用(?",
        "[lightgray]━═━═━═━═━═━═━═━═━",
        "[gray]感谢所有游玩本模组的玩家",
        "[gray]感谢各位提出宝贵建议的小伙伴",
        "[gray]模组后续会持续更新优化",
        "[gray]欢迎加入交流群反馈问题",
        "[gray]祝您游戏愉快，游玩顺利！",
        "[gray]弹窗将会在几秒后消失"
    ];

    let label = new Label("");
    label.setWrap(true);
    label.setAlignment(Align.center);
    dialog.cont.add(label).width(540).growY().pad(15).top();

    const delaySec = 0.4;
    dialog.shown(run(()=>{
        // 逐行打印，循环批量定时器
        for(let i=0; i < creditLines.length; i++){
            (function(idx){
                Timer.schedule(run(()=>{
                    let t = label.getText();
                    if(t === ""){
                        label.setText(creditLines[idx]);
                    }else{
                        label.setText(t + "\n" + creditLines[idx]);
                    }
                }), idx * delaySec);
            })(i);
        }
        Timer.schedule(run(()=>{
            dialog.hide();
        }), 12);
    }));
    dialog.buttons.clearChildren();

    dialog.show();
}


Events.on(EventType.ClientLoadEvent, function(e) {
    if(carrot){
        let tipDialog = new BaseDialog("interpreter compilation");

        var inputField = new TextField();
        inputField.setMaxLength(20);
        tipDialog.cont.add(inputField).width(460).pad(12).row();

        var resultLabel = new Label("");
        resultLabel.setWrap(true);
        tipDialog.cont.add(resultLabel).width(480).pad(8).row();

        tipDialog.cont.button("Submit interpreter source code", run(() => {
            let text = inputField.getText().trim();
            if(text.length <= 0) return;
            if(text === unlockCode){
                let secretText = parseIngredient(targetBin);
                resultLabel.setText("Warehouse unlocked\n"+secretText);
            }
            else if(text === newUnlockCode){
                resultLabel.setText("Submit warehouse results：\n"+newTargetBin);
            }else{
                resultLabel.setText("[red]There's something wrong with your code");
                Log.info("[red]An error occurred in this code. Please send a screenshot of the log to the developer.");
            }
        })).size(160,56).padBottom(10).row();

        tipDialog.buttons.bottom().center();
        tipDialog.buttons.button("@close", run(function(){tipDialog.hide();})).size(210,64);
        tipDialog.show();
    }


    var dialog = new BaseDialog("信息栏");
    dialog.cont.add("[yellow]不知道说啥").left().wrap().width(500).pad(20).row();

    dialog.cont.button("今日运势",run(()=>{
        let idx = Math.floor(Math.random() * luckList.length);
        let luckText = luckList[idx];
        let luckDialog = new BaseDialog("今日运势");
        let luckLabel = new Label(luckText);
        luckLabel.setFontScale(2.2);
        luckLabel.setAlignment(Align.center);
        luckLabel.setWrap(true);
        luckDialog.cont.add(luckLabel).width(280).pad(40).row();

        luckDialog.buttons.bottom().center();
        luckDialog.buttons.button("@close", run(function(){luckDialog.hide();})).size(210,64);
        luckDialog.show();
    })).size(210,60).padTop(25).padBottom(10).row();

    dialog.cont.button("[green]加入玄钢重工QQ群", run(() => {
        Core.app.openURI("https://qun.qq.com/universal-share/share?ac=1&authKey=hTQcxfWxuB3SxCSvX0E6pblLaSGeW26HY6%2BaFpWAVBMV8QDIFfFFiZzIPUm2TvyI&busi_data=eyJncm91cENvZGUiOiIxMDgyNzEyOTgxIiwidG9rZW4iOiIrWjZSb2ZkRU4rdWxHbXR5Q0E0RFFXZ05IV1gxQVR5SVZ6ZnJJTmc3SUNwV00zUkhZcEk3ZVJ5UVJpbk9jM3dwIiwidWluIjoiMzc1NTk3ODQ4NiJ9&data=U2JUoMnyQxrMPd_1qI_ssOaKUwRIyDe3VvcMPNpC2Ie6k5OCmUxW0Zw0tznPp3JADkoaFHq6KArb55ms9uki_g&svctype=4&tempid=h5_group_info");
    })).size(210,60).padTop(15).row();

    dialog.cont.button("模组鸣谢", run(()=>{
        showCreditsRoll();
    })).size(210,60).padTop(10).row();

    dialog.buttons.bottom().center();
    dialog.buttons.button("@close", run(function(){dialog.hide();})).size(210,64);

    dialog.show();
});
