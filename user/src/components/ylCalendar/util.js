//是否出现时间端相互覆盖
function isInclude(prev, later) {
    return (prev.pTop < Math.abs(later.pBottom) && Math.abs(prev.pBottom) > later.pTop);
    //return (prev.pTop <= later.pTop && Math.abs(prev.pBottom) >= later.pTop) || (prev.pTop > later.pTop && Math.abs(prev.pTop) > later.pBottom);
}

function percentNum(num, num2, cul) {
    return ((Math.round(num / num2 * 10000) / 100.00) - cul + "%"); //小数点后两位百分比
}
export const createWidth = (detail) => {
    let root = [],
        ind_root = [],
        widthArray = [];
    for (let i = 0; i < detail.length; i++) {

        for (let j = 0; j < detail.length; j++) {
            /**
             * 计算根节点，用于判断属于哪个区块
             */

            if (typeof root[i] == 'undefined' && isInclude(detail[i], detail[j])) {
                if (i == j) { // 根节点为自身，该节点给区块的根节点  此时标记根节点为自身，并且在ind_root中创建对应节点并初始化为零
                    root[i] = j; // 标记根节点为自身
                    ind_root[i] = 1; // 在ind_root中创建对应节点并初始化为1
                } else {
                    root[i] = root[j];
                    ind_root[root[i]]++; // 区块总数+1
                }
            }
        }
    }
    //分区块的max数据，便于计算margin
    let block = Object.assign([], ind_root);
    detail.forEach((item, index) => {
        let max = block[root[index]],
            tmp = block[root[index]] - ind_root[root[index]];
        item.width = (100 - max + 1) / max;
        if (tmp > 0) {
            item.margin = tmp * item.width + tmp - 1;
        } else {
            item.margin = 0;
        }
        item.width = "" + item.width + "%";
        item.margin = "" + item.margin + "%";
        ind_root[root[index]]--;
    });
    return detail;
}
