<template>
    <div class="links">
        <div class="line">
            <Icon size="20"><Link /></Icon>
            <span class="title">网站列表</span>
        </div>
        <Swiper :modules="[Pagination]" :slides-per-view="1" :space-between="40" :pagination="{ el: '.swiper-pagination', clickable: true, bulletElement: 'div', renderBullet: changeBullet }">
            <SwiperSlide v-for="slide in linksData">
                <el-row class="link-all" :gutter="20">
                    <el-col :span="8" v-for="(link, index) in slide.slice(0, 6)"  :style="index < 3 ? 'margin-bottom: 20px' : null" @click="jumpLink(link.url)">
                        <div class="item cards">
                            <Icon size="26"><component :is="collection[link.icon] ? collection[link.icon] : Link" /></Icon>
                            <span class="name">{{ link.name }}</span>
                        </div>
                    </el-col>
                </el-row>
            </SwiperSlide>
            <div v-show="slideSize > 1" class="pagination-wrapper">
                <div class="swiper-pagination"></div>
            </div>
        </Swiper>
    </div>
</template>

<script setup>
    import { h, ref, onMounted } from 'vue';
    import { getLocalData } from '@/api';
    import { Icon } from "@vicons/utils";
    import { Error } from "@icon-park/vue-next";
    import { Blog, Code, Search, CompactDisc, Cloud, Train, Book, Link } from "@vicons/fa";

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Pagination } from 'swiper';
    import 'swiper/scss'

    // 名称与组件集合
    const collection = {
        "Blog": Blog,
        "Book": Book,
        "Cloud": Cloud,
        "Code": Code,
        "CompactDisc": CompactDisc,
        "Search": Search,
        "Train": Train
    };

    // 网站链接数据
    let linksData = ref([]);

    // Slide 数量
    let slideSize = ref(1);

    const getWebsiteLinks = () => {
        getLocalData("/data/websiteLinks.json")
            .then((res) => {
                linksData.value = res;
                slideSize.value = res.length;

                console.log(linksData.value);
            })
            .catch((err) => {
                console.error(err);
                ElMessage({
                    message: "网站链接数据获取失败",
                    grouping: true,
                    icon: h(Error, {
                    theme: "filled",
                    fill: "#EFEFEF",
                    }),
                });
            });
    }

    // 链接跳转
    const jumpLink = (url) => {
        window.open(url, "_blank");
    };

    const changeBullet = (index, className) => {
        return "<div class="+ className +"><span></span></div>";
    }   

    onMounted(() => {
        getWebsiteLinks();
    });
</script>

<style lang="scss" scoped>
    .links {

        .line {
            display: flex;
            align-items: center;
            margin: 2rem 0.25rem 1rem;
            font-size: 1.1rem;
            animation: fade;
            -webkit-animation: fade 0.5s;

            .title {
                margin-left: 8px;
                font-size: 1.15rem;
                text-shadow: 0 0 5px #00000050;
            }
        }

        .swiper {
            left: -10px;
            width: calc(100% + 20px);
            padding: 5px 10px 0 !important;
            z-index: 0 !important;

            .pagination-wrapper {
                display: flex;
                justify-content: center;
                align-content: center;
                position: relative;
                margin-top: 0.25rem;
            
                .swiper-pagination {
                    padding: 0 7px;
                    border-radius: 12px;
                    font-size: 0;
                    transition: .25s;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

                    // &:hover {
                    //     background-color: rgba(0, 0, 0, 0.2509803922);
                    //     backdrop-filter: blur(10px) !important;
                    //     -webkit-backdrop-filter: blur(10px) !important;
                    // }
                }
            }

            .link-all {
                height: 220px;

                @media (max-width: 720px) {
                    height: 180px;
                }

                .item {
                    display: flex;
                    align-items: center;
                    flex-direction: row;
                    justify-content: center;
                    width: 100%;
                    height: 100px;
                    animation: fade;
                    -webkit-animation: fade 0.5s;

                    &:hover {
                        background: rgb(0 0 0 / 40%);
                        transform: scale(1.02);
                        transition: 0.3s;
                    }

                    .name {
                        margin-left: 8px;
                        font-size: 1.1rem;
                    }

                    @media (min-width: 720px) and (max-width: 820px) {
                        .name {
                            display: none;
                        }
                    }

                    @media (max-width: 720px) {
                        height: 80px;
                    }

                    @media (max-width: 460px) {
                        flex-direction: column;
                        
                        .name {
                            margin-top: 8px;
                            margin-left: 0;
                            font-size: 1rem;
                        }
                    }
                }
            }
        }
    }
</style>