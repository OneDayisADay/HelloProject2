// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
    extends: cc.Component,

    properties: {

        click: {
            default: null,
            type: cc.AudioClip
        },

        playgame: {
            default: null,
            type: cc.AudioClip
        },

        walk:{
            default: null,
            type: cc.AudioClip
        },

        wonderful:{
            default: null,
            type: cc.AudioClip
        },

        stickdone: {
            default: null,
            type: cc.AudioClip
        },
        stick:{
            default: null,
            type: cc.AudioClip
        },
        win:{
            default: null,
            type: cc.AudioClip
        },
        over:{
            default: null,
            type: cc.AudioClip
        },
        bgm:{
            default: null,
            type: cc.AudioClip
        }
    },

    onLoad() {
        var soundVolume = cc.sys.localStorage.getItem("effectVolume");
        if(!soundVolume)
        {
            cc.sys.localStorage.setItem("effectVolume", 0.5);
            soundVolume = 0.5;
        }

        cc.audioEngine.setEffectsVolume(soundVolume);
        cc.audioEngine.setMusicVolume(0.5);
    },

    playBGM () {
        if(!cc.audioEngine.isMusicPlaying()) cc.audioEngine.playMusic(this.bgm, true);
    },

    stopBGM(){
        if(cc.audioEngine.isMusicPlaying()) cc.audioEngine.stopMusic(this.bgm, true);
    },

    soundPlayGame() {
        cc.audioEngine.playEffect(this.playgame, false);
    },

    soundWalk() {
        cc.audioEngine.playEffect(this.walk, false);
    },

    soundStick() {
        cc.audioEngine.playEffect(this.stick, false);
    },

    soundStickDown() {
        cc.audioEngine.playEffect(this.stickdone, false);
    },

    soundClick() {
        cc.audioEngine.playEffect(this.click, false);
    },

    soundOver() {
        cc.audioEngine.playEffect(this.over, false);
    },

    soundWin() {
        cc.audioEngine.playEffect(this.win, false);
    },

    soundWonderful() {
        cc.audioEngine.playEffect(this.wonderful, false);
    },
});