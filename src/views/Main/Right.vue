<template>
    <div :class="store.mobileOpenState ? 'right' : 'right hidden'">
        <!-- 移动端 Logo -->
        <div class="logo text-hidden">
            <span class="site-name">{{ siteName }}</span>
        </div>
        <!-- 功能区 -->
        <Func />
        <!-- 网站列表 -->
        <List />
    </div>
</template>

<script setup>
    import Func from "@/views/Func/index.vue";
    import List from "@/components/Lists/index.vue";
    import { mainStore } from "@/store";
    const store = mainStore();

    // 站点名称
    let siteName = import.meta.env.VITE_SITE_NAME;
</script>


<style lang="scss" scoped>
    .right {
        // flex: 1 0 0%;
        margin-left: 0.75rem;
        width: 50%;

        @media (max-width: 720px) {
            margin-left: 0;
            width: 100%;
            transform: translateY(-2.5rem);

            &.hidden {
                display: none;
            }
        }

        .logo {
            display: none;
            width: 100%;
            margin-bottom: 2.5rem;
            font-size: 2rem;
            font-family: "Playball", cursive;
            text-align: center;
            transition: transform 0.3s;
            animation: fade 0.5s;

            &:active {
                transform: scale(0.95);
            }

            @media (max-width: 720px) {
                display: block;
            }
        }
    }
</style>