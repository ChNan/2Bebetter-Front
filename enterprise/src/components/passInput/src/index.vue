<style lang="scss">
    .pass-input {
        min-width: 500px;

        .el-input {
            width: 28px;
            padding: 0 8px 0 0;
        }
        input {
            width: 28px;
            height: 28px;
            line-height: 28px;
            padding: 0;
            text-align: center;
            border-radius: 4px;
            /*background-color: #f5f7fa;*/
            border: solid 1px #ccd8e1;
            font-weight: 700;
            margin-right: 6px;
            font-family: Arial;
            font-size: 18px;
            color: #333333;
        }
        .small-info {
            color: #9d9d9d;
            font-size: 12px;
        }
    }
</style>
<template>
    <div class="pass-input">
        <yl-input v-for="(item ,index) in inputData" :inputData="inputData" :key="index" :index="index"
                  :disabled="index<(disabled||5)"
                  :value="item" @change="changeInput">
        </yl-input>
        <slot name="info"></slot>
    </div>
</template>

<script>
    import YlInput from './input.vue'

    export default {
        name: 'YlPassInput',
        components: {
            YlInput
        },
        props: ['value', 'disabled', 'count'],
        data() {
            return {
                selectValue: this.value,
            }
        },
        watch: {
            value(val) {
                this.selectValue = val;
            },
            selectValue(val) {
                this.$emit('input', val);
            }
        },
        computed: {
            inputData() {
                let _data = [];
                let valueArray = (this.value || '').split('');
                for (let i = 0; i < this.count; i++) {
                    _data.push(valueArray[i] || ' ');
                }
                return _data;
            }
        },
        methods: {
            changeInput(val, index) {
                this.inputData[index] = val;
                this.selectValue = this.inputData.join('');
            },
            validate() {
                if (this.selectValue.replace(' ', '').length !== this.count) {
                    let index = this.inputData.indexOf(' ');
                    this.rest().then(_ => {
                        this.$children[index].$refs['input' + index].focus();
                        this.$children[index].$refs['input' + index].style.border = ' 1px solid red';
                    })
                } else {
                    return true;
                }
            },
            rest() {
                return new Promise(r => {
                    setTimeout(_ => {
                        for (let i = 0; i < this.count; i++) {
                            this.$children[i].$refs['input' + i].style.border = 'solid 1px #ccd8e1';
                        }
                        r();
                    }, 10);
                });
            }
        }
    }
</script>
