<template>
	<div @keydown="handleSearch($event)" class="bar" @keyup="getReal($event)">
		<div class="clearfix">
			<el-input class="u-search" v-model="state4" icon="search" :on-icon-click="handleIconClick" :maxlength="128" :placeholder="placeholder"></el-input>
			<el-button class="el-dropdown-link el-dropdown-link-w more" type="text" @click="showpanel($event)" v-if="isMore">
				{{$t('common.more')}}
				<div class="inline">
					<i class="el-icon-caret-bottom el-icon--right el-icon-caret-bottom" v-show="isBottom"></i>
					<i class="el-icon-caret-bottom el-icon--right el-icon-caret-top" v-show="!isBottom"></i>
				</div>
			</el-button>
		</div>
		<div class="u-box" v-show="isShow">
			<slot name="content"></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.u-box {
		margin-top: 20px;
	}

	.u-search {
		width: 360px;
		margin-right: 20px;
	}

	.u-search .more {
		float: left;
	}

	.inline {
		display: inline-block;
		
		.el-icon-caret-bottom {
			color: #666666;
			font-size: 10px;
		}
	}

	.bar {
		margin-bottom: 20px;
		display: block;

		.el-button--text {
			color: #333333;

			&:hover {
				color: #2699f4;
				
				.el-icon-caret-bottom {
					color: #2699f4;
				}
			}
		}
	}
</style>

<script>
import { setLang, languages } from '@/i18n/index'
import { capsLock } from '@/services/toolService'
export default {
	name: 'searchbar',
	data() {
		return {
			restaurants: [],
			state4: '',
			timeout: null,
			isShow: false,
			isBottom: true,
			search: []
		};
	},
	props: {
		placeholder: {
			type: String,
			default() {
				return this.$t('common.search.placeholder')
			},
		},
		tableSearch: {
			type: Function
		},
		className: {
			type: Object
		},
		isMore: {//是否显示更多搜索条件
			type: Boolean,
			default: true
		},
		keyName:{
			type:String
		},
		showPanel: {
			type: Function
		}

	},
	created() {
		let {
      tableSearch,
			className,
			isMore,
			showPanel
	} = this;
	if(this.keyName){
		this.state4 = this.keyName;
	}
			this.$on('resetKey',()=>{
				this.state4 = '';
			})

	},
	mounted() {
		$('input, textarea').placeholder();
	},
	methods: {
		getReal(e){
			this.state4 = capsLock(e,this.state4);
		},
		setKey(value){
			this.state4 = value;
		},
		getKey(){
			return this.state4;
		},
		handleIconClick() {
			this.tableSearch(this.state4);

		},
		showpanel(e) {
			$('input, textarea').placeholder();
			if (this.isShow) {
				this.isShow = false;
				this.isBottom = true;

			} else {
				this.isShow = true;
				this.isBottom = false;
			}
			if (this.showPanel)
				this.showPanel(this.isShow);
		},
		handleSearch(item) {
			if (item.keyCode == 13) {
				this.tableSearch(this.state4)
			}
		}
	}
}
</script>
