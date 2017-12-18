<style lang="scss">
.reference {
    color: #2699f4;
    cursor: pointer;
    &:hover {
        color: #51adf6;
    }
}

.caret {
    font-size: 12px;
    transform: scale(0.5);
}
</style>
<template>
    <el-popover :trigger="trigger||'click'" placement="bottom-end" @show="show = true" @hide="show = false">
        <slot name="table"></slot>
        <div slot="reference" class="reference">
            {{title}}
            <i :class="show?'el-icon-caret-top':'el-icon-caret-bottom'" class="caret"></i>
        </div>
    </el-popover>
</template>

<script>

export default {
    name: 'YlPopover',
    data() {
        return {
            show: false
        }
    },
    props: ["title", "trigger"],
    methods: {},
    mounted() {

    },
    created() {

    },
    beforeDestroy() {

    }
}
</script>
