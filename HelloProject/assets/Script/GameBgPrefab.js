// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var waterSpRect =
[
    [1,1,1172,452],
    [1,455,1171,432],
    [1,889,1173,420],
    [1,1311,1171,415],
    [1,1728,1179,294],
];

var bgPartSpRect =
[
    [1,1,1169,283],
    [1,286,1173,107],
    [1,395,1172,106],
    [1,503,1172,106]
];

//白云
var bgCloudSpRect1 =
[
    [257,225,185,84],
    [1,1,403,113],
    [220,311,160,45],
    [1,299,217,61],
    [1,225,254,72],
    [1,116,383,107]
];

//黄云
var bgCloudSpRect2 =
[
    [1,224,253,71],
    [1,1,403,112],
    [1,224,253,71],
];

cc.Class({
    extends: cc.Component,

    properties: {
        bgSFArr:{
            default : [],
            type : [cc.SpriteFrame]
        },
        bgSpr1:{
            default : null,
            type : cc.SpriteFrame
        },
        bgSpr2:{
            default : null,
            type : cc.SpriteFrame
        },
        bgCloud1:{
            default : null,
            type : cc.SpriteFrame
        },
        bgCloud2:{
            default : null,
            type : cc.SpriteFrame
        },
    },


    onLoad () {
        this.changeRandomBg();
    },

    getRandomNum(min, max)
    {
        return min + Math.floor((max - min + 1) * Math.random());
    },

    changeRandomBg(){
        var bg = this.node.getComponent(cc.Sprite);
        var index = this.getRandomNum(0, 5);
        if(this.bgSFArr[index])
        {
            bg.spriteFrame = this.bgSFArr[index];
        }

        this.dealWithBgIndex(index);
    },

    start () {

    },

    dealWithBgIndex(index){
        var bottomNode = cc.find("bgBttom", this.node);
        if(!bottomNode)
        {
            bottomNode = new cc.Node('bgBottom');
            bottomNode.addComponent(cc.Sprite);
            bottomNode.parent = this.node;
        }
        
        var sp = bottomNode.getComponent(cc.Sprite);
        var spfRectArea = this.getRectByBgIndex(index);
        console.log("getRectByBgIndex = ", index);
        
        sp.spriteFrame = spfRectArea[1].clone();
        var x = spfRectArea[0][0];        
        var y = spfRectArea[0][1];
        var width = spfRectArea[0][2];
        var height = spfRectArea[0][3];
        var tmpRect = new cc.Rect(x,y,width,height);
        // 设置 SpriteFrame 的纹理矩形区域
        sp.spriteFrame.setRect(tmpRect);
        bottomNode.width = width;
        bottomNode.height = height;
        bottomNode.scale = 0.8;
        bottomNode.x = 0;
        bottomNode.y = 0;

        var height = this.node.height;
        console.log("height = ", height);
        if(index == 0 || index == 1 || index == 2)
        {
            bottomNode.y = 0 - height/2 + 50;
        }
        else if(index == 3 || index == 4 || index == 5)
        {
            bottomNode.y = 0 - height/2 - 15;
        }

        if(index == 2)
        {
            var animation = bottomNode.addComponent(cc.Animation);
            /* 添加SpriteFrame到frames数组 */
            var frames = [];
            for (let index = 0; index < waterSpRect.length - 1; index++) {
                const element = waterSpRect[index];
                let tmpRect = new cc.Rect(element[0], element[1], element[2], element[3]);
                var spf = new cc.SpriteFrame();
                spf = this.bgSpr1.clone();
                spf.setRect(tmpRect);
                frames[index] = spf;
            }

            var clip = cc.AnimationClip.createWithSpriteFrames(frames, 6);
            clip.name = "animation1";
            clip.wrapMode = cc.WrapMode.Loop;

            animation.addClip(clip);
            animation.play("animation1");
        }
        else if(index == 5){
            this.addCloudMove(false);
        }
    },

    getRectByBgIndex(index){
        if(index == 0)
        {
            return [waterSpRect[4], this.bgSpr1]
        }
        else if(index == 1)
        {
            return [bgPartSpRect[0], this.bgSpr2]
        }
        else if(index == 2)
        {
            //加水动画和白云动画
            return [waterSpRect[1], this.bgSpr1]
        }
        else if(index == 3)
        {
            return [bgPartSpRect[1], this.bgSpr2]
        }
        else if(index == 4)
        {
            return [bgPartSpRect[2], this.bgSpr2]
        }
        else if(index == 5)
        {
            //加黄色的云动画
            return [bgPartSpRect[3], this.bgSpr2]
        }
    },

    addCloudMove(isWhiteCloud){
        var bgNode1 = new cc.Node('bgNode1');
        var bgNode2 = new cc.Node('bgNode2');
        var bgNode3 = new cc.Node('bgNode3');

        bgNode1.parent = this.node;
        bgNode2.parent = this.node;
        bgNode3.parent = this.node;

        var bgCloudSpRect = isWhiteCloud?bgCloudSpRect1:bgCloudSpRect2;
        var cloneSpf = isWhiteCloud?this.bgCloud1:this.bgCloud2;

        this.addCloudSingle(bgNode1, bgCloudSpRect[0], cloneSpf);
        this.addCloudSingle(bgNode2, bgCloudSpRect[1], cloneSpf);
        this.addCloudSingle(bgNode3, bgCloudSpRect[2], cloneSpf);
        bgNode1.x = 360 + 240;
        bgNode1.y = 300;

        bgNode2.x = 360 + 240;
        bgNode2.y = 400;

        bgNode3.x = 360 + 240;
        bgNode3.y = 500;

        var self = this;

        var actionFunc = function(cloud){
            var orignalX = cloud.x;
            var timeDelay = self.getRandomNum(0, 6);
            var actionDelay = cc.delayTime(timeDelay);
            var actionMove = cc.moveBy(6, -1440, 0)
            var finished = cc.callFunc(function(){
                cloud.x = orignalX;
                timeDelay = self.getRandomNum(0, 3);
                actionDelay = cc.delayTime(timeDelay);
                cloud.runAction(cc.sequence(actionDelay, actionMove, finished));
            }, this);
            cloud.runAction(cc.sequence(actionDelay, actionMove, finished));
        };
        
        actionFunc(bgNode1);
        actionFunc(bgNode2);
        actionFunc(bgNode3);
    
    },

    addCloudSingle(bgNode, bgCloudSpRect, cloneSpf){
        var cloud = bgNode.addComponent(cc.Sprite);
        cloud.spriteFrame = cloneSpf.clone();
        var x = bgCloudSpRect[0];        
        var y = bgCloudSpRect[1];
        var width = bgCloudSpRect[2];
        var height = bgCloudSpRect[3];
        var tmpRect = new cc.Rect(x,y,width,height);
        // 设置 SpriteFrame 的纹理矩形区域
        cloud.spriteFrame.setRect(tmpRect);
        bgNode.width = width;
        bgNode.height = height;
        bgNode.scale = 0.8;
    },
});
