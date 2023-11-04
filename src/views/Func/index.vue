<template>
    <!-- 功能区域 -->
    <div class="function">
        <el-row :gutter="20">
            <Swiper :modules="[Pagination]" :slides-per-view="store.innerWidth > 910 ? 2 : 1" :noSwiping="true" :noSwipingClass="`el-slider`" :touchStartPreventDefault="false" :edgeSwipeDetection="true" :space-between="20" :pagination="{ el: '.swiper-pagination', bulletElement: 'div', renderBullet: changeBullet }">
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
                            <Player />
                        </div>
                    </el-col>
                </SwiperSlide>
                <div class="pagination-wrapper" v-show="store.innerWidth <= 910">
                    <div class="swiper-pagination"></div>
                </div>
            </Swiper>
        </el-row>
    </div>
</template>

<script setup>
    import Hitokoto from "@/components/Hitokoto/index.vue";
    import Weather from "@/components/Weather/index.vue";
    import Player from "@/components/Player/index.vue";

    import { getCurrentTime } from "@/utils/getTime";

    import { Swiper, SwiperSlide } from "swiper/vue";
    import { Pagination } from "swiper";
    import "swiper/scss"

    import { mainStore } from "@/store";
    const store = mainStore();

    // 当前时间
    let currentTime = ref({});
    let timeInterval = null;

    // 更新时间
    const updateTimeData = () => {
        currentTime.value = getCurrentTime();
    };

    const changeBullet = (index, className) => {
        return "<div class="+ className +"><span></span></div>";
    };

    onMounted(() => {
        updateTimeData();
        timeInterval = setInterval(updateTimeData, 1000);
    });

    onBeforeUnmount(() => {
        clearInterval(timeInterval);
    });
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

            .swiper {
                left: 0;
                margin: -5px auto;
                padding: 5px 10px !important;
                width: 100%;
                z-index: 0 !important;

                :deep(.swiper-slide) {
                    width: calc((100% - 20px) / 2) !important;

                    @media (max-width: 910px) {
                        width: 100% !important;
                    }
                }

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

                        :deep(.swiper-pagination-bullet) {
                            display: inline-block;
                            padding: 3px 3px;

                            span {
                                display: block;
                                width: 4px;
                                height: 4px;
                                background-color: rgba(0, 0, 0, 0.2509803922);
                                border-radius: 2px;
                                transition: .25s;
                            }

                            &:hover span {
                                background-color: rgba(255, 255, 255, 0.2509803922);
                            }

                            &:active span, &.swiper-pagination-bullet-active span {
                                background-color: rgba(255, 255, 255, 1);
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
                animation: fade 0.5s;

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