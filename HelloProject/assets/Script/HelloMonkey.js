cc.Class({
    extends: cc.Component,

    properties: {
        startBtn: {
            default: null,
            type: cc.Button
        },

        bgm: {
            default: null,
            type: cc.AudioClip
        },

        btnClick: {
            default: null,
            type: cc.AudioClip
        },
        // defaults, set visually when attaching this script to the Canvas
    },

    // use this for initialization
    onLoad() {
        var clickHandler = new cc.Component.EventHandler();
        clickHandler.target = this.node;
        clickHandler.component = "HelloMonkey";
        clickHandler.handler = "callback";
        clickHandler.customEventData = "startGame";
        this.startBtn.clickEvents.push(clickHandler);
        //第二种
        //this.startBtn.node.on('click', this.callback, this);
        cc.audioEngine.playMusic(this.bgm, true);

        cc.director.preloadScene("gameMenu", this.onLoaded.bind(this));
    },

    // called every frame
    update: function (dt) {
        
    },

    onLoaded(err) {
        if(err) return console.error(err);
        console.log("成功预加载gameMenu场景");
    },

    callback: function (event, customEventData) {
        // 这里 event 是一个 Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        // 这里的 customEventData 参数就等于你之前设置的 "foobar"

        if (customEventData == "startGame"){
            console.log("开始游戏");

            cc.audioEngine.playEffect(this.btnClick, false)
            cc.director.loadScene("gameMenu");
        }
    }

});
