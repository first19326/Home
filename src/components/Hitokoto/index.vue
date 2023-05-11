<template>
    <div class="hitokoto cards" v-show="!store.musicOpenState" @mouseenter="openMusicShow = true" @mouseleave="openMusicShow = false" @click.stop>
        <!-- 打开音乐面板 -->
        <Transition name="fade">
            <div class="open-music" v-show="openMusicShow && store.musicIsOk" @click="store.musicOpenState = true">
                <MusicMenu theme="filled" size="18" fill="#EFEFEF" />
                <span>打开音乐播放器</span>
            </div>
        </Transition>
        <!-- 一言内容 -->
        <div class="content" @click="updateHitokoto">
            <span class="text">{{ hitokotoData.text }}</span>
            <span class="from">-「&nbsp;{{ hitokotoData.from }}&nbsp;」</span>
        </div>
    </div>
</template>

<script setup>
    import { reactive, ref, onMounted, h } from "vue";
    import { MusicMenu, Error } from "@icon-park/vue-next";
    import { getHitokoto } from "@/api";
    import debounce from "@/utils/debounce.js";
    import { mainStore } from "@/store";
    const store = mainStore();

    // 开启音乐面板按钮显隐
    let openMusicShow = ref(false);

    // 一言数据
    let hitokotoData = reactive({
        text: "简单地活着，肆意而又精彩。",
        from: "WorstOne",
    });

    // 打开音乐面板
    const openMusic = () => {};

    // 获取一言数据
    const getHitokotoData = () => {
        getHitokoto()
            .then((res) => {
                hitokotoData.text = res.hitokoto;
                hitokotoData.from = res.from;
            })
            .catch(() => {
                ElMessage({
                    message: "一言获取失败",
                    icon: h(Error, {
                        theme: "filled",
                        fill: "#EFEFEF",
                    }),
                });
            });
    };

    // 更新一言数据
    const updateHitokoto = () => {
        hitokotoData.text = "新的一言正在赶来的路上";
        hitokotoData.from = "来源加载中";
        // 防抖
        debounce(() => {
            getHitokotoData();
        }, 500);
    };

    onMounted(() => {
        getHitokotoData();
    });
</script>

<style lang="scss" scoped>
    .hitokoto {
        width: 100%;
        height: 100%;
        padding: 20px;
        animation: fade;
        -webkit-animation: fade 0.5s;

        .open-music {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 4px 0;
            background: #00000026;
            border-radius: 8px 8px 0 0;

            .i-icon {
                display: block;
                width: 18px;
                height: 18px;
                margin-right: 8px;
            }

            span {
                font-size: 0.95rem;
            }
        }
        
        .content {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 100%;

            .text {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                font-size: 1.1rem;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .from {
                align-self: flex-end;
                margin-top: 10px;
                font-size: 1.1rem;
                font-weight: bold;
            }
        }
    }
</style>