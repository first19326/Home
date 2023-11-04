<template>
    <div class="setting">
        <el-collapse class="collapse" v-model="activeName" accordion>
            <el-collapse-item title="壁纸设置" name="1">
                <div class="background-set">
                    <el-radio-group v-model="backgroundSet" text-color="#FFFFFF">
                        <el-radio v-for="(item, index) in backgroundApi" :label="index.toString()" size="large" border>{{ item.name }}</el-radio>
                    </el-radio-group>
                </div>
            </el-collapse-item>
            <el-collapse-item title="音乐设置" name="2">
                <div class="item">
                    <span class="text">自动播放（刷新网页后生效）</span>
                    <el-switch v-model="playerAutoplay" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
                </div>
                <div class="item">
                    <span class="text">歌词显示</span>
                    <el-switch v-model="playerShowLrc" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
                </div>
                <div class="item">
                    <span class="text">暂停其他播放器（互斥）</span>
                    <el-switch v-model="playerMutex" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
                </div>
                <div class="item">
                    <span class="text">随机播放</span>
                    <el-switch v-model="playerShuffle" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
                </div>
                <div class="item radio">
                    <span class="text">循环播放模式</span>
                    <el-radio-group v-model="playerRepeat" size="small" text-color="#FFFFFF">
                        <el-radio label="music" border>单曲</el-radio>
                        <el-radio label="list" border>列表</el-radio>
                        <el-radio label="none" border>不循环</el-radio>
                    </el-radio-group>
                </div>
            </el-collapse-item>
            <el-collapse-item title="其他设置" name="3">
                <div class="item">
                    <span class="text">建站日期显示</span>
                    <el-switch v-model="siteStartShow" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
                </div>
            </el-collapse-item>
            <el-collapse-item title="其他设置" name="4">
                <div>设置内容待增加</div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup>
    import { CheckSmall, CloseSmall, SuccessPicture, Error } from "@icon-park/vue-next";
    import { mainStore } from "@/store";
    import { CheckSmall, CloseSmall, Error } from "@icon-park/vue-next";
    import { storeToRefs } from "pinia";
    import { getLocalData } from "@/api"

    const store = mainStore();
    const { siteStartShow, playerAutoplay, playerShowLrc, playerMutex, playerShuffle, playerRepeat } = storeToRefs(store);

    // 默认选中项
    let activeName = ref("1");
    let backgroundSet = ref("0");

    // 背景图片接口数据
    let backgroundApi = ref([]);

    // 获取背景图片接口数据
    const getBackgroundData = () => {
        getLocalData("/data/background.json")
            .then((res) => {
                backgroundApi.value = res.api;
                console.log(backgroundApi.value);
            })
            .catch((err) => {
                console.error(err);
                ElMessage({
                    message: "背景图片相关数据获取失败",
                    grouping: true,
                    icon: h(Error, {
                        theme: "filled",
                        fill: "#EFEFEF",
                    }),
                });
            });
    }

    onMounted(() => {
        getBackgroundData();
        backgroundSet.value = store.coverType.toString();
    });

    // 壁纸选中项
    watch(
        () => backgroundSet.value,
        (value) => {
            store.coverType = value;
        }
    );
</script>

<style lang="scss" scoped>
    .setting {
        .collapse {
            --el-collapse-content-bg-color: #FFFFFF10;
            border-radius: 8px;
            border-color: transparent;
            box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
            overflow: hidden;

            :deep(.el-collapse-item__header) {
                padding-left: 18px;
                background-color: #FFFFFF30;
                border-color: transparent;
                color: #FFF;
                font-size: 15px;
            }

            :deep(.el-collapse-item__wrap) {
                border-color: transparent;

                .el-collapse-item__content {
                    padding: 20px;

                    .el-radio-group {

                        .el-radio {
                            background: #FFFFFF26;
                            border: 2px solid transparent;

                            .el-radio__label {
                                color: #FFF;
                            }

                            .el-radio__inner {
                                background: #FFFFFF06 !important;
                                border: 2px solid #EEEEEE !important;
                            }
                            
                            &.is-checked {
                                background: #FFFFFF06 !important;
                                border: 2px solid #EEEEEE !important;
                            }

                            .is-checked {
                                .el-radio__inner {
                                    background-color: #FFFFFF30 !important;
                                    border-color: #FFF !important;
                                }

                                & + .el-radio__label {
                                    color: #FFF !important;
                                }
                            }
                        }
                    }

                    .item {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        font-size: 14px;

                        &.radio {
                            flex-wrap: wrap !important; 
                            min-height: 32px;
                        }

                        .el-switch__core {
                            background-color: #FFFFFF30;
                            border-color: transparent;
                        }

                        .el-radio-group {

                            .el-radio { 
                                margin: 2px 10px 2px 0;
                                border-radius: 5px;

                                &:last-child {
                                    margin-right: 0; 
                                }
                            }
                        }
                    }

                    .background-set {
                        .el-radio-group {
                            justify-content: space-between;

                            @media (max-width: 1380px) {
                                justify-content: center;
                            }

                            .el-radio {
                                margin: 10px 16px;
                                border-radius: 8px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>