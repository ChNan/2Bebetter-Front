<template>
    <div class="g-main" :class="{'menu-collapsed':isSmall}">
        <topbar theme="dark" :account="true" :title="$t('title')"></topbar>
        <sidebar :isSmall="isSmall" @click="clickSidebar()" @open="clickOpen()"></sidebar>
         <div class="m-main"> 
            <router-view></router-view>
         </div> 
    </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import topbar from '@/components/common/TopBar/src/TopBar'
import sidebar from '@/components/SideBar'
import { setLang, languages } from '@/i18n/index'

export default {
    components: {
        topbar,
        sidebar
    },
    data() {
        return {
            isSmall: document.body.clientWidth < 1200
        }
    },
    created() {
        window.addEventListener('resize', () => {
            if (typeof sessionStorage.getItem('click') == 'undefined' || JSON.parse(sessionStorage.getItem('click')))
                this.isSmall = document.body.clientWidth < 1100;
            else {
                if (!JSON.parse(sessionStorage.getItem('click')))
                    this.isSmall = !JSON.parse(sessionStorage.getItem('click'));
            }
        })
    },
    methods: {
        clickSidebar() {
            this.isSmall = !this.isSmall;
        },
        clickOpen() {
            if (this.isSmall) {
                this.isSmall = !this.isSmall;
            }
        }
    }
}
</script>