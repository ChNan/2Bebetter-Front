<template>
    <div class="f-pr dropdown-tree-content" @click.stop="">
        <el-input
            v-model="filterText"
            @focus="open($event)"
            :icon="iconStyle"
            :on-icon-click="handleIconClick"
        >
        </el-input>
        
        <div v-show="treeSwitch" class="tree-content card">
            <el-tree
                class="filter-tree" :data="trees" :props="defaultProps" default-expand-all
                @node-click="checkTreeItem" ref="tree2" :filter-node-method="filterNode"
                :render-content="renderContent"
            >
            </el-tree>
        </div>
    </div>
</template>

<script>
    export default {
    	
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },
        props:['treeData'],
        data() {
            return {
                treeSwitch: false,
                filterText: '',
                filterTextSave:'',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                activeId:""
            };
        },
        computed: {
            iconStyle () {
            	return this.treeSwitch?"caret-top":"caret-bottom"
            },
            trees () {
            	return this.formatToTree(this.treeData);
            }
        },
        methods: {
            renderContent(h, { node, data, store }) {
                return h("span",{style:"font-size:14px"},[h(
                	"span",{attrs:{"title":node.label}},node.label
                )])
                
            },
        
            filterNode(value, data) {
            	return true;
//                if (!value) return true;
//                return data.label.indexOf(value) !== -1;
            },
            handleIconClick () {
                this.treeSwitch?this.close():this.openTree();
            },
            open (e) {
                e.target.blur();
                this.openTree();
            },
            openTree () {
                this.treeSwitch = true;
              //  this.filterText = ''
            },
            close () {
                this.treeSwitch = false;
                if(this.filterText ==='') this.filterText  = this.filterTextSave;
            },
            closeTree () {
                document.addEventListener("click", this.close)
            },
            checkTreeItem(data) {
            	
                this.$emit('selected-item',data.id,this.activeId);
            	this.activeId = data.id;
                this.filterText = data.name;
                this.filterTextSave = data.name;
                this.treeSwitch = false;
            },
            formatToTree (data) {
                return this.getTree(data);
            },
            getTree(data=[], root=null, idTxt="id", pidTxt="parentId", pushTxt="children") {
        
                function getNode(id) {
                    let node = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i][pidTxt] === id) {
                            data[i][pushTxt] = getNode(data[i][idTxt]);
                            node.push(data[i])
                        }
                    }
                    if (node.length !== 0) {
                        return node;
                    }
                }
                return getNode(root)
            },
            initText() {
            	
            	let node = this.treeData
                    .filter(item=>item.id===localStorage.reservation);
            	
                localStorage.reservation === "" || typeof localStorage.reservation === "undefined"
                    ?this.filterText = this.filterTextSave = this.trees[0].name
                    :this.filterText = this.filterTextSave = node.length>0
                        ? this.treeData.filter(item=>item.id===localStorage.reservation)[0].name
                        : this.trees[0].name
            }
    
        },
        mounted () {
            this.closeTree();
        },
        destroyed () {
        	document.removeEventListener("click",this.close)
        }
    };

</script>
<style scoped>
   
    
    .tree-content {
        position: absolute;
        width: 100%;
        z-index: 99;
        margin-top:5px;
    }
    
    .filter-tree {
        text-align: left !important;
        text-indent: 0.5em;
    }
    .card{
        border-radius: 2px;
        box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    }
    .f-pr{
        position: relative;
    }
</style>
