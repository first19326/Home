<template>
    <div :class="store.mobileOpenState ? 'right' : 'right hidden'">
        <!-- 移动端 Logo -->
        <div class="logo text-hidden" >
            <span class="site-name">{{ siteName }}</span>
        </div>
        <!-- 功能区 -->
        <Func />
        <!-- 网站链接 -->
        <Link />
    </div>
</template>

<script setup>
    import Func from "@/views/Func/index.vue";
    import Link from "@/components/Links/index.vue";
    import { mainStore } from "@/store";
    const store = mainStore();

    // 站点名称
    let siteName = import.meta.env.VITE_SITE_NAME;
</script>


<style lang="scss" scoped>
    .right {
        // flex: 1 0 0%;
        margin-bottom: 45px;
        margin-left: 0.75rem;
        width: 50%;

        .logo {
            position: fixed;
            top: 2%;
            left: calc(2vw + 0.75rem);
            width: calc(100% - 4vw - 1.5rem);
            font-size: 1.75rem;
            font-family: "Playball", cursive;
            transition: all 0.3s;
            animation: fade;
            -webkit-animation: fade 0.5s;

            &:active {
                transform: scale(0.95);
                transform: translateX(50%);
            }

            @media (min-width: 720px) {
                display: none;
            }
        }
        
        @media (max-width: 720px) {
            margin-left: 0;
            width: 100%;

            &.hidden {
                display: none;
            }
        }
    }
</style>