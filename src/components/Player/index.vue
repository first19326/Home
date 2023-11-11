<template>
    <!-- 音乐控制面板 -->
    <div class="music cards" @mouseenter="volumeShow = true" @mouseleave="volumeShow = false" v-show="store.musicOpenState">
        <div class="btns">
            <span @click="store.musicListShow = true">音乐列表</span>
            <span @click="store.musicOpenState = false">回到一言</span>
        </div>
        <div class="control">
            <GoStart theme="filled" size="30" fill="#EFEFEF" @click="store.musicIndex = -1" />
            <div class="state" @click="store.playerToggle = !store.playerToggle">
                <PlayOne theme="filled" size="50" fill="#EFEFEF" v-show="!store.playerState" />
                <Pause theme="filled" size="50" fill="#EFEFEF" v-show="store.playerState" />
            </div>
            <GoEnd theme="filled" size="30" fill="#EFEFEF" @click="store.musicIndex = 1" />
        </div>
        <div class="menu">
            <div class="name" v-show="!volumeShow">
                <span>{{ store.getPlayerData.name ? store.getPlayerData.name + " - " + store.getPlayerData.artist : "未播放音乐" }}</span>
            </div>
            <div class="volume" v-show="volumeShow">
                <div class="icon" @click="store.musicMuted = !store.musicMuted">
                    <VolumeMute theme="filled" size="24" fill="#EFEFEF" v-show="store.musicMuted || volumeNum == 0"  />
                    <VolumeSmall theme="filled" size="24" fill="#EFEFEF" v-show="!store.musicMuted && volumeNum > 0 && volumeNum < 0.7"  />
                    <VolumeNotice theme="filled" size="24" fill="#EFEFEF" v-show="!store.musicMuted && volumeNum >= 0.7" />
                </div>
                <el-slider v-model="volumeNum" :show-tooltip="false" :min="0" :max="1" :step="0.01" />
            </div>
        </div>
    </div>
    <!-- END -->
</template>
<script setup>
    import { GoStart, PlayOne, Pause, GoEnd, VolumeMute, VolumeSmall, VolumeNotice } from "@icon-park/vue-next";

    import { mainStore } from "@/store";
    const store = mainStore();

    // 音量条数据
    let volumeShow = ref(false);
    let volumeNum = ref(store.musicVolume ? store.musicVolume : 0.7);

    // 键盘事件
    const keydownEvent = (e) => {
        // 空格键事件
        if (e.code == "Space") {
            store.playerToggle = !store.playerToggle;
        }

        // CTRL + <—— 事件
        if (e.ctrlKey && e.code == "ArrowLeft") {
            store.musicIndex = -1;
        }

        // CTRL + ——> 事件
        if (e.ctrlKey && e.code == "ArrowRight") {
            store.musicIndex = 1;
        }
    };

    onMounted(() => {
        window.addEventListener("keydown", keydownEvent);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("keydown", keydownEvent);
    });

    // 监听音量变化
    watch(
        () => volumeNum.value,
        (value) => {
            store.musicVolume = value;
            if (value > 0) {
                store.musicMuted = false;
            }
        }, {
            immediate: true
        }
    );
</script>
<style lang="scss" scoped>
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
        border-radius: 6px;
        animation: fade 0.5s;
        
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
                animation: fade 0.3s;
            }

            .volume {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0 12px;
                width: 100%;
                animation: fade 0.3s;

                .icon {
                    margin-right: 12px;
                    transform: scale(1);

                    &:active {
                        transform: scale(0.95);
                    }
                    
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
</style>