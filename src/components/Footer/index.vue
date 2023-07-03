<template>
    <footer>
        <div class="power" v-show="!store.playerShowLrc || !store.playerState">
            <span>Copyright&nbsp;&copy;&nbsp;{{ startYear }}
                <a :href="url">{{ author }}</a>
            </span>
            <!-- 站点备案 -->
            <span v-if="filing.trim() != ''" class="filing hidden">&nbsp;&amp;&nbsp;</span>
            <a v-if="filing.trim() != ''" class="filing hidden" href="https://beian.miit.gov.cn" target="_blank">{{ filing }}</a>
            <!-- 公安备案 -->
            <span v-if="police.trim() != ''" class="police hidden">&nbsp;&amp;&nbsp;</span>
            <a v-if="police.trim() != ''" class="police hidden" href="https://www.beian.gov.cn/" target="_blank">{{ police }}</a>
        </div>
        <div class="lrc" v-show="store.playerShowLrc && store.playerState">
            <MusicOne theme="filled" size="18" fill="#EFEFEF" />
            <span class="lrc-text">
                {{ store.getPlayerLrc ? store.getPlayerLrc : "&emsp;" }}
            </span>
            <MusicOne theme="filled" size="18" fill="#EFEFEF" />
        </div>
    </footer>
</template>

<script setup>
    import { MusicOne } from "@icon-park/vue-next";
    import { mainStore } from "@/store";
    const store = mainStore();

    const author = import.meta.env.VITE_SITE_AUTHOR;
    const url = import.meta.env.VITE_SITE_URL;
    const filing = import.meta.env.VITE_SITE_FILING;
    const police = import.meta.env.VITE_SITE_POLICE;

    let startYear = import.meta.env.VITE_SITE_START.substr(0, 4);
</script>

<style lang="scss" scoped>
    footer {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 35px;
        background: rgb(0 0 0 / 25%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 0;
        text-align: center;
        animation: fade;
        -webkit-animation: fade 0.5s;

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

        .power {
            font-size: 0.9rem;
            animation: fade;
            -webkit-animation: fade 0.3s;

            @media (max-width: 720px) {
                font-size: 0.85rem;
            }
        }

        .lrc {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
            animation: fade;
            -webkit-animation: fade 0.3s;

            @media (max-width: 720px) {
                font-size: 0.85rem;
            }

            .lrc-text {
                display: -webkit-box;
                margin: 0 8px;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                word-break: break-all;

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
</style>