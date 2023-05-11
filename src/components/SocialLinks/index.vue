<template>
    <!-- 社交链接 -->
    <div class="social">
        <div class="link">
            <a v-for="item in socialLinksData" :key="item.name" :href="item.url" target="_blank" @mouseenter="socialTip = item.tip" @mouseleave="socialTip = '通过这里联系我吧'">
                <img class="icon" :src="item.icon" height="24" />
            </a>
        </div>
        <span class="tip">{{ socialTip }}</span>
    </div>
</template>

<script setup>
    import { h, ref, onMounted } from "vue";
    import { getLocalData } from "@/api";
    import { Error } from "@icon-park/vue-next";

    // 社交链接数据
    let socialLinksData = ref([]);
    let socialTip = ref("通过这里联系我吧");

    // 获取社交链接数据
    const getSocialLinksData = () => {
        getLocalData("/data/socialLinks.json")
            .then((res) => {
                socialLinksData.value = res;
                console.log(socialLinksData.value);
            })
            .catch((err) => {
                console.error(err);
                ElMessage({
                    message: "社交链接获取失败",
                    grouping: true,
                    icon: h(Error, {
                        theme: "filled",
                        fill: "#EFEFEF",
                    }),
                });
            });
    };

    onMounted(() => {
        getSocialLinksData();
    });
</script>

<style lang="scss" scoped>
    .social {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;
        width: 100%;
        height: 42px;
        max-width: 460px;
        background-color: transparent;
        backdrop-filter: blur(0);
        -webkit-backdrop-filter: blur(0);
        border-radius: 6px;
        transition: all 0.5s;
        animation: fade;
        -webkit-animation: fade 0.5s;
        
        @media (max-width: 840px) {
            justify-content: center;
            max-width: 100%;

            .link {
                justify-content: space-evenly !important;
                width: 90%;
            }

            .tip {
                display: none !important;
            }
        }

        .link {
            display: flex;
            align-items: center;
            justify-content: center;

            a {
                display: inherit;

                .icon {
                    margin: 0 12px;
                    transition: all 0.3s;

                    &:active {
                        transform: scale(0.9);
                    }
                }
            }
        }

        .tip {
            display: none;
            margin-right: 12px;
            animation: fade;
            -webkit-animation: fade 0.5s;
        }

        @media (min-width: 768px) {
            &:hover {
                background-color: #00000040;
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);

                .tip {
                    display: block;
                }
            }
        }
    }
</style>