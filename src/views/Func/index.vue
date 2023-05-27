<template>
    <!-- 功能区域 -->
    <div class="function">
        <el-row :gutter="20">
            <Swiper :modules="[Pagination]" :slides-per-view="store.innerWidth > 910 ? 2 : 1" :enable="swiperSwitch" :noSwiping="true" :noSwipingClass="`el-slider`" :touchStartPreventDefault="false" :space-between="20" :pagination="{ el: '.swiper-pagination', bulletElement: 'div', renderBullet: changeBullet }">
                <SwiperSlide>
                    <el-col :span="24">
                        <div class="right cards">
                            <div class="time">
                                <div class="date">
                                    <span>{{ currentTime.year }}&nbsp;年&nbsp;</span>
                                    <span>{{ currentTime.month }}&nbsp;月&nbsp;</span>
                                    <span>{{ currentTime.day }}&nbsp;日&nbsp;</span>
                                    <span class="sm-hidden">{{ currentTime.weekday }}</span>
                                </div>
                                <div class="text">
                                    <span>{{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
                                </div>
                            </div>
                            <Weather />
                        </div>
                    </el-col>
                </SwiperSlide>
                <SwiperSlide>
                    <el-col :span="24">
                        <div class="left">
                            <Hitokoto />
                            <!-- 音乐控制面板 -->
                            <div class="music" @mouseenter="volumeShow = true" @mouseleave="volumeShow = false" v-show="store.musicOpenState">
                                <div class="btns">
                                    <span @click="musicListShow = true">音乐列表</span>
                                    <span @click="store.musicOpenState = false">回到一言</span>
                                </div>
                                <div class="control">
                                    <GoStart theme="filled" size="30" fill="#EFEFEF" @click="changeMusicIndex(0)" />
                                    <div class="state" @click="changePlayState">
                                        <PlayOne theme="filled" size="50" fill="#EFEFEF" v-show="!store.playerState" />
                                        <Pause theme="filled" size="50" fill="#EFEFEF" v-show="store.playerState" />
                                    </div>
                                    <GoEnd theme="filled" size="30" fill="#EFEFEF" @click="changeMusicIndex(1)" />
                                </div>
                                <div class="menu">
                                    <div class="name" v-show="!volumeShow">
                                        <span>{{ store.getPlayerData.name ? store.getPlayerData.name + " - " + store.getPlayerData.artist : "未播放音乐" }}</span>
                                    </div>
                                    <div class="volume" v-show="volumeShow">
                                        <div class="icon">
                                            <VolumeMute theme="filled" size="24" fill="#EFEFEF" v-if="volumeNum == 0" />
                                            <VolumeSmall theme="filled" size="24" fill="#EFEFEF" v-else-if="volumeNum > 0 && volumeNum < 0.7" />
                                            <VolumeNotice theme="filled" size="24" fill="#EFEFEF" v-else />
                                        </div>
                                        <el-slider v-model="volumeNum" :show-tooltip="false" :min="0" :max="1" :step="0.01" />
                                    </div>
                                </div>
                            </div>
                            <!-- END -->
                        </div>
                    </el-col>
                </SwiperSlide>
                <div v-show="swiperSwitch" class="pagination-wrapper">
                    <div class="swiper-pagination"></div>
                </div>
            </Swiper>
            <!-- 音乐列表弹窗 -->
            <Transition name="fade">
                <div class="music-list" v-show="musicListShow" @click="musicListShow = false">
                    <Transition name="zoom">
                        <div class="list" v-show="musicListShow" @click.stop>
                            <CloseOne class="close" theme="filled" size="28" fill="#FFFFFF60" @click="musicListShow = false" />
                            <Player :musicServer="playerData.server" :musicType="playerData.type" :musicId="playerData.id" :volume="volumeNum" :shuffle="true" ref="playerRef" />
                        </div>
                    </Transition>
                </div>
            </Transition>
            <!-- END -->
        </el-row>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
    import { GoStart, PlayOne, Pause, GoEnd, CloseOne, VolumeMute, VolumeSmall, VolumeNotice } from "@icon-park/vue-next";
    import { getCurrentTime } from "@/utils/getTime";

    import Hitokoto from "@/components/Hitokoto/index.vue";
    import Weather from "@/components/Weather/index.vue";
    import Player from "@/components/Player/index.vue";

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Pagination } from 'swiper';
    import 'swiper/scss'

    import { mainStore } from "@/store";
    const store = mainStore();

    let swiperSwitch = ref(false);

    // 当前时间
    let currentTime = ref({});
    let timeInterval = null;

    // 页面宽度
    const getWidth = () => {
        store.setInnerWidth(window.innerWidth);
    };

    const changeBullet = (index, className) => {
        return "<div class="+ className +"><span></span></div>";
    };

    onMounted(() => {
        timeInterval = setInterval(() => {
            currentTime.value = getCurrentTime();
        }, 1000);

        // 监听当前页面宽度
        getWidth();
        window.addEventListener("resize", getWidth);

        // 空格键事件
        window.addEventListener("keydown", (e) => {
            if (e.code == "Space") {
                changePlayState();
            }
        });
    });

    onBeforeUnmount(() => {
        clearInterval(timeInterval);
        window.removeEventListener("resize", getWidth);
    });

    // 监听宽度变化
    watch(
        () => store.innerWidth,
        (value) => {
            if (value > 910) {
                swiperSwitch = false;
            } else {
                swiperSwitch = true;
            }
        }
    );


    // 音量条数据
    let volumeShow = ref(false);
    let volumeNum = ref(store.musicVolume ? store.musicVolume : 0.7);

    // 播放列表数据
    let musicListShow = ref(false);
    const playerRef = ref(null);
    const playerData = reactive({
        server: import.meta.env.VITE_MUSIC_SERVER,
        type: import.meta.env.VITE_MUSIC_TYPE,
        id: import.meta.env.VITE_MUSIC_ID,
    });

    // 音乐播放暂停
    const changePlayState = () => {
        playerRef.value.playToggle();
    };

    // 音乐上下曲
    const changeMusicIndex = (type) => {
        playerRef.value.changeMusic(type);
    };

    // 监听音量变化
    watch(
        () => volumeNum.value,
        (value) => {
            store.musicVolume = value;
            playerRef.value.changeVolume(store.musicVolume);
        }
    );
</script>

<style lang="scss" scoped>
    .function {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 165px;
        margin-left: -10px;
        margin-right: -10px;

        .el-row {
            margin: 0 !important;
            width: 100%;
            height: 100%;

            .music-list {
                position: fixed;
                top: 0;
                left: 0;
                margin: auto;
                width: 100%;
                height: 100%;
                background-color: #00000080;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
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
                }
            }

            // 弹窗动画
            .fade-enter-active {
                animation: fade 0.3s ease-in-out;
                -webkit-animation: fade 0.3s ease-in-out;
            }

            .fade-leave-active {
                animation: fade 0.3s ease-in-out reverse;
                -webkit-animation: fade 0.3s ease-in-out reverse;
            }

            .zoom-enter-active {
                animation: zoom 0.4s ease-in-out;
                -webkit-animation: zoom 0.4s ease-in-out; 
            }

            .zoom-leave-active {
                animation: zoom 0.3s ease-in-out reverse;
                -webkit-animation: zoom 0.3s ease-in-out reverse;
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

            .swiper {
                left: 0;
                margin: -5px auto;
                padding: 5px 10px !important;
                z-index: 0 !important;

                .pagination-wrapper {
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    position: relative;
                    margin-top: -15px;
                    transform: translateZ(0);
                
                    .swiper-pagination {
                        padding: 0 7px;
                        border-radius: 12px;
                        font-size: 0;
                        transition: .25s;
                    }
                }

                .swiper-wrapper {

                    .music {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        padding: 20px;
                        width: 100%;
                        height: 100%;
                        background: #00000040;
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        border-radius: 6px;
                        animation: fade;
                        -webkit-animation: fade 0.5s;
                        
                        .btns {
                            display: flex;
                            align-items: center;
                            margin-bottom: 6px;

                            span {
                                margin: 0px 6px;
                                padding: 2px 8px;
                                background: #FFFFFF26;
                                border-radius: 6px;
                                overflow-x: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;

                                &:hover {
                                    background: #FFFFFF4D;
                                }
                            }
                        }

                        .control {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: space-evenly;
                            width: 100%;

                            .state {
                                .i-icon {
                                    display: block;
                                    width: 50px;
                                    height: 50px;
                                }
                            }

                            .i-icon {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 36px;
                                height: 36px;
                                border-radius: 6px;
                                transform: scale(1);

                                &:hover {
                                    background: #FFFFFF33;
                                }

                                &:active {
                                    transform: scale(0.95);
                                }
                            }
                        }

                        .menu {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 26px;
                            line-height: 26px;
                            
                            .name {
                                width: 100%;
                                text-align: center;
                                overflow-x: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                animation: fade;
                                -webkit-animation: fade 0.3s;
                            }

                            .volume {
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                padding: 0 12px;
                                width: 100%;
                                animation: fade;
                                -webkit-animation: fade 0.3s;

                                .icon {
                                    margin-right: 12px;
                                    
                                    span {
                                        display: block;
                                        width: 24px;
                                        height: 24px;
                                    }
                                }

                                :deep(*) {
                                    transition: none;
                                }

                                :deep(.el-slider__button) {
                                    transition: 0.3s;
                                }

                                .el-slider {
                                    --el-slider-main-bg-color: #EFEFEF;
                                    --el-slider-runway-bg-color: #FFFFFF40;
                                    --el-slider-button-size: 16px;
                                }
                            }
                        }
                    }
                }
            }

            .el-col {
                padding: 0 !important;
                width: 100%;
                height: 100%;

                @media (max-width: 910px) {
                    flex: none;
                    padding: 0 !important;
                    width: 100%;
                    max-width: none;
                }
            }

            .left, .right {
                width: 100%;
                height: 100%;
            }

            .right {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 20px;
                animation: fade;
                -webkit-animation: fade 0.5s;

                .time {
                    font-size: 1.1rem;
                    text-align: center;

                    .date {
                        overflow-x: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    .text {
                        margin-top: 10px;
                        font-size: 2.6rem;
                        letter-spacing: 2px;
                        // font-family: "UnidreamLED";
                    }
                }

                .weather {
                    width: 100%;
                    text-align: center;
                    overflow-x: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
</style>