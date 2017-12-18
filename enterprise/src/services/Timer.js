const S = 1000
const M = 1000 * 60
const H = 1000 * 60 * 60
const D = 1000 * 60 * 60 * 24


class Timer {
    //@complete 是否显示完整的格式
    constructor(complete) {
        this.complete = complete
        this.timeout = null
    }

    /* 
    @end 结束时间戳 记得*1000
    @update 更新回调
    @handle 结束回调
    */

    start(end, update, handle) {
        const now = new Date().getTime();

        if (now > end) {
            handle.call(this)
        } else {
            let _last = end - now

            let _d = Math.floor(_last / D);
            let _h = Math.floor((_last - _d * D) / H);
            let _m = Math.floor((_last - _d * D - _h * H) / M);
            let _s = Math.floor((_last - _d * D - _h * H - _m * M) / S);

            let r = [];

            if (this.complete || _d > 0) {
                r.push(`<em>${_d.toString().padStart(2, '0')}</em>天`);
            }
            if (this.complete || r.length || _h > 0) {
                r.push(`<em>${_h.toString().padStart(2, '0')}</em>时`);
            }
            if (this.complete || r.length || _m > 0) {
                r.push(`<em>${_m.toString().padStart(2, '0')}</em>分`);
            }
            if (this.complete || r.length || _s > 0) {
                r.push(`<em>${_s.toString().padStart(2, '0')}</em>秒`);
            }

            update.call(this, r.join(''))

            this.timeout = setTimeout(() => {
                this.start(end, update, handle)
            }, 1000);

        }

    }

    stop() {
        clearTimeout(this.timeout)
    }
}

export default Timer