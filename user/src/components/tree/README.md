调用方法：
1.引入插件
    示例： import Tree from '@/components/account/tree'
2.注册插件
    示例： components: {   Tree  }
3.绑定
    示例：
      <tree ref="tree" :data="nodes" show-checkbox></tree>

=====================Attributes=====================
参数	说明	类型	可选值	默认值
data	展示数据	array	—	—
defaultExpandAll	默认展开数据	boolean	—	—
empty-text	内容为空的时候展示的文本	String	—	—
setting	配置参数，将与默认参数合并	Object	—	—
defaultCheckedKeys	默认勾选的节点的 key 的数组	array	—	—
checkedKeys	当前勾选的节点的 key 的数组（目前是双向绑定）	array	—	—
icon(user,room,cloud,person)	子节点显示的图标	String	—	—
edit	是否启用编辑模式	boolean	—	—
showCheckbox	是否显示选择框	boolean	—	false
showTitle	是否显示标题	boolean	—	false
title	 显示标题名称	boolean	—	common.tree.title


=====================方法=====================
getCheckedNodes ，getCheckedValues ，getCheckedValues
	说明：若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
	参数：（checked） boolean 类型的参数，接收一个是选中状态还是非选中状态	，若为 true 则返回被选中的叶子节点，false 则返回未被选中的叶子节点 ，默认值为 false
	       (leafOnly) 接收一个 Number 类型的参数，若为 1 则仅返回被选中的叶子节点，若为 0 则仅返回被选中的所有节点，若为 -1 则仅返回被选中的所有父节点，默认值为 0

addNodes
    说明：添加一个节点
    参数：newNodes Object 格式： {id, pId, name, isParent, children}

filter
     说明：过滤节点
     参数：key 过滤关键字


=====================Events=====================
事件名称	说明	回调参数
node-prev	上移	共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的上一个节点。
node-next	下移	共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的下一个节点。
node-edit	编辑	共一个参数， 当前节点的 Node 对象
node-delete	删除    共一个参数， 当前节点的 Node 对象。
node-filter	过滤	共三个参数，依次为：过滤关键字，过滤后的节点Keys，过滤后的节点。
node-click	过滤	共两个参数，依次为：当前节点的 Id, 当前节点的 Node 对象。
node-check	过滤	共三个参数，依次为：当前节点的 Id, 当前节点的 Node 对象,当前节点的 Node 对象是否被选中。
