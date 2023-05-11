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
            <el-collapse-item title="其他设置" name="2">
                <div class="item">
                    <span class="text">建站日期显示</span>
                    <el-switch v-model="siteStartShow" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
                </div>
            </el-collapse-item>
            <el-collapse-item title="其他设置" name="3">
                <div>设置内容待增加</div>
            </el-collapse-item>
            <el-collapse-item title="其他设置" name="4">
                <div>设置内容待增加</div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup>
    import { h, ref, onMounted, watch } from "vue";
    import { mainStore } from "@/store";
    import { CheckSmall, CloseSmall, Error } from "@icon-park/vue-next";
    import { storeToRefs } from "pinia";
    import { getLocalData } from "@/api"

    const store = mainStore();
    const { siteStartShow } = storeToRefs(store);

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

                    .item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-size: 14px;

                        .el-switch__core {
                            background-color: #FFFFFF30;
                            border-color: transparent;
                        }
                    }

                    .background-set {
                        .el-radio-group {
                            justify-content: space-between;

                            .el-radio {
                                margin: 10px 16px;
                                background: #FFFFFF26;
                                border: 2px solid transparent;
                                border-radius: 8px;

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
                    }
                }
            }
        }
    }
</style>