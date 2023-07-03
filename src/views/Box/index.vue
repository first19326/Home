<template>
    <div class="box cards" @mouseenter="closeShow = true" @mouseleave="closeShow = false">
        <Transition name="el-fade-in-linear">
            <CloseOne class="close" theme="filled" size="28" fill="#FFFFFF60" v-show="closeShow" @click="store.boxOpenState = false" />
        </Transition>
        <Transition name="el-fade-in-linear">
            <SettingTwo class="setting" theme="filled" size="28" fill="#FFFFFF60" v-show="closeShow" @click="openMoreSet" />
        </Transition>
        <div class="content">
            <TimeCapsule />
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import { CloseOne, SettingTwo } from "@icon-park/vue-next";
    import TimeCapsule from "@/components/TimeCapsule/index.vue";
    import { mainStore } from "@/store";
    const store = mainStore();

    let closeShow = ref(false);

    const openMoreSet = () => {
        store.setOpenState = true;
        let animate = document.querySelector(".animate");
        animate.classList.add("resize");
    }
</script>

<style lang="scss" scoped>
    .box {
        flex: 1 0 0%;
        position: relative;
        margin-left: 0.75rem;
        height: 80%;
        max-height: 864px;
        animation: fade;
        -webkit-animation: fade 0.5s;

        &:hover {
            transform: scale(1);
        }

        .close, .setting {
            position: absolute;
            top: 14px;
            right: 14px;
            width: 28px;
            height: 28px;

            &:hover {
                transform: scale(1.2);
            }

            &:active {
                transform: scale(1);
            }
        }

        .setting {
            right: 56px;
        }

        .content {
            padding: 30px;
            width: 100%;
            height: 100%;
        }
    }
</style>