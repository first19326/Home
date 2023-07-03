<template>
    <div class="animate">
        <Background />
        <main>
            <div class="container" v-show="!store.backgroundShow">
                <section class="main" v-show="!store.setOpenState">
                    <MainLeft />
                    <MainRight v-show="!store.boxOpenState" />
                    <Box v-show="store.boxOpenState" />
                </section>
                <section class="more" v-show="store.setOpenState" @click="store.setOpenState = false">
                    <MoreSet />
                </section>
            </div>
            <!-- 移动端菜单按钮 -->
            <Icon class="menu" size="24" @click="store.mobileOpenState = !store.mobileOpenState">
                <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
            </Icon>
        </main>
        <Footer v-show="!store.backgroundShow && !store.setOpenState" />
    </div>
</template>

<script setup>
    import { h, onMounted, onBeforeUnmount, watch } from "vue";
    import { helloInit, checkDays } from "@/utils/getTime.js";
    import { consoleText } from "@/utils/tools.js";
    import { mainStore } from "@/store";
    import { Icon } from "@vicons/utils";
    import { HamburgerButton, CloseSmall, Error } from "@icon-park/vue-next";
    import { getLocalData } from "@/api"
    import MainLeft from "@/views/Main/Left.vue";
    import MainRight from "@/views/Main/Right.vue";
    import Background from "@/components/Background/index.vue";
    import Footer from "@/components/Footer/index.vue";
    import Box from "@/views/Box/index.vue";
    import MoreSet from "@/views/MoreSet/index.vue";
    import cursorInit from "@/utils/cursor.js";


    const store = mainStore();

    const mourn = () => {
        // 获取默哀模式数据
        getLocalData("/data/mourn.json")
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
    }

    const consolePrint = () => {
        // 获取控制台内容
        getLocalData("/data/console.json")
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
    }

    // 页面宽度
    const getWidth = () => {
        store.setInnerWidth(window.innerWidth);
    };

    onMounted(() => {
        // 自定义鼠标
        cursorInit();
        // 加载完成事件
        window.addEventListener("load", () => {
            console.log("加载完成");
            // 去除加载标记
            document.getElementsByTagName("body")[0].className = "";
            // 给加载动画添加结束标记
            let loadingBox = document.getElementById("loading-box");
            loadingBox.classList.add("loaded");
            // 欢迎提示
            helloInit();
            // 默哀模式
            mourn();
        });

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
        window.addEventListener("mousedown", (event) => {
            if (event.button == 1) {
                store.backgroundShow = !store.backgroundShow;
                if (store.backgroundShow) {
                    ElMessage("已开启壁纸展示状态");
                } else {
                    ElMessage("已退出壁纸展示状态");
                }
            }
        });

        // 监听当前页面宽度
        getWidth();
        window.addEventListener("resize", getWidth);

        // 控制台内容输出
        consolePrint();
    });

    // 监听宽度变化
    watch(
        () => store.innerWidth,
        (value) => {
            if (value < 990) {
                store.boxOpenState = false;
            }
        }
    );

    onBeforeUnmount(() => {
        window.removeEventListener("resize", getWidth);
    });
</script>

<style lang="scss" scoped>
    main {
        .container {
            margin: 0 auto;
            width: 100%;
            height: 100vh;
            min-height: 600px;

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
                -webkit-backdrop-filter: blur(20px);
                z-index: 2;
                animation: fade;
                -webkit-animation: fade 0.5s;
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
            -webkit-backdrop-filter: blur(10px);
            border-radius: 6px;
            transition: all 0.3s;
            animation: fade;
            -webkit-animation: fade 0.5s;

            &:active {
                transform: scale(0.95);
            }

            .i-icon {
                transform: translateY(2px);
            }
            
            @media (min-width: 720px) {
                display: none;
            }
        }
    }

    // 加载动画层
    .animate {
        width: 100%;
        height: 100%;
        min-width: 350px;
        min-height: 600px;
        opacity: 1;
        transition: all ease 1.25s;
        transform: scale(1);
        filter: blur(0);

        &.resize {
            min-width: 990px;
            min-height: 750px;
        }
    }

    .loading {
        .animate {
            opacity: 0;
            transition: all ease 1.25s;
            transform: scale(1.2);
            filter: blur(10px);
        }
    }
</style>