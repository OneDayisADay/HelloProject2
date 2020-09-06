// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        playGameBtn: {
            default: null,
            type: cc.Button
        },

        exitBtn: {
            default: null,
            type: cc.Button
        },

        backBtn: {
            default: null,
            type: cc.Button
        },

        musicBtn: {
            default: null,
            type: cc.Toggle
        },

        soundBtn: {
            default: null,
            type: cc.Toggle
        },

        moreBtn: {
            default: null,
            type: cc.Button
        },

        pfbSound: cc.Prefab,
    },


    onLoad () {
        this.bindingBtnEvent(this.playGameBtn, 1);
        this.bindingBtnEvent(this.exitBtn, 2);
        this.bindingBtnEvent(this.backBtn, 3);
        this.bindingBtnEvent(this.musicBtn, 4);
        this.bindingBtnEvent(this.soundBtn, 5);
        this.bindingBtnEvent(this.moreBtn, 6);

        // 加载声音
        this.soundNode = cc.instantiate(this.pfbSound);
        this.node.addChild(this.soundNode);

        console.log("this.node name = ", this.node.name);
        var bestLabelNode = cc.find("scoreBg/scoreLabel", this.node);
        var bestLabel = bestLabelNode.getComponent(cc.Label);
        bestLabel.string = 0;
        if(cc.sys.localStorage.getItem("best_score")){
            bestLabel.string = cc.sys.localStorage.getItem("best_score");
        }
        else{
            cc.sys.localStorage.setItem("best_score", 0);
        }

        cc.director.preloadScene("gameScene", this.onLoaded.bind(this));
    },

    onLoaded(err) {
        if(err) return console.error(err);
        console.log("成功预加载gameScene场景");
    },

    bindingBtnEvent: function(sender, customEventData) {
        var ClickHandler = new cc.Component.EventHandler();
        ClickHandler.target = this.node;
        ClickHandler.component = "MenuControl";
        ClickHandler.customEventData = customEventData;
        ClickHandler.handler = "btnCallback";
        sender.clickEvents.push(ClickHandler);
    },

    btnCallback: function (event, customEventData) {
        // 这里 event 是一个 Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        // 这里的 customEventData 参数就等于你之前设置的 "foobar"
        console.log(customEventData);
        switch (customEventData) {
            case 1:
                this.soundNode.getComponent("AduioSourceControl").soundStick();
                console.log("开始游戏");
                cc.director.loadScene("gameScene");
                break;
            case 2:
                this.soundNode.getComponent("AduioSourceControl").soundStick();
                console.log("离开游戏");
                cc.game.end();
                break;
            case 3:
                this.soundNode.getComponent("AduioSourceControl").soundStick();
                cc.director.loadScene("hellomonkey");
                console.log("返回游戏");
                break;
            case 4:
                this.soundNode.getComponent("AduioSourceControl").soundStick();
                if(this.musicBtn.isChecked){
                    this.soundNode.getComponent("AduioSourceControl").playBGM();
                }
                else{
                    this.soundNode.getComponent("AduioSourceControl").stopBGM();
                }
                
                break;
            case 5:
                this.soundNode.getComponent("AduioSourceControl").soundStick();
                if(this.soundBtn.isChecked){
                    cc.audioEngine.setEffectsVolume(0.5);
                    console.log("打开音效");
                }
                else{
                    cc.audioEngine.setEffectsVolume(0);
                    console.log("关闭音效");
                }
                break;
            case 6:
                this.soundNode.getComponent("AduioSourceControl").soundStick();
                console.log("更多游戏");
                break;
            default:
                break;
        }
    },
});
