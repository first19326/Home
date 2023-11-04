<template>
    <div :class="store.backgroundShow ? 'cover show' : 'cover'">
        <img class="background" alt="cover" :src="backgroundUrl" v-show="store.imageLoadState" @load="imageLoadComplete" @error.once="imageLoadError" @animationend="imageAnimationEnd" />
        <div :class="store.backgroundShow ? 'gray hidden' : 'gray'" />
        <Transition name="fade" mode="out-in">
            <a class="down" :href="backgroundUrl" target="_blank" download="" v-show="store.backgroundShow">下载图片</a>
        </Transition>
    </div>
</template>

<script setup>
    import { Error } from "@icon-park/vue-next";
    import { mainStore } from "@/store";
    import { randomNum } from "@/utils/tools.js";
    import { loadData } from "@/api";

    const store = mainStore();
    const emits = defineEmits(["loadComplete"]);

    let backgroundUrl = ref(null);
    // 背景图片相关数据
    let backgroundData = "";

    let loadTimeout = null;

    const loadBackground = () => {
        // 获取背景图片相关数据
        loadData(import.meta.env.VITE_BACKGROUND_URL)
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
    };

    const changeBackground = (type) => {
        let api = backgroundData[type];
        // 获取默认背景图片
        if (!api.url.trim()) {
            let index = randomNum(0, api.images.length - 1);
            backgroundUrl.value = api.images[index];
            return ;
        }

        // 从 API 获取背景图片
        backgroundUrl.value = api.url;
    };

    // 背景图片加载完成
    const imageLoadComplete = () => {
        loadTimeout = setTimeout(() => {
            store.setImageLoadState(true);
        }, Math.floor(Math.random() * (600 - 300 + 1)) + 300);
    };

    // 背景图片动画结束
    const imageAnimationEnd = () => {
        console.log("背景图片加载完成");
        emits("loadComplete");
    };

    // 背景图片加载失败
    const imageLoadError = () => {
        console.error("背景图片加载失败:", backgroundData[store.coverType].name);
        
        // 切换默认背景图片
        let index = 0;
        for (let api of backgroundData) {
            if (!api.url.trim()) {
                changeBackground(index);

                ElMessage({
                    message: "背景图片加载失败，已临时切换回默认",
                    icon: h(Error, {
                        theme: "filled",
                        fill: "#EFEFEF",
                    }),
                });
                return;
            }
            index++;
        }
    };

    onMounted(() => {
        // 加载背景图片
        loadBackground();
    });

    onBeforeUnmount(() => {
        clearTimeout(loadTimeout);
    });
</script>

<style lang="scss" scoped>
    .cover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        min-width: 360px;
        min-height: 640px;
        z-index: -1;    
        transition: 0.25s;

        &.show {
            z-index: 1;
        }

        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            backface-visibility: hidden;
            filter: blur(20px) brightness(0.3);
            transition:
                filter 0.3s,
                transform 0.3s;
            animation: fade-blur-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            animation-delay: 0.45s;
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

            &.hidden {
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
</style>