import Mock from 'mockjs';


var dataMaker = function(count, icon) {

    var nodes = [],
        parentId = -1,
        min = 10,
        max = 90,
        level = 0,
        curLevel = [],
        prevLevel = [],
        levelCount,
        i = 0,
        j, k, l, m;
    while (i < count) {
        if (level == 0) {
            parentId = -1;
            levelCount = 1;
            for (j = 0; j < levelCount && i < count; j++, i++) {
                var n = { id: i, parentId: parentId, type: icon, name: "厦门苹果企业有限公司-" + i, 'namePinyin': '' };
                nodes.push(n);
                curLevel.push(n);
            }
        } else {
            for (l = 0, m = prevLevel.length; l < m && i < count; l++) {
                parentId = prevLevel[l].id;
                levelCount = Math.round(Math.random() * max) + min;
                for (j = 0; j < levelCount && i < count; j++, i++) {
                    let _name = Mock.Random.cname() + i
                    var n = { id: i, parentId: parentId, type: icon, name: _name, 'namePinyin': '' };
                    nodes.push(n);
                    curLevel.push(n);
                }
            }
        }
        prevLevel = curLevel;
        curLevel = [];
        level++;
    }
    return nodes;
}



var dataMaker1 = function(count, icon) {
    var nodes = [],
        parentId = -1,
        min = 10,
        max = 90,
        level = 0,
        curLevel = [],
        prevLevel = [],
        levelCount,
        i = 0,
        j, k, l, m;
    while (i < count) {
        if (level == 0) {
            parentId = -1;
            levelCount = 1;
            for (j = 0; j < levelCount && i < count; j++, i++) {
                var n = { id: i, parentId: parentId, name: "厦门苹果企业有限公司-" + i, 'namePinyin': '' };
                nodes.push(n);
                curLevel.push(n);
            }
        } else {
            for (l = 0, m = prevLevel.length; l < m && i < count; l++) {
                parentId = prevLevel[l].id;
                levelCount = Math.round(Math.random() * max) + min;
                for (j = 0; j < levelCount && i < count; j++, i++) {
                    let _name = "部门" + i
                    var n = { id: i, parentId: parentId, name: _name, type: "STAFF", 'namePinyin': '' };
                    nodes.push(n);
                    curLevel.push(n);
                }
            }
        }
        prevLevel = curLevel;
        curLevel = [];
        level++;
    }
    return nodes;
}


var zNodes = dataMaker(500);


export { zNodes, dataMaker, dataMaker1 };