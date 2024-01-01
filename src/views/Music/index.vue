<template>
    <!-- 音乐列表弹窗 -->
    <Transition name="fade" mode="out-in">
        <div class="music-list" v-show="store.musicListShow" @click="store.musicListShow = false">
            <Transition name="zoom">
                <div class="list" v-show="store.musicListShow" @click.stop>
                    <CloseOne class="close" theme="filled" size="28" fill="#FFFFFF60" @click="store.musicListShow = false" />
                    <APlayer :autoplay="store.playerAutoplay" theme="#EFEFEF" :autoSwitch="false" :loop="store.playerLoop" :order="store.playerOrder" :showLrc="true" :listFolded="false" :listMaxHeight="420" :noticeSwitch="false" @play="onPlay" @pause="onPause" @timeupdate="onTimeUp" @error="loadMusicError" ref="aplayer" />
                </div>
            </Transition>
        </div>
    </Transition>
    <!-- END -->
</template>
<script setup>
    import APlayer from "@worstone/vue-aplayer";
    import { CloseOne, MusicOne, PlayWrong, Error } from "@icon-park/vue-next";
    import { getPlayerList, loadData } from "@/api";
    import { mainStore } from "@/store";

    const store = mainStore();

    // 获取播放器 DOM
    const aplayer = ref(null);

    onMounted(() => {
        loadMusicData();
    });

    // 获取音乐数据
    const loadMusicData = () => {
        loadData(import.meta.env.VITE_MUSIC_URL)
            .then((res) => {
                console.log(res);
                initMusic(res);
            })
            .catch((err) => {
                console.error(err);
                ElMessage({
                    message: "音乐相关数据获取失败",
                    grouping: true,
                    icon: h(Error, {
                        theme: "filled",
                        fill: "#EFEFEF",
                    }),
                });
            });
    };

    // 初始化播放器
    const initMusic = (music) => {
        nextTick(() => {
            getPlayerList(music.api || 'https://api.i-meto.com/meting/api/', music.server || 'netease', music.type || 'playlist', music.id || '3778678')
                .then((res) => {
                    console.log(res);
                    // 更改播放器加载状态
                    store.musicIsOk = true;
                    // 生成歌单
                    aplayer.value.addList(res);
                    console.log("音乐加载完成");
                })
                .catch((err) => {
                    console.error(err);
                    store.musicIsOk = false;
                    ElMessage({
                        message: "播放器加载失败",
                        grouping: true,
                        icon: h(PlayWrong, {
                            theme: "filled",
                            fill: "#EFEFEF",
                        }),
                    });
                });
        });
    };

    // 播放暂停事件
    const onPlay = () => {
        console.log("播放");
        // 播放状态
        store.setPlayerState(aplayer.value.audioRef.paused);
        // 储存播放器信息
        store.setPlayerData(
            aplayer.value.aplayer.audio[aplayer.value.aplayer.index].name,
            aplayer.value.aplayer.audio[aplayer.value.aplayer.index].artist
        );
        ElMessage({
            message: store.getPlayerData.name + " - " + store.getPlayerData.artist,
            grouping: true,
            icon: h(MusicOne, {
                theme: "filled",
                fill: "#EFEFEF",
            }),
        });
    };

    const onPause = () => {
        store.setPlayerState(aplayer.value.audioRef.paused);
    };

    // 音频时间更新事件
    const onTimeUp = () => {
        if (!store.playerShowLrc) {
            return ;
        }
        if (!aplayer.value.aplayer.lyrics[aplayer.value.aplayer.index]) {
            return ;
        }
        if (!aplayer.value.aplayer.lyrics[aplayer.value.aplayer.index][aplayer.value.aplayer.lyricIndex]) {
            return ;
        }
        let lrc = aplayer.value.aplayer.lyrics[aplayer.value.aplayer.index][aplayer.value.aplayer.lyricIndex][1];
        if (lrc === "Loading") {
            lrc = "歌词加载中"
        } else if (lrc === "Not available") {
            lrc = "歌词加载失败";
        }
        store.setPlayerLrc(lrc);
    };

    // 切换播放暂停事件
    const playToggle = () => {
        if (aplayer.value.aplayer.audio.length > 0) {
            aplayer.value.toggle();
        } else {
            ElMessage({
                message: "播放列表为空",
                grouping: true,
                icon: h(PlayWrong, {
                    theme: "filled",
                    fill: "#EFEFEF",
                    duration: 2000,
                }),
            });
        }
    };

    // 切换音量事件
    const changeVolume = (value) => {
        aplayer.value.setVolume(value, false);
    };

    // 切换静音状态
    const onMuted = () => {
        aplayer.value.mute();
    };

    // 切换上下曲
    const changeMusic = (type) => {
        if (type === 0) return ; 
        type === -1 ? aplayer.value.skipBack() : aplayer.value.skipForward();
        aplayer.value.play();
    };

    // 加载音乐错误
    const loadMusicError = () => {
        let notice = "播放音频出现错误";
        if (aplayer.value.aplayer.audio.length > 1) {
            notice += "，播放器将在 2s 后进行跳转";
        }
        ElMessage({
            message: notice,
            grouping: true,
            icon: h(PlayWrong, {
                theme: "filled",
                fill: "#EFEFEF",
                duration: 2000,
            }),
        });
        console.error("播放音频: " + aplayer.value.aplayer.audio[aplayer.value.aplayer.index].name + " 出现错误");
    };

    // 监听音乐播放器状态
    watch(
        () => store.playerToggle,
        () => {
            playToggle();
        }
    );
    watch(
        () => store.musicListShow,
        () => {
            aplayer.value.toggleList();
        }
    );
    watch(
        () => store.musicVolume,
        (musicVolume) => {
            changeVolume(musicVolume);
        }
    );
    watch(
        () => store.musicMuted,
        () => {
            onMuted();
        }
    );
    watch(() => store.musicIndex,
        (musicIndex) => {
            changeMusic(musicIndex);
            store.musicIndex = 0;
        }
    );
</script>
<style lang="scss" scoped>
    .music-list {
        position: fixed;
        top: 0;
        left: 0;
        margin: auto;
        width: 100%;
        height: 100%;
        background-color: #00000080;
        backdrop-filter: blur(20px);
        z-index: 1;

        .list {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: calc(50% - 300px);
            left: calc(50% - 320px);
            width: 640px;
            height: 600px;
            background-color: #FFFFFF66;
            border-radius: 6px;
            z-index: 999;

            @media (max-width: 720px) {
                left: calc(50% - 45%);
                width: 90%;
            }

            .close {
                display: block;
                position: absolute;
                top: 12px;
                right: 12px;
                width: 28px;
                height: 28px;

                &:hover {
                    transform: scale(1.2);
                }

                &:active {
                    transform: scale(0.95);
                }
            }

            .aplayer {
                width: 80%;
                border-radius: 6px;

                :deep(.aplayer-body) {
                    background-color: transparent;

                    .aplayer-pic {
                        display: none;
                    }

                    .aplayer-info {
                        margin-left: 0;
                        background-color: #FFFFFF40;
                        border-color: transparent !important;

                        .aplayer-music {
                            flex-grow: initial;
                            margin-bottom: 2px;
                            overflow: hidden;

                            .aplayer-title {
                                margin-right: 6px;
                                font-size: 16px;
                            }

                            .aplayer-author {
                                color: #EFEFEF;
                            }
                        }

                        .aplayer-lrc {
                            margin: 7px 0 6px 6px;
                            height: 44px;
                            text-align: left;
                            mask: linear-gradient(#FFF 15%, #FFF 85%, hsla(0deg, 0%, 100%, 0.6) 90%, hsla(0deg, 0%, 100%, 0));

                            &::before, &::after {
                                display: none;
                            }

                            p {
                                color: #EFEFEF;
                            }

                            .aplayer-lrc-current {
                                margin-bottom: 4px !important;
                                font-size: 0.95rem;
                            }
                        }

                        .aplayer-controller {
                            display: none;
                        }
                    }
                }

                :deep(.aplayer-list) {
                    margin-top: 6px;
                    height: 420px;
                    background-color: transparent;

                    ol {
                        height: 420px;

                        &::-webkit-scrollbar-track {
                            background-color: transparent;
                        }

                        li {
                            border-color: transparent;

                            &.aplayer-list-light {
                                background: #FFFFFF40;
                                border-radius: 6px;
                            }

                            &:hover {
                                background: #FFFFFF26 !important;
                                border-radius: 6px !important;
                            }

                            .aplayer-list-index, .aplayer-list-author {
                                color: #EFEFEF;
                            }
                        }
                    }
                }
            }
        }
    }

    // 弹窗动画
    .zoom-enter-active {
        animation: zoom 0.4s ease-in-out;
    }

    .zoom-leave-active {
        animation: zoom 0.3s ease-in-out reverse;
    }

    @keyframes zoom {
        0% {
            opacity: 0;
            transform: scale(0) translateY(-600px);
        }

        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
</style>