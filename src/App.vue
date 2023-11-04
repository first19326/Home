<template>
    <!-- 加载 -->
    <Loading />
    <!-- 背景 -->
    <Background @loadComplete="loadComplete" />
    <!-- 主界面 -->
    <Transition name="fade" mode="out-in">
        <main id="main" v-if="store.imageLoadState">
            <div class="container" v-show="!store.backgroundShow">
                <section class="main" v-show="!store.setOpenState">
                    <Left />
                    <Right v-show="!store.boxOpenState" />
                    <Box v-show="store.boxOpenState" />
                    <Music v-show="store.musicListShow" />
                </section>
                <section class="more" v-show="store.setOpenState" @click="store.setOpenState = false">
                    <MoreSet />
                </section>
            </div>
            <!-- 移动端菜单按钮 -->
            <Icon class="menu" size="24" v-show="!store.backgroundShow" @click="store.mobileOpenState = !store.mobileOpenState">
                <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
            </Icon>
            <!-- 页脚 -->
            <Transition name="fade" mode="out-in">
                <Footer v-show="!store.backgroundShow && !store.setOpenState" />
            </Transition>
        </main>
    </Transition>
</template>

<script setup>
    import { helloInit, checkDays } from "@/utils/getTime.js";
    import { consoleText } from "@/utils/tools.js";
    import { mainStore } from "@/store";
    import { Icon } from "@vicons/utils";
    import { HamburgerButton, CloseSmall, Error } from "@icon-park/vue-next";
    import { loadData } from "@/api"
    import Loading from "@/components/Loading/index.vue";
    import Left from "@/views/Main/Left.vue";
    import Right from "@/views/Main/Right.vue";
    import Background from "@/components/Background/index.vue";
    import Footer from "@/components/Footer/index.vue";
    import Box from "@/views/Box/index.vue";
    import Music from "@/views/Music/index.vue";
    import MoreSet from "@/views/MoreSet/index.vue";
    import cursorInit from "@/utils/cursor.js";

    const store = mainStore();

    const mourn = () => {
        // 获取默哀模式数据
        loadData(import.meta.env.VITE_MOURN_URL)
            .then((res) => {
                console.log(res);

                // 默哀模式
                checkDays(res);
            })
            .catch((err) => {
                console.error(err);
                ElMessage({
                    message: "默哀模式数据获取失败",
                    grouping: true,
                    icon: h(Error, {
                        theme: "filled",
                        fill: "#EFEFEF",
                    }),
                });
            });
    };

    // 加载完成事件
    const loadComplete = () => {
        nextTick(() => {
            // 欢迎提示
            helloInit();
            // 默哀模式
            mourn();
        });
    };

    const consolePrint = () => {
        // 获取控制台内容
        loadData(import.meta.env.VITE_CONSOLE_URL)
            .then((res) => {
                console.log(res);

                // 控制台输出
                consoleText(res, "banner");
            })
            .catch((err) => {
                console.error(err);
                ElMessage({
                    message: "控制台内容获取失败",
                    grouping: true,
                    icon: h(Error, {
                        theme: "filled",
                        fill: "#EFEFEF",
                    }),
                });
            });
    };

    // 调整页面宽度
    const resizeWidth = () => {
        store.setInnerWidth(window.innerWidth);
    };

    const mousedownEvent = (event) => {
        if (event.button == 1) {
            store.backgroundShow = !store.backgroundShow;
            if (store.backgroundShow) {
                ElMessage("已开启背景图片展示状态");
            } else {
                ElMessage("已退出背景图片展示状态");
            }
        }
    };

    onMounted(() => {
        // 自定义鼠标
        cursorInit();

        // 屏蔽右键
        document.oncontextmenu = () => {
            ElMessage({
                message: "为了浏览体验，本站禁用右键",
                grouping: true,
                duration: 2000,
            });
            return false;
        };

        // 鼠标中键事件
        window.addEventListener("mousedown", mousedownEvent);

        // 监听当前页面宽度
        resizeWidth();
        window.addEventListener("resize", resizeWidth);

        // 控制台内容输出
        consolePrint();
    });

    // 监听宽度变化
    watch(
        () => store.innerWidth,
        (innerWidth) => {
            if (innerWidth <= 990) {
                store.boxOpenState = false;
            }
        }
    );

    onBeforeUnmount(() => {
        window.removeEventListener("mousedown", mousedownEvent);
        window.removeEventListener("resize", resizeWidth);
    });
</script>

<style lang="scss" scoped>
    #main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        min-width: 360px;
        min-height: 640px;
        transform: scale(1.2);
        transition: transform 0.3s;
        animation: fade-blur-main-in 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 0.5s;
        
        .container {
            margin: 0 auto;
            width: 100%;
            height: 100vh;

            @media (max-width: 1200px) {
                padding: 0 2vw;
            }

            .main {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 0 0.75rem;
                width: 100%;
                height: 100%;
            }

            .more {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #00000080;
                backdrop-filter: blur(20px);
                z-index: 2;
                animation: fade 0.5s;
            }
        }
        
        .menu {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 85%;
            left: calc(50% - 28px);
            width: 56px;
            height: 34px;
            background: rgb(0 0 0 / 20%);
            backdrop-filter: blur(10px);
            border-radius: 6px;
            transition: transform 0.3s;
            animation: fade 0.5s;

            &:active {
                transform: scale(0.95);
            }

            @media(min-width: 721px) {
                display: none;
            }

            .i-icon {
                transform: translateY(2px);
            }
        }
    }
</style>