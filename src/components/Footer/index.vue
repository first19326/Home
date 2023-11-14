<template>
    <footer id="footer" :class="store.footerBlur ? 'blur' : null">
        <Transition name="fade" mode="out-in">
            <div class="power" v-if="!store.playerShowLrc || !store.playerState">
                <span>Copyright&nbsp;&copy;&nbsp;{{ startYear ? startYear : new Date().getFullYear() }}
                    <a :href="url">{{ author }}</a>
                </span>
                <!-- 站点备案 -->
                <span v-if="filing" class="filing hidden">&nbsp;&amp;&nbsp;<a href="https://beian.miit.gov.cn" target="_blank">{{ filing }}</a></span>
                <!-- 公安备案 -->
                <span v-if="police" class="police hidden">&nbsp;&amp;&nbsp;<a href="https://www.beian.gov.cn/" target="_blank">{{ police }}</a></span>
            </div>
            <div class="lrc" v-else>
                <Transition name="fade" mode="out-in">
                    <div class="lrc-line" :key="store.getPlayerLrc">
                        <MusicOne theme="filled" size="18" fill="#EFEFEF" v-show="store.getPlayerLrc" />
                        <span class="lrc-text text-hidden" v-html="store.getPlayerLrc || '&emsp;'" />
                        <MusicOne theme="filled" size="18" fill="#EFEFEF" v-show="store.getPlayerLrc" />
                    </div>
                </Transition>
            </div>
        </Transition>
    </footer>
</template>

<script setup>
    import { MusicOne } from "@icon-park/vue-next";
    import { mainStore } from "@/store";
    const store = mainStore();

    const author = import.meta.env.VITE_SITE_AUTHOR;
    const filing = import.meta.env.VITE_SITE_FILING.trim();
    const police = import.meta.env.VITE_SITE_POLICE.trim();
    const startYear = import.meta.env.VITE_SITE_START.trim().substr(0, 4);

    const url = computed(() => {
        let siteUrl = import.meta.env.VITE_SITE_URL;
        if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
            return "//" + siteUrl;
        }
        return siteUrl;
    });
</script>

<style lang="scss" scoped>
    #footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 35px;
        line-height: 35px;
        z-index: 0;
        font-size: 14px;
        text-align: center;
        overflow: hidden;

        &.blur {
            background: rgb(0 0 0 / 25%);
            backdrop-filter: blur(10px);
            font-size: 16px;
        }

        @media (max-width: 720px) {
            font-size: 0.85rem;

            &.blur {
                font-size: 0.85rem;
            }
        }

        .power {
            animation: fade 0.3s;

            @media (max-width: 720px) {
                .police.hidden {
                    display: none;
                }
            }

            @media (max-width: 480px) {
                .filing.hidden {
                    display: none;
                }
            }
        }

        .lrc {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 0 20px;

            .lrc-line {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width: 98%;

                .lrc-text {
                    margin: 0 8px;

                    @media (max-width: 720px) {
                        margin-top: 2px;
                    }
                }

                .i-icon {
                    display: inherit;
                    width: 18px;
                    height: 18px;
                }
            }
        }

        .fade-enter-active, 
        .fade-leave-active {
            transition: opacity 0.15s ease-in-out;
        }
    }
</style>