import '../lib/jquery.ztree.all';
import '../lib/jquery.ztree.exhide.min';
import _ from 'lodash';



export default class TreeStore {

    constructor(options) {
        // console.log("实例化tree", this);
        this.currentNode = null;
        this.preNode = null;
        this.nextNode = null;
        this.zTree = null;
        this.selectedNodes = null;
        this.currentNodeKey = null;
        this.root = null;
        this.disabledNext = null;
        this.disabledPrev = null;
        this.disabledEdit = null;
        this.disabledDelete = null;

        this.isEmit = true;
        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
        const DEFAULT_SETTING = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            check: {},
            key: {},
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {
                    isCopy: false,
                    isMove: false,
                    inner: false
                }
            },
            view: {}
        };
        this.setting = Object.assign({}, DEFAULT_SETTING);

        this.setting.callback = {
            // onDrag: (event, treeId, treeNodes) => {
            //     this.zTreeOnDrag(event, treeId, treeNodes);
            // },
            onCheck: (event, treeId, treeNode) => {
                this.zTreeOnCheck(event, treeId, treeNode);
            },
            onClick: (event, treeId, treeNode) => {
                this.zTreeOnClick(event, treeId, treeNode);
            }
        };

        this.setting.view = {
            showIcon: (treeId, treeNode) => {
                return treeNode.type === this.type;
            },
            addDiyDom: (treeId, treeNode) => {
                var spaceWidth = 16;
                var switchObj = $('#' + treeNode.tId + '_switch'),
                    checkObj = $('#' + treeNode.tId + '_check'),
                    icoObj = $('#' + treeNode.tId + '_ico');
                switchObj.remove();
                checkObj.remove();
                icoObj.before(switchObj);
                icoObj.before(checkObj);

                if (treeNode.level >= 1) {
                    var spaceStr = '<span style=\'display: inline-block;width:' + (spaceWidth * treeNode.level + (7 * (treeNode.level - 1))) + 'px\'></span>';
                    $('#' + treeNode.tId + '_switch').before(spaceStr);
                }
            }
        };

        this.setting.key.name = this.props.name;
        this.setting.data.simpleData.idKey = this.props.id;
        this.setting.data.simpleData.pIdKey = this.props.pId;

        /*
         * 覆盖setting
         * */
        if (!!options.showCheckbox) {
            this.setting.check.enable = true;
        } else {
            this.setting.check.enable = false;
        }
        this.setting = _.defaultsDeep(this.setting, options.setting);
        if (this.data && this.data.length > 0) this.init(this.data);
    }

    /*
     * 当点击选择框时候触发
     * */
    // zTreeOnDrag(event, treeId, treeNodes) {
    //     this.vue.$emit('node-drag', treeNodes);
    //     this.updateStore();
    // };

    /*
     * 当点击选择框时候触发
     * */
    zTreeOnCheck(event, treeId, treeNode) {
        if (!this.isEmit) {
            this.isEmit = true;
            return;
        } else {
            this.onCheck(event, treeNode.id, treeNode, treeNode.checked, treeId);
        }
        if (!treeNode.open) this.zTree.expandNode(treeNode, !treeNode.open);
        this.updateStore();
    }

    /*
     * 当点击节点时候触发，,自动展开
     * */
    zTreeOnClick(event, treeId, treeNode) {
        //todo 自动选中
        if (!treeNode.isParent) this.zTree.checkNode(treeNode, !treeNode.checked, true);
        // this.zTree.expandNode(treeNode, !treeNode.open)
        this.onClick(event, treeNode.id, treeNode, treeId);
        this.updateStore();
    }

    setPrevNode() {
        let { zTree, currentNode, preNode } = this;
        if (preNode !== null && currentNode[this.props.pId] === preNode[this.props.pId]) {
            zTree.moveNode(currentNode, preNode, 'next');
            this.updateStore();
        }
    }

    setNextNode() {
        let { zTree, currentNode, nextNode } = this;
        if (nextNode !== null && currentNode[this.props.pId] === nextNode[this.props.pId]) {
            zTree.moveNode(currentNode, nextNode, 'prev');
            this.updateStore();
        }
    }

    setEditNode() {
        this.updateStore();
    }

    setDeleteNode() {
        //removeChildNodes todo delete all
        let { zTree, selectedNodes } = this;
        for (let i = 0, l = selectedNodes.length; i < l; i++) {
            zTree.removeNode(selectedNodes[i]);
        }
        this.updateStore();
    }

    /*
     * 获取节点
     * checked:返回选中还是未选中的nodes
     * leafOnly:0:返回所有的,1：返回选中的子节点,-1：返回所有的父节点
     * */
    getCheckedNodes(checked, leafOnly) {
        let { zTree } = this;
        if (!zTree) return;
        let all = this.filterValue ? zTree.transformToArray(zTree.getNodes()).filter(d => d.checked === !!checked) : this.zTree.getCheckedNodes(checked);
        if (leafOnly < 0) {
            return all.filter(x => x.type !== this.type); //this.getOwnProperty(all.filter(x => x.type !== this.type))
        } else if (leafOnly > 0) {
            return all.filter(x => x.type === this.type); //this.getOwnProperty(all.filter(x => x.type === this.type))
        }
        return all; // this.getOwnProperty(all);
    }

    /*
     * 计算所需要的数据格式，按照传入的反回
     * */
    getOwnProperty(data) {
        if (!this.ownProperty) return data;
        let options = this.data[0];
        let all_nodes = [];
        //todo 过滤所需要的数据
        data.forEach(n => {
            let _node = {};
            for (let option in options) {
                if (options.hasOwnProperty(option)) {
                    if ('iconSkin' !== option) _node[option] = n[option];
                }
            }
            all_nodes.push(_node);
        });
        return all_nodes;
    }

    /*
     *  获取所有选中的键
     * */
    getCheckedKeys(checked, leafOnly) {
        const allNodes = this.getCheckedNodes(checked, leafOnly) || [];
        let keys = [];
        allNodes.forEach((node) => {
            keys.push(node.id);
        });
        return keys;
    }

    /*
     * 获取所有选中的值
     * */
    getCheckedValues(checked, leafOnly) {
        const allNodes = this.getCheckedNodes(checked, leafOnly);
        let values = [];
        allNodes.forEach((node) => {
            values.push(node.name);
        });
        return values;
    }

    /*
     * 获取所有nodes
     * */
    getAllNodes(leafOnly) {
        let { zTree } = this;
        let nodes = zTree && zTree.transformToArray(zTree.getNodes()) || [];
        let all = leafOnly ? nodes.filter(x => !x.isParent) : nodes;
        return this.getOwnProperty(all);
    }

    getNodes() {
        let { zTree } = this;
        return zTree.getNodes();
    }

    getAllShowNodes(leafOnly) {
        let { zTree } = this;
        let nodes = zTree && zTree.transformToArray(zTree.getNodes()).filter(node => !node.isHidden) || [];
        let all = leafOnly ? nodes.filter(x => !x.isParent) : nodes;
        return this.getOwnProperty(all);
    }

    expandAll(t) {
        let { zTree } = this;
        if (!zTree) return;
        zTree.expandAll(t);
    }

    /*
     * 生成树对象
     * */
    init(newVal) {
        // console.log("配置参数：", this);
        let { zTree } = this;
        zTree && zTree.destroy(this.id);
        this.data = newVal;
        // let source = this.data;
        $(document).ready(() => {
            this.zTree = $.fn.zTree.init($(`#${this.id}`), this.setting, this._getDataIconSource(this.data) || []);
            //todo 默认选中
            this.setDefaultCheckedKeys(this.defaultCheckedKeys);
            this._defaultSelectNode();
            this._defaultExpandNode();
            this.setCheckedKeys(this.checkedKeys, true);
            if (this.defaultExpandAll) this.zTree.expandAll(true);
            // this.root = this.zTree.transformToArray(this.zTree.getNodes());
        });
    }

    /*
     * 设置图标
     * */
    _getDataIconSource() {
        if (!!this.iconSkinField) {
            this.data = this.data.filter(x => !!x).map(x => x);
            this.data.filter(x => x.type == this.type).forEach(d => {
                d.iconSkin = d[this.iconSkinField];
            });
        }
        return this.data;
    }

    /*
     * 添加一个节点{id(必填), parentId(必填), name(必填) , isParent, children=[]}
     * */
    addNodes(nodes) {
        let { zTree } = this;
        let allNodes = this.zTree.getNodes();
        let pNodes = zTree.transformToArray(allNodes).find(x => x.id === nodes.parentId) || null;
        this.zTree.addNodes(pNodes, -1, nodes, false);
    }

    _defaultSelectNode() {
        let { zTree } = this;
        let nodes = zTree.getNodes();
        if (nodes.length > 0) {
            zTree.selectNode(nodes[0]);
        }
    }

    _defaultExpandNode() {
        let { zTree } = this;
        let nodes = zTree.getNodes();
        if (nodes.length > 0) {
            zTree.expandNode(nodes[0]);
        }
        // if (nodes.length > 0) {
        //     let children = nodes[0].children;
        //     children.forEach(x => {
        //         zTree.expandNode(x);
        //     });
        // }
    }

    /*
     * 设置默认选中的/此功能貌似没用到
     * */
    setDefaultCheckedKeys(newVal) {
        if (!newVal) return;
        this.defaultCheckedKeys = newVal;
        let { zTree } = this;
        if (!zTree) return;
        let nodes = this.zTree.getNodes();
        this.defaultCheckedKeys.forEach(key => {
            zTree.transformToArray(nodes).forEach(node => {
                if (node.id === key) {
                    node.checked = true;
                    zTree.updateNode(node);
                    expandNodes(node, true);
                }
            });
        });

        function expandNodes(node, isExpand) {
            if (node === null) return;
            if (node.isParent) {
                zTree.expandNode(node, isExpand);
            } else {
                expandNodes(node.getParentNode(), isExpand);
            }
        }

        this.updateStore();
    }

    checkNodeIds(ids, checked, checkTypeFlag, callbackFlag) {
        let { zTree } = this;
        if (ids === null || zTree === null) {
            return;
        }
        ids.forEach(id => {
            let node = zTree.getNodeByParam('id', id, null);
            if (node !== null) zTree.checkNode(node, checked, checkTypeFlag, callbackFlag);
        });
    }

    checkNodeId(id, checked, checkTypeFlag, callbackFlag) {
        let { zTree } = this;
        if (!id || zTree === null) {
            return;
        }
        let node = zTree.getNodeByParam('id', id, null);
        zTree.checkNode(node, checked, checkTypeFlag, callbackFlag);
    }

    unCheckedNodes(node) {
        let { zTree } = this;
        if (node === null) {
            zTree.checkAllNodes(false);
            return;
        }
        zTree.checkNode(node, false, true);
    }
    checkNodes(nodes, checked, checkTypeFlag, callbackFlag) {
        let { zTree } = this;
        if (node === null) {
            return;
        }
        nodes.forEach(node => zTree.checkNode(node, checked, checkTypeFlag, callbackFlag));
    }
    checkNode(node, checked, checkTypeFlag, callbackFlag) {
        let { zTree } = this;
        if (node === null) {
            return;
        }
        zTree.checkNode(node, checked, checkTypeFlag, callbackFlag);
    }
    checkAllNodes(checked) {
        let { zTree } = this;
        if (zTree === null) {
            return;
        }
        zTree.checkAllNodes(checked);
    }

    /*
     * 设置选中的Keys
     * */
    setCheckedKeys(newVal, checked, checkTypeFlag, callbackFlag) {

        let { zTree } = this;
        if (!zTree || !newVal) return;
        zTree.checkAllNodes(false);
        this.checkedKeys = newVal;
        this.checkNodeIds(newVal, true, true, false);
        this.updateStore();

        /*   this.checkedKeys = newVal;
           if (!newVal) return;
           this.checkNodeIds(newVal, true, true, true);*/

        // this.checkedKeys = newVal;
        // let { zTree } = this;
        // if (!zTree || !newVal) return;
        // let nodes = zTree.getNodes();
        // zTree.checkAllNodes(false);

        // this.checkedKeys.forEach(key => {
        //     zTree.transformToArray(nodes).forEach(node => {
        //         if (node.id === key) {
        //             node.checked = true;
        //             zTree.updateNode(node);
        //             expandNodes(node, isExpand);
        //         }
        //     })
        // })

        // function expandNodes(node, isExpand) {
        //     if (node === null || !isExpand) return;
        //     if (node.isParent) {
        //         zTree.expandNode(node, isExpand);
        //     } else {
        //         expandNodes(node.getParentNode(), isExpand);
        //     }
        // }

        this.updateStore();
    }


    /*
     * 过滤(方法一)
     * */
    filter(value) {
        this.filterValue = value;
        let { zTree } = this;
        if (!zTree) return; //ie10
        let nodeList = zTree.transformToArray(zTree.getNodes());
        let filterNodeList = zTree.getNodesByFilter(x => x.name.includes(value), false);

        zTree.hideNodes(nodeList);
        /*
         * ==== 把父节点显示出来 begin====
         * */
        [...filterNodeList].forEach(_node => {
            updateParentNode(_node);
        });

        function updateParentNode(_node) {
            if (_node === null) return;
            if (_node.parentTId !== null) {
                let pn = _node.getParentNode();
                filterNodeList.push(pn);
                updateParentNode(pn);
            }
        }

        /*
         * ==== 把父节点显示出来 end====
         * */
        zTree.showNodes(filterNodeList);

        return filterNodeList;
    }
    getNodesByFilter(filter) {
        let { zTree } = this;
        if (!zTree) return;
        return zTree.getNodesByFilter(filter);
    };
    /*
     * 显示隐藏Nodes
     * */
    setShowNodes(nodes) {
        let { zTree } = this;
        if (!zTree) return; //ie10
        zTree.transformToArray(zTree.getNodes()).forEach(node => {
            if (nodes instanceof Array) {
                nodes.forEach(n => {
                    if (n.id === node.id) {
                        zTree.showNode(node);
                    }
                });
            } else {
                if (nodes.id === node.id) {
                    zTree.showNode(node);
                }
            }
        });
    }


    setHideNodes(nodes) {
        let { zTree } = this;
        if (!zTree) return; //ie10
        zTree.transformToArray(zTree.getNodes()).forEach(node => {
            if (nodes instanceof Array) {
                nodes.forEach(n => {
                    if (n.id === node.id) {
                        zTree.hideNode(node);
                    }
                });
            } else {
                if (nodes.id === node.id) {
                    zTree.hideNode(node);
                }
            }
        });
    }

    transformToArray(node) {
        let { zTree } = this;
        if (!zTree) return;
        return zTree.transformToArray(node);
    }

    updateNode(treeNode, checkTypeFlag) {
        let { zTree } = this;
        zTree.updateNode(treeNode, checkTypeFlag);
    }

    refresh() {
        let { zTree } = this;
        zTree.refresh();
    }

    moveNode(targetNode, treeNode, moveType, isSilent) {
        let { zTree } = this;
        let _targetNode = targetNode;
        let _treeNode = treeNode;
        if (!(targetNode instanceof Object)) {
            _targetNode = zTree.getNodeByParam('id', targetNode, null);
        }
        if (!(treeNode instanceof Object)) {
            _treeNode = zTree.getNodeByParam('id', treeNode, null);
        }
        zTree.moveNode(_targetNode, _treeNode, moveType, isSilent);
    }

    selectNode(node) {
        let { zTree } = this;
        let _targetNode = node;
        if (!(node instanceof Object)) {
            _targetNode = zTree.getNodeByParam('id', node, null);
        }
        zTree.selectNode(_targetNode);
    }

    selectParentNode(node) {
        let { zTree } = this;
        let _targetNode = node;
        if (!(node instanceof Object)) {
            _targetNode = zTree.getNodeByParam('id', node, null);
        }
        zTree.selectNode(_targetNode.getParentNode());
    }

    setShowNodesKeys(keys) {
        let { zTree } = this;
        if (!zTree) return; //ie10
        let _array = keys instanceof Array;
        let nodeList = zTree.transformToArray(zTree.getNodes()).filter(node => {
            return _array ? keys.includes(node.id) : node.id == keys;
        });
        if (_array) {
            zTree.showNodes(nodeList);
        } else {
            zTree.showNode(nodeList);
        }
    }

    setHideNodesKeys(keys) {
        let { zTree } = this;
        if (!zTree) return; //ie10
        let _array = keys instanceof Array;
        let nodeList = zTree.transformToArray(zTree.getNodes()).filter(node => {
            return _array ? keys.includes(node.id) : node.id == keys;
        });
        if (_array) {
            zTree.hideNodes(nodeList);
        } else {
            zTree.hideNode(nodeList);
        }
    }


    /*
     * 对象内置方法封装
     * */
    updateStore() {
        this.zTree = this._getTreeObject();
        this.selectedNodes = this._getSelectedNodes();
        this.currentNode = this._getCurrentNode();
        this.preNode = this._getPreNode();
        this.nextNode = this._getNextNode();
        if (this.edit) {
            this.disabledNext = this.currentNode === null || this.currentNode && !this.currentNode.getNextNode() || this.currentNode.getNextNode().type !== this.currentNode.type;
            this.disabledPrev = this.currentNode === null || this.currentNode && !this.currentNode.getPreNode() || this.currentNode.getPreNode().type !== this.currentNode.type;
            this.disabledEdit = this.currentNode === null || this.currentNode.parentId === null || this.currentNode.type === this.type;
            this.disabledDelete = this.currentNode === null || this.currentNode.parentId === null || (this.currentNode.children && this.currentNode.children.length > 0); // (this.currentNode.children && this.currentNode.children.every(x => x.type !== this.type) || false);
        }
    }

    _getTreeObject() {
        let zTree = $.fn.zTree.getZTreeObj(this.id);
        return zTree;
    }

    _getSelectedNodes() {
        if (!this.zTree) return [];
        return this.zTree.getSelectedNodes();
    }

    _getCurrentNode() {
        return this.selectedNodes.length > 0 ? this.selectedNodes[0] : null;
    }

    _getPreNode() {
        return this.selectedNodes.length > 0 ? this.selectedNodes[0].getPreNode() : null;
    }

    _getNextNode() {
        return this.selectedNodes.length > 0 ? this.selectedNodes[0].getNextNode() : null;
    }

}
