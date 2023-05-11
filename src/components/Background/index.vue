<template>
    <div class="cover">
        <img class="background" :src="backgroundUrl" />
        <div :class="store.backgroundShow ? 'gray sm' : 'gray'" />
        <Transition name="el-fade-in-linear">
            <a class="down" :href="backgroundUrl" target="_blank" download="" v-show="store.backgroundShow">下载壁纸</a>
        </Transition>
    </div>
</template>

<script setup>
    import { onMounted, ref, watch, h } from "vue";
    import { SuccessPicture, Error } from "@icon-park/vue-next";
    import { mainStore } from "@/store";
    import { randomNum } from "@/utils/tools.js";
    import { getLocalData } from "@/api";

    const store = mainStore();

    let backgroundUrl = ref(null);
    // 背景图片相关数据
    let backgroundData = null;

    const loadBackground = () => {
        // 获取背景图片相关数据
        getLocalData("/data/background.json")
            .then((res) => {
                backgroundData = res;
                console.log(backgroundData);

                changeBackground(store.coverType);
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

    const changeBackground = (type) => {
        let api = backgroundData.api[type];
        // 获取默认背景图片
        if (api.url.trim() == "") {
            let index = randomNum(0, api.images.length - 1);
            backgroundUrl.value = api.images[index];
            return ;
        }

        // 从 API 获取背景图片
        backgroundUrl.value = api.url;
    };

    onMounted(() => {
        // 加载背景图片
        loadBackground();
    });

    // 监听背景图片种类变化
    watch(
        () => store.coverType,
        (value) => {
            changeBackground(value);
            ElMessage({
                message: "背景图片设置成功",
                icon: h(SuccessPicture, {
                    theme: "filled",
                    fill: "#EFEFEF",
                }),
            });
        }
    );
</script>

<style lang="scss" scoped>
    .cover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;    
        transition: 0.25s;

        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transition: all 1.5s ease 0s;
            transform: scale(1);
            filter: blur(0);
        }

        .gray {
            opacity: 1;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%), radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
            transition: 1.5s;

            &.sm {
                opacity: 0;
                transition: 1.5s;
            }
        }
        .down {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            right: 0;
            left: 0;
            bottom: 30px;
            width: 120px;
            height: 30px;
            margin: 0 auto;
            padding: 20px 26px;
            border-radius: 8px;
            background-color: #00000030;
            color: white;
            font-size: 16px;

            &:hover {
                background-color: #00000060;
                transform: scale(1.05);
            }

            &:active {
                transform: scale(1);
            }
        }
    }

    // 加载时动画
    .loading {
        .cover {
            .background {
                transition: 1.5s;
                transform: scale(1.1);
                filter: blur(10px);
            }

            .gray {
                opacity: 0;
                transition: 1.5s;
            }
        }
    }
</style>