<style lang="scss">
.pass-input-disabled{
    color: #333333;
    background-color: #ebebe4;
}
</style>
<template>
    <span>
        <input :ref="'input'+index" :disabled="disabled" :class="{'pass-input-disabled':disabled}"  :max="1" v-model="val" @blur="onBlur">
    </span>
</template>

<script>
    const REG = /^\d$/;
    export default {
        props: ['disabled', 'value', 'index', 'inputData'],
        data() {
            return {
                val: this.value,
                old_val: '' + this.value,
                custom: '019'
            }
        },
        watch: {
            val(n, o) {
                let _test = REG.test(n);
                if (!_test) this.$refs['input' + this.index].style.border = '1px solid red';
                let last = n[n.length - 1];
                if (!_test || !n || (this.index === 5 && this.custom.indexOf(last) >= 0)) {
                    let _n = o;
                    if (n.length > 1) {
                        _n = REG.test(last) ? last : o;
                    }
//                    setTimeout(() => {
                    this.val = this.val.length > 1 ? (this.val.replace(o, '')[0] || '0') : ((this.index === 5) ? '' : (REG.test(this.val) && !!this.val ? '0' : ''));//解决手速贼快的小伙子导致输入框为空bug
//                        this.$emit('change',' ', this.index);
//                    }, 10);
                } else {
                    this.$refs['input' + this.index].style.border = '1px solid #ccd8e1';
                    this.$nextTick(_ => {
                        let _refs = this.$vnode.context.$children[this.index + 1];
                        if (!!_refs) {
                            if (this.index > 4) _refs.$refs['input' + (this.index + 1)].focus();
                        } else {
                            this.$refs['input' + this.index].blur();
                        }
                    });
                    this.$emit('change', this.val, this.index);
                }
            },
            value(val) {
                this.val = val;
            }
        },
        methods: {
            onBlur() {
                if (this.val === '') {
                    this.$emit('change', ' ', this.index);
                }
            }
        }
    }
</script>
