// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var platformArea = 
[
    [1,0,170,580],
    [185,0,163,580],
    [357,0,160,580],
    [519,0,160,580],
    [681,0,160,580],
    [843,0,160,580],
];

var beginPosX = -360 + platformArea[1][2]/2;

var Idle = 
[
    [1783,647,242,297],
    [1783,946,242,297],
    [1783,1245,242,297],
    [1,1286,242,297],
    [245,1286,242,297],
    [805,1279,242,297],
    [1049,1279,242,297],
    [1293,1279,242,297],
    [1537,1279,242,297],
];

var Walk = 
[
    [1,1,324,321],
    [327,1,324,321],
    [653,1,324,321],
    [979,1,324,321],
    [1305,1,324,321],
    [1631,1,324,321,1],
    [1,324,324,321],
    [327,324,324,321],
    [653,324,324,321],
    [979,324,324,321],
    [1305,324,324,321],
    [1631,324,324,321],
    [1,647,324,321],
    [327,647,324,321],
    [653,647,324,321],
    [1305,324,324,321],
];

var Fall = 
[
    [979,647,266,314],
    [1247,647,266,314],
    [1515,647,266,314],
    [979,963,266,314],
    [1247,963,266,314],
    [1515,963,266,314],
    [1,970,266,314],
    [269,970,266,314],
    [537,970,266,314],
];

cc.Class({
    extends: cc.Component,

    properties: {
        platform_sprite:{
            default : null,
            type : cc.SpriteFrame,
        },

        monkey_sprite:{
            default : null,
            type : cc.SpriteFrame,
        },
        
        platform_node1:{
            default : null,
            type : cc.Node,
        },

        platform_node2:{
            default : null,
            type : cc.Node,
        },

        goldStick:{
            default : null,
            type : cc.Sprite,
        },
        
        isTouched: false,

        pfbSound: cc.Prefab,     //声音pfb
    },

    onLoad(){
        this.isTouched = false;
        this.openTouch();

        var monkeyNode = new cc.Node('monkey');
        monkeyNode.addComponent(cc.Sprite);
        monkeyNode.parent = this.node;
        monkeyNode.zIndex = 10;

        var goldStick = this.node.getChildByName("stick");
        this.goldStick = goldStick;
        this.goldStick.zIndex = 11;

        this.scoreLabel = cc.find("totalscore/scoreLabel", this.node).getComponent(cc.Label);
        this.scoreLabel.string = 0;

        this.gameOver = cc.find("gameover", this.node);
        this.gameOver.active = false;

        this.tipNode = cc.find("tipNode", this.node);
        this.tipNode.active = true;

        this.gameResult = cc.find("GameResult", this.node);
        this.gameResult.active = false;
        this.gameResult.zIndex = 100;

        // 加载声音
        this.soundNode = cc.instantiate(this.pfbSound);
        this.node.addChild(this.soundNode);
    },

    openTouch(){
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
    },

    closeTouch(){
        this.node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
    },

    _touchStart (event){
        var monkeyNode = this.node.getChildByName("monkey");
        var goldStick = this.node.getChildByName("stick");
        goldStick.x = monkeyNode.x + this.platform_node1.width/2 - 10;
        goldStick.y = monkeyNode.y - 76;
        
        this.soundNode.getComponent("AduioSourceControl").soundStick();
        this.tipNode.active = false;
        this.isTouched = true;
    },

    _touchEnd (event) {
        this.isTouched = false;
        this.closeTouch();
        this.crossPlatform();
    },

    update(dt){
        var goldStick = this.node.getChildByName("stick");
        if (this.isTouched)
        {
            goldStick.height += 10;
        }
    },

    start() {
        var index = this.getRandomNum(1, 6) - 1;
        this.platform_node1 = this.getPlatformSpriteFrame(index);
        this.platform_node2 = this.getPlatformSpriteFrame(index);

        this.platform_node1.zIndex = 10;
        this.platform_node2.zIndex = 10;
        this.resetPlatformAndMonkeyPos(true);
    },

    // 获取贴图
    getPlatformSpriteFrame(index) {
        var node = new cc.Node('Platform');
        var sp = node.addComponent(cc.Sprite);
        sp.type = cc.Sprite.Type.SLICED;
        sp.spriteFrame = this.platform_sprite.clone();
        node.parent = this.node;
        var x = platformArea[index][0];        
        var y = platformArea[index][1];       
        var width = platformArea[index][2];
        var height = platformArea[index][3];
        var tmpRect = new cc.Rect(x,y,width,height);
        // 设置 SpriteFrame 的纹理矩形区域
        sp.spriteFrame.setRect(tmpRect);
        node.width = platformArea[index][2];
        node.height = height;
        node.x = 500;
        node.y = -360;

        return node;
    },

    getRandomNum(min, max)
    {
        return min + Math.floor((max - min + 1) * Math.random());
    },

    addMonkeyAnimation(stateRect, animName){
        /* 动态添加动画代码示例 */
        var monkeyNode = this.node.getChildByName("monkey");
        var sp = monkeyNode.getComponent(cc.Sprite);
        sp.spriteFrame = this.monkey_sprite.clone();
        var tmpRect = new cc.Rect(stateRect[0][0], stateRect[0][1], stateRect[0][2], stateRect[0][3]);
        // 设置 SpriteFrame 的纹理矩形区域
        sp.spriteFrame.setRect(tmpRect);
        monkeyNode.width = stateRect[0][2];
        monkeyNode.height = stateRect[0][3];
        monkeyNode.scale = 0.5;

        var aniclip = monkeyNode.getChildByName(animName)
        if(aniclip){
            animation.play(animName);
        }
        else{
            var animation = monkeyNode.addComponent(cc.Animation);
            /* 添加SpriteFrame到frames数组 */
            var frames = [];
            for (let index = 0; index < stateRect.length; index++) {
                const element = stateRect[index];
                let tmpRect = new cc.Rect(element[0], element[1], element[2], element[3]);
                var spf = new cc.SpriteFrame();
                spf = this.monkey_sprite.clone();
                spf.setRect(tmpRect);
                frames[index] = spf;
            }
            var frameSpeed = 5;
            if(animName == "anim_idle"){
                frameSpeed = 9;
            }
            else if(animName == "anim_walk"){
                frameSpeed = 24;
            }
            else if(animName == "anim_fall"){
                frameSpeed = 9;
            }

            var clip = cc.AnimationClip.createWithSpriteFrames(frames, frameSpeed);
            clip.name = animName;
            clip.wrapMode = cc.WrapMode.Loop;

            animation.addClip(clip);
            animation.play(animName);
        }
        
    },

    resetPlatformAndMonkeyPos(isRestart){
        var self = this;
        var monkeyNode = this.node.getChildByName("monkey");
        this.addMonkeyAnimation(Idle, "anim_idle");

        var randomPosX = this.getRandomNum(beginPosX + 200, beginPosX + 500);
        var pScaleX = this.getRandomNum(30, 90) / 100;
        console.log(pScaleX);

        if(isRestart)
        {
            this.tipNode.active = true;
            this.scoreLabel.string = 0;
            this.platform_node1.x = 500;
            this.platform_node2.x = 500;
            monkeyNode.x = 500;
            monkeyNode.y = 0;
        }
        else{
            [this.platform_node1, this.platform_node2] = [this.platform_node2, this.platform_node1];
            this.platform_node2.x = 500;

            this.scoreLabel.string = Number(this.scoreLabel.string) + 1;
        }

        this.gameOver.active = false;
        this.gameResult.active = false;

        this.platform_node2.width = platformArea[0][2] * pScaleX
        
        var speed = 1000;
        var dst = Math.abs(this.platform_node1.x - beginPosX);
        var platform_node1Move = cc.moveTo(dst / speed, beginPosX, this.platform_node1.y);
        var platform_node2Move = cc.moveTo(dst / speed, randomPosX, this.platform_node2.y);
        
        this.platform_node1.runAction(platform_node1Move);
        this.platform_node2.runAction(platform_node2Move);

        var monkeyMove = cc.moveTo(dst / speed, beginPosX, monkeyNode.y);
        var finished = cc.callFunc(function(){
            self.openTouch();
        }, this);
        var seq = cc.sequence(monkeyMove, finished);
        monkeyNode.runAction(seq);

        this.restGoldStickState();
    },
    

    crossPlatform(){
        var self = this;
        var goldStick = this.node.getChildByName("stick");

        this.soundNode.getComponent("AduioSourceControl").soundStickDown();
        var rotateAction = cc.rotateBy(0.5, 90);
        var finished = cc.callFunc(function(){
            self.monkeyWalk();
        }, this);
        var seq = cc.sequence(rotateAction, finished);
        goldStick.runAction(seq);
    },

    monkeyWalk(){
        var goldStick = this.node.getChildByName("stick");
        var walkDistance = goldStick.height + this.platform_node1.width/2;

        var platformDistance = Math.ceil(Math.abs(this.platform_node1.x - this.platform_node2.x));
        var minWalk = platformDistance - this.platform_node2.width/2;
        var maxWalk = platformDistance + this.platform_node2.width/2;
        console.log(walkDistance, platformDistance, this.platform_node2.width);
        
        var speed = 500;
        var monkeyNode = this.node.getChildByName("monkey");
        var monkeyMove = cc.moveBy(walkDistance / speed, walkDistance, 0);

        this.addMonkeyAnimation(Walk, "anim_walk");
        this.soundNode.getComponent("AduioSourceControl").soundWalk();
        var finished = cc.callFunc(function(){
            if(walkDistance >= minWalk &&  walkDistance <= maxWalk)
            {
                console.log("猴子跨过了平台");
                this.resetPlatformAndMonkeyPos(false);
                //此时走出的步数最接近实际的理想距离
                if(Math.abs(walkDistance - platformDistance) <= 20){
                    this.soundNode.getComponent("AduioSourceControl").soundWonderful();
                }
            }
            else{
                console.log("猴子掉到了河里");
                this.monkeyFallDown();
            }
        }, this);
        var seq = cc.sequence(monkeyMove, finished);
        monkeyNode.runAction(seq);
    },

    monkeyFallDown(){
        this.soundNode.getComponent("AduioSourceControl").soundOver();

        this.gameOver.scale = 0.5;
        var scaleTo = cc.scaleTo(0.5, 1);
        this.gameOver.runAction(scaleTo);
        this.gameOver.active = true;
        
        this.addMonkeyAnimation(Fall, "anim_fall");
        var finished = cc.callFunc(function(){
            console.log("弹出结算面板");
            this.setResultGameInfo();
            this.gameResult.active = true;
        }, this);

        var monkeyNode = this.node.getChildByName("monkey");
        var monkeyMove = cc.moveBy(1, 0, -640);
        var seq = cc.sequence(monkeyMove, finished);
        monkeyNode.runAction(seq);
    },

    restGoldStickState(){
        var goldStick = this.node.getChildByName("stick");
        goldStick.x = -500;
        goldStick.y = 0;
        goldStick.height = 80;
        goldStick.angle = 0;
    },

    setResultGameInfo(){
        var resultBgNode = cc.find("GameResult/bgNode", this.node);
        var GameBgPrefab = resultBgNode.getComponent("GameBgPrefab");
        GameBgPrefab.changeRandomBg();
        var resultScoreNode = cc.find("GameResult/menuLayer/resultScore", this.node);
        var resultScore = resultScoreNode.getComponent(cc.Label);
        resultScore.string = this.scoreLabel.string;

        var best_score = cc.sys.localStorage.getItem("best_score");
        console.log(this.scoreLabel.string);
        if(!best_score)
        {
            best_score = 0;
        }

        console.log(best_score);
        if(best_score < Number(this.scoreLabel.string)){
            cc.sys.localStorage.setItem("best_score", Number(this.scoreLabel.string));
            best_score = Number(this.scoreLabel.string);
        }
        var bestScoreNode = cc.find("GameResult/menuLayer/scoreBg/scoreLabel",this.node);
        var bestScore = bestScoreNode.getComponent(cc.Label);
        bestScore.string = best_score;
    },

    //结算界面按钮事件
    onButtonClick(event, customData) {
        
        switch (customData) {
            case "restart":
                this.soundNode.getComponent("AduioSourceControl").soundPlayGame();
                this.resetPlatformAndMonkeyPos(true);
                break;
            case "back":
                this.soundNode.getComponent("AduioSourceControl").soundClick();
                cc.director.loadScene("gameMenu");

            case "fullscreen":
                this.soundNode.getComponent("AduioSourceControl").soundClick();
            case "music":
                this.soundNode.getComponent("AduioSourceControl").soundClick();
                var musickCB = cc.find('GameResult/menuLayer/musicTog', this.node).getComponent(cc.Toggle);
                if(musickCB.isChecked){
                    this.soundNode.getComponent("AduioSourceControl").playBGM();
                }
                else{
                    this.soundNode.getComponent("AduioSourceControl").stopBGM();
                }
            case "sound":
                this.soundNode.getComponent("AduioSourceControl").soundClick();
                var soundCB = cc.find('GameResult/menuLayer/soundTog', this.node).getComponent(cc.Toggle);
                if(soundCB.isChecked){
                    cc.audioEngine.setEffectsVolume(0.5);
                }
                else{
                    cc.audioEngine.setEffectsVolume(0);
                }
            case "facebook":
                this.soundNode.getComponent("AduioSourceControl").soundClick();
            case "twitter":
                this.soundNode.getComponent("AduioSourceControl").soundClick();
            case "google":
                this.soundNode.getComponent("AduioSourceControl").soundClick();
            default:
                break;
        }
    },
});