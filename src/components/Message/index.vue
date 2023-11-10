<template>
    <!-- 基本信息 -->
    <div class="message">
        <!-- Logo -->
        <div class="logo">
            <img class="logo-image" :src="siteLogo" alt="logo" />
            <div class="name text-hidden">
                <span class="site-name">{{ siteName }}</span>
            </div>
        </div>
        <!-- 简介 -->
        <div class="description cards" @click="changeBox">
            <div class="content">
                <Icon size="16">
                    <QuoteLeft />
                </Icon>
                <div class="text">
                    <p>{{ descriptionText.hello }}</p>
                    <p>{{ descriptionText.text }}</p>
                </div>
                <Icon size="16">
                    <QuoteRight />
                </Icon>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { Icon } from "@vicons/utils";
    import { QuoteLeft, QuoteRight } from "@vicons/fa";
    import { Error } from "@icon-park/vue-next";
    import { mainStore } from "@/store";
    import { getDailySentence } from "@/api";
    import { getNowFormatDate } from "@/utils/tools.js";
    const store = mainStore();

    // 站点logo
    let siteLogo = import.meta.env.VITE_SITE_LOGO;
    // 站点名称
    let siteName = import.meta.env.VITE_SITE_NAME;

    // 简介区域文字
    let descriptionText = reactive({
        hello: import.meta.env.VITE_DESC_HELLO,
        text: import.meta.env.VITE_DESC_TEXT,
    });

    let dailySentence = reactive({
        content: import.meta.env.VITE_DESC_HELLO,
        note: import.meta.env.VITE_DESC_TEXT,
    });

    // 切换右侧功能区
    const changeBox = () => {
        if (store.getInnerWidth > 990) {
            store.boxOpenState = !store.boxOpenState;
        } else {
            ElMessage({
                message: "当前页面宽度不足以开启盒子",
                grouping: true,
                icon: h(Error, {
                    theme: "filled",
                    fill: "#EFEFEF",
                }),
            });
        }
    };

    // 获取每日一句
    const loadDailySentenceData = () => {
        getDailySentence(getNowFormatDate())
            .then((res) => {
                if (res.errno === 0) {
                    dailySentence.content = res.content;
                    dailySentence.note = res.note;

                    // 设置简介区域文字为每日一句
                    if (store.sentenceState) {
                        descriptionText.hello = dailySentence.content;
                        descriptionText.text = dailySentence.note;
                    }
                }
            })
            .catch(() => {
                ElMessage({
                    message: "每日一句获取失败",
                    icon: h(Error, {
                        theme: "filled",
                        fill: "#EFEFEF",
                    }),
                });
            });
    };

    // 设置简介区域文字
    const setDescriptionText = () => {
        if (store.boxOpenState) {
            descriptionText.hello = import.meta.env.VITE_DESC_HELLO_OTHER;
            descriptionText.text = import.meta.env.VITE_DESC_TEXT_OTHER;
        } else {
            if (store.sentenceState) {
                descriptionText.hello = dailySentence.content;
                descriptionText.text = dailySentence.note;
            } else {
                descriptionText.hello = import.meta.env.VITE_DESC_HELLO;
                descriptionText.text = import.meta.env.VITE_DESC_TEXT;
            }
        }
    };

    onMounted(() => {
        loadDailySentenceData();
    });

    // 监听状态变化
    watch(
        () => [store.boxOpenState, store.sentenceState],
        () => {
            setDescriptionText();
        }
    );
</script>

<style lang="scss" scoped>
    .message {

        .logo {
            display: flex;
            flex-direction: row;
            align-items: center;
            animation: fade 0.5s;
            max-width: 460px;

            @media (max-width: 720px) {
                max-width: 100%;
            }

            .logo-image {
                width: 120px;
                border-radius: 50%;

                @media (max-width: 768px) {
                    width: 100px;
                }
            }
            
            .name {
                width: 100%;
                padding-left: 20px;
                font-family: "Playball", cursive;

                .site-name {
                    font-size: 4rem;
                    letter-spacing: -1px;

                    @media (max-width: 1000px) {
                        font-size: 3rem;
                    }

                    @media (max-width: 850px) {
                        font-size: 2.5rem;
                    }

                    @media (max-width: 720px) {
                        font-size: 3.5rem;
                    }

                    @media (max-width: 450px) {
                        font-size: 3rem;
                    }

                    @media (max-width: 390px) {
                        font-size: 3.5rem;
                    }
                }
            }
        }

        .description {
            max-width: 460px;
            margin-top: 3.5rem;
            padding: 1rem;
            animation: fade 0.5s;

            .content {
                display: flex;
                justify-content: space-between;

                .text {
                    margin: 0.75rem 1rem;
                    margin-right: auto;
                    line-height: 2rem;

                    p {
                        &:nth-of-type(2) {
                            font-family: "Long Cang", cursive;
                        }
                    }
                }

                .xicon:nth-of-type(2) {
                    align-self: flex-end;
                }
            }

            @media (max-width: 720px) {
                max-width: 100%;
                pointer-events: none;
            }
        }

        @media (max-width: 390px) {
            .logo {
                flex-direction: column;

                .logo-image {
                    display: none;
                }

                .name {
                    padding-left: 0;
                    height: auto;
                    text-align: center;
                    transform: none;
                }
            }

            .description {
                margin-top: 2.5rem;
            }
        }
    }
</style>