<style lang="scss" scoped>
.el-transfer-panel__header {
    line-height: 45px;
    height: 45px;
    .el-button {
        line-height: 45px;
        height: 45px;
        float: right;
        margin-right: 15px;
        padding: 0;
    }
}

.el-transfer-panel__empty {
    text-align: center;
    padding-top: 25px;
}
.icon-delete:hover{
    color: #FA4D4D !important;
}
.icon-delete :active {
    color: #ef1010 !important;
}
.delete{
    cursor: pointer;
    font-size: 20px;
    line-height: 20px;
    color: red;
}
.el-tree__empty-block{
    height: calc( 100% - 100px);
}

</style>
<style lang="scss">
.transfer-content .el-form-item__error {
    top:40px !important;
}
.ul-box {

    ul {
        margin: 0;
        padding: 0;
        max-height: 100%;
        overflow: auto;
        li {
            padding: 0 0 0 50px;
            margin: 0;
            list-style: none;
            line-height: 36px;
            height: 36px;
            text-align: left;
            white-space: nowrap;
            text-overflow: ellipsis;
            position: relative;
            background: url("./user.png") no-repeat 15px center;
            background-size: 25px 25px;

            .icon {
                padding: 8px 0;
                float: left;
                img {
                    padding: 0 15px 0 0;
                    float: left;
                    width: 20px;
                    height: 20px;
                }
            }
            .delete {
                padding-right: 15px;
                right: 0px;
                position: absolute;
                color: #ddd;
                display: none
            }
        }
        li:hover {
            background-color: #deedfc;
            .delete {
                color: red;
              display: inline-block
            }
        }
    }
}
.no-border-bottom{
    border-bottom: none !important;
}
.transfer-person {
    float: left;
    text-overflow:ellipsis;
    white-space:nowrap;
    max-width: calc(100% - 40px);
    overflow: hidden
}
.transfer-person-content {
    width: 100%;
}
.transfer-person-item{
    width: calc(100% - 50px);overflow: hidden
}
</style>
<template>
    <div class="el-transfer-panel transfer-content">
        <el-row style="padding: 10px 10px 0 10px;" v-if="mode==='attendance'" >
            <el-col :span="24" style="height: 45px">
                <el-form :model="email">
                    <el-form-item :rules="rules"   prop="searchValue">
                        <el-input :placeholder="$t('reservation.modal.addMember.placeholder')" v-model="email.searchValue"  @change="checkAddOuter"
                                  style="width:calc(100% - 70px)" ></el-input>
                        <el-input style="display: none"></el-input>
                        <el-button  type="primary"
                                    :disabled="!btnStatus" @click="addOutPerson">{{$t('reservation.add')}}</el-button>
                    </el-form-item>

                </el-form>

            </el-col>
        </el-row>
        <p class="el-transfer-panel__header no-border-bottom" style="padding-left: 10px; background: #fff;" :style="mode!=='attendance'?'padding-top:10px;':''">
            {{ $t('reservation.modal.addMember.checked') }} {{ checkedNum }}{{$t('reservation.modal.addMember.member')}}
            <el-button type="text" @click="clearAll">{{ $t('reservation.modal.addMember.clearAll') }}</el-button>
        </p>
        <div class="el-transfer-panel__body ul-box data-infinite-wrapper" :style="mode!=='attendance'?'max-height: calc(100% - 65px)':'max-height: calc(100% - 75px)'">
            <ul infinite-wrapper class="transfer-person-content" :style="mode!=='attendance'?'max-height: calc(100% - 10px)':'max-height: calc(100% - 40px)'">
                <li :title="self" class="transfer-person-item" :class="[iconSkinField]" v-if="self.length>0">
                    <span class="transfer-person">{{self}}</span>
                </li>
                <li :title="item.name" class="transfer-person-item" v-for="(item,index) in outerPerson" :key="item.id" :class="[iconSkinField]">
                    <span class="transfer-person">{{item.name}}</span>
                    <i class="delete icon-delete iconfont icon" v-if="!item.chkDisabled" @click="deleteOuter(item,index)"></i>
                </li>
                <li :title="item.name" class="transfer-person-item" v-for="(item,index) in option" :key="item.id" :class="[iconSkinField]">
                    <span class="transfer-person">
                        {{item.name}}
                    </span>
                    <i class="delete icon-delete iconfont icon" v-if="!item.chkDisabled" @click="deleteChange(item,index)"></i>
                </li>
                <infinite-loading v-if="rightChecked.length > 0" v-show="rightChecked.length > PAGE" :on-infinite="onInfinite" ref="infiniteLoading">
                    <div slot="no-more"></div>
                </infinite-loading>
            </ul>
            <div class="el-tree__empty-block" v-if="rightChecked.length === 0 && outerPerson.length === 0 && self.length===0">
                <span class="el-tree__empty-text">{{ $t('el.tree.emptyText') }}</span>
            </div>
        </div>
    </div>
</template>

<script>

import InfiniteLoading from 'vue-infinite-loading';

const PAGE = 200
export default {
    name: 'YLTransferPanelRight',
    componentName: 'YLTransferPanelRight',
    components: {
        InfiniteLoading
    },
    props: ["rightChecked","iconSkinField",],

    data() {
        let takeupCheck = (rule, value, callback) => {
            if (this.outerPerson.map(item=>item.name).indexOf(this.email.searchValue)>-1) {
                callback(new Error(this.$t('reservation.AddPserson.sameEmailAddress')));
            } else {
            	if(this.email.searchValue!==''&&typeof this.email.searchValue!=='undefined'&&this.email.searchValue!==null){
                    this.btnStatus = true;
                }

                callback();
            }
        };
        return {
        	rules:[
                { type: 'email', message: this.$t('reservation.AddPserson.wrongEmailAddress'), trigger: 'blur,change' },
                { validator: takeupCheck, trigger: 'blur,change' }
            ],
            option: [],
            page: 0,
            searchValue:"",
            btnStatus:false,
            outerPerson:[],
            email:{
        	    searchValue:""
            },
            PAGE
        }
    },

    watch: {
        rightChecked(val) {
            this.page = 0;
            this.option = this.rightChecked.slice(this.page, this.page += PAGE)
            this.option = this.option
        },
    },
    computed: {
        language () {
            return this.$store.state.reservation.language;
        },
    	checkedNum () {
            return this.language==='zh-CN'
                ?Number(this.rightChecked.length) + Number(this.outerPerson.length) + Number(this.self.length>0?1:0)
                :`(${Number(this.rightChecked.length) + Number(this.outerPerson.length) + Number(this.self.length>0?1:0)})`
        },
    	mode () {
    	    return this.$store.state.reservation.transferMode;
        },
        getOption() {
            return this.rightChecked
        },
        organizer () {
            return this.$store.state.reservation.organizer;
        },
        self () {
        	if(this.mode === "attendance"){
                return this.isEdit
                    ?this.organizer.name
                    :JSON.parse(sessionStorage.user).personal.name
            }else {
        		return ""
            }


        },
        isEdit () {
        	return this.$store.state.reservation.isEdit;
        }
    },
    mounted() {

    },
    methods: {
    	checkAddOuter (newVal) {
            let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            this.btnStatus=reg.test(newVal)&&(this.outerPerson.map(item=>item.name).indexOf(this.email.searchValue)===-1)
        },
        addOutPerson(){
            let nameList = this.outerPerson.map(item=>item.name);
            if(nameList.indexOf(this.searchValue)===-1){
                this.outerPerson.push({name:this.email.searchValue})
            }
            this.email.searchValue = "";
            this.btnStatus = false
        },
        onInfinite() {
            setTimeout(() => {
                this.option = this.option.concat(this.rightChecked.slice(this.page, this.page += PAGE));
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                if (this.option.length >= this.rightChecked.length) {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                }
            }, 150)
        },
        deleteChange(node, index) {
            this.$emit('checked-change', node, index);
            this.rightChecked.splice(index, 1);
            this.option.splice(index, 1)
        },
        deleteOuter (item,index) {
        	this.outerPerson.splice(index,1);
        },
        clearAll() {
            this.$emit('checked-change', null);
            this.outerPerson = [];
            this.rightChecked.splice(0, this.rightChecked.length);
            this.option = [];
        }
    }
};
</script>
