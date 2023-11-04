<template>
    <div id="loader-wrapper" :class="store.imageLoadState ? 'loaded' : null">
        <div class="loader">
            <div class="loader-circle" />
            <div class="loader-text">
                <span class="name">{{ siteName }}</span>
                <span class="tip"> 正在加载 </span>
            </div>
        </div>
        <div class="loader-section section-left" />
        <div class="loader-section section-right" />
    </div>
</template>
<script setup>
    import { mainStore } from "@/store";
  
    const store = mainStore();
  
    // 配置
    const siteName = import.meta.env.VITE_SITE_NAME;
</script>
  
<style lang="scss" scoped>
    #loader-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        overflow: hidden;

        .loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            .loader-circle {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                border: 3px solid transparent;
                border-top-color: #FFF;
                animation: rotate 1.8s linear infinite;
                z-index: 2;
          
                &:before {
                    content: "";
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    bottom: 5px;
                    left: 5px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top-color: #A4A4A4;
                    animation: rotate-reverse 0.6s linear infinite;
                }
      
                &:after {
                    content: "";
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    bottom: 15px;
                    left: 15px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top-color: #D3D3D3;
                    animation: rotate 1s linear infinite;
                }
            }
            .loader-text {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 40px;
                color: #FFF;
                font-size: 24px;
                z-index: 2;

                .name {
                    font-family: "Playball", cursive;
                }

                .tip {
                    opacity: 0.6;
                    margin-top: 6px;
                    font-size: 14px;
                }
            }
        }

        .loader-section {
            position: fixed;
            top: 0;
            width: 51%;
            height: 100%;
            background: #333;
            z-index: 1;

            &.section-left {
                left: 0;
            }

            &.section-right {
                right: 0;
            }
        }

        &.loaded {
            visibility: hidden;
            transform: translateY(-100%);
            transition:
                transform 0.3s 1s ease-out,
                visibility 0.3s 1s ease-out;

            .loader {
                .loader-circle,
                .loader-text {
                    opacity: 0;
                    transition: opacity 0.3s ease-out;
                }
            }
            .loader-section {

                &.section-left {
                    transform: translateX(-100%);
                    transition: transform 0.5s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                }
                
                &.section-right {
                    transform: translateX(100%);
                    transition: transform 0.5s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                }
            }
        }
    }
    
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    
    @keyframes rotate-reverse {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-360deg);
        }
    }
</style>