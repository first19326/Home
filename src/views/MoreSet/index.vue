<template>
    <div class="set" @mouseenter="closeShow = true" @mouseleave="closeShow = false" @click.stop>
        <Transition name="el-fade-in-linear">
            <CloseOne class="close" theme="filled" size="28" fill="#FFFFFF60" v-show="closeShow" @click="closeMoreSet" />
        </Transition>
        <el-row :gutter="40">
            <el-col :span="12" class="left">
                <div class="logo text-hidden">
                    <span class="site-name">{{ siteName }}</span>
                </div>
                <div class="version">
                    <div class="num">Version&nbsp;{{ config.version }}</div>
                    <el-tooltip content="Github 源代码仓库" placement="right" :show-arrow="false">
                        <GithubOne class="github" theme="outline" size="24" @click="jumpTo(config.github)" />
                    </el-tooltip>
                </div>
                <el-card class="update">
                    <template #header>
                        <div class="card-header">
                            <span>更新日志</span>
                        </div>
                    </template>
                    <div class="update-note">
                        <div v-for="item in updateNote.new" :key="item" class="update-text">
                            <AddOne theme="outline" size="22" />{{ item }}
                        </div>
                        <div v-for="item in updateNote.fix" :key="item" class="update-text">
                            <Bug theme="outline" size="22" />{{ item }}
                        </div>
                    </div>
              </el-card>
            </el-col>
            <el-col :span="12" class="right">
                <div class="title">
                    <SettingTwo theme="filled" size="28" fill="#FFFFFF60" />
                    <span class="name">全局设置</span>
                </div>
                <Set />
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
    import { reactive, ref } from "vue";
    import { CloseOne, SettingTwo, GithubOne, AddOne, Bug } from "@icon-park/vue-next";
    import { mainStore } from "@/store";
    import Set from "@/components/Set/index.vue";
    import config from "@/../package.json";
    const store = mainStore();

    let closeShow = ref(false);

    // 站点链接
    let siteName = import.meta.env.VITE_SITE_NAME;

    // 更新日志
    let updateNote = reactive({
        new: [
            "采用 Vue 进行重构",
            "音乐歌单支持快速自定义",
            "壁纸支持个性化设置",
            "音乐播放器支持音量控制",
        ],
        fix: [
            "修复天气 API",
            "时光胶囊显示错误",
            "移动端动画及细节",
            "图标更换为 IconPark",
        ],
    });

    // 跳转源代码仓库
    const jumpTo = (url) => {
        window.open(url);
    };

    const closeMoreSet = () => {
        store.setOpenState = false;
        let animate = document.querySelector(".animate");
        animate.classList.remove("resize");
    }
</script>

<style lang="scss" scoped>
    .set {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 40px;
        width: 80%;
        height: 80%;
        background: rgb(255 255 255 / 40%);
        border-radius: 6px;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);

        .close {
            position: absolute;
            top: 14px;
            right: 14px;
            width: 28px;
            height: 28px;

            &:hover {
                transform: scale(1.2);
            }

            &:active {
                transform: scale(1);
            }
        }

        .el-row {
            flex-wrap: nowrap;
            height: 100%;

            .left {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                padding-bottom: 20px;
                padding-left: 40px !important;

                .logo {
                    width: 100%;
                    height: 260px;
                    // line-height: 5rem;
                    font-family: "Playball", cursive;

                    .site-name {
                        font-size: 4rem;
                    }
                }

                .version {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .num {
                        font-size: 2rem;
                    }

                    .github {
                        margin-top: 3px;
                        margin-left: 12px;
                        width: 24px;
                        height: 24px;

                        &:hover {
                            transform: scale(1.2);
                        }
                    }
                }

                .update {
                    margin-top: 30px;
                    height: 100%;

                    :deep(.el-card__body) {
                        height: 100%;

                        .update-note {
                            padding: 20px;
                            height: calc(100% - 56px);
                            overflow-y: auto;

                            .update-text {
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                padding-bottom: 16px;

                                &:nth-last-of-type(1) {
                                    padding: 0;
                                }

                                .i-icon {
                                    margin-right: 8px;
                                    width: 22px;
                                    height: 22px;
                                }
                            }
                        }
                    }
                }
            }

            .right {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-right: 40px !important;
                height: 100%;

                .title {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 16px;
                    font-size: 18px;

                    .i-icon {
                        margin-right: 6px;
                        width: 28px;
                        height: 28px;
                    }
                }
            }
        }
    }
</style>