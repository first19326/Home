import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
    state: () => {
        return {
            imageLoadState: false, // 背景图片加载状态
            innerWidth: null, // 当前窗口宽度
            coverType: "0", // 背景图片种类
            siteStartShow: true, // 建站日期显示
            musicIsOk: false, // 音乐是否加载完成
            musicIndex: 0, // 音乐切换状态 -1 上一首 0 当前 1 下一首
            musicVolume: 0, // 音乐音量;
            musicMuted: false, // 音乐静音状态
            musicOpenState: false, // 音乐面板开启状态
            musicListShow: false, // 音乐列表展开状态
            backgroundShow: false, // 背景图片展示状态
            boxOpenState: false, // 盒子开启状态
            mobileOpenState: false, // 移动端开启状态
            mobileFuncState: false, // 移动端功能区开启状态
            setOpenState: false, // 设置页面开启状态
            playerState: false, // 当前播放状态
            playerToggle: false, // 切换播放/暂停状态
            playerTitle: null, // 当前播放歌曲名
            playerArtist: null, // 当前播放歌手名
            playerLrc: "歌词加载中", // 当前播放歌词
            playerAutoplay: false, // 自动播放
            playerShowLrc: true, // 歌词显示状态
            playerMutex: true, // 暂停其他播放
            playerShuffle: false, // 随机播放
            playerRepeat: "list", // 循环播放模式
            footerBlur: false, // 底栏模糊
            sentenceState: true, // 每日一句开启状态
        }
    },
    getters: {
        // 获取歌词
        getPlayerLrc(state) {
            return state.playerLrc;
        },
        // 获取歌曲信息
        getPlayerData(state) {
            return {
                name: state.playerTitle,
                artist: state.playerArtist,
            }
        },
        // 获取页面宽度
        getInnerWidth(state) {
            return state.innerWidth;
        }
    },
    actions: {
        // 更改当前页面宽度
        setInnerWidth(value) {
            this.innerWidth = value;
            if (value > 720) {
                this.mobileOpenState = false;
                this.mobileFuncState = false;
            }
        },
        // 更改播放状态
        setPlayerState(value) {
            if (value) {
                this.playerState = false;
            } else {
                this.playerState = true;
            }

        },
        // 更改歌词
        setPlayerLrc(value) {
            this.playerLrc = value;
        },
        // 更改歌曲数据
        setPlayerData(title, artist) {
            this.playerTitle = title;
            this.playerArtist = artist;
        },
        // 更改壁纸加载状态
        setImageLoadState(value) {
            this.imageLoadState = value;
        }
    },
    persist: {
        key: 'data',
        storage: window.localStorage,
        paths: ['coverType', 'musicVolume', 'siteStartShow', 'playerAutoplay', 'playerShowLrc', 'playerMutex', 'playerShuffle', 'playerRepeat', 'footerBlur', 'sentenceState'],
    },
})