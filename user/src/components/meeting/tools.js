

/*
* dom 方法
* */
export const registerEvent = (o, e, callback) => {
    o.addEventListener(e,callback);
    return F
};

export const removeEvent = (o, e, callback) => {
    o.removeEventListener(e,callback);
    return F
};

export const removeEvents = (arr)=>{
    arr.forEach(item=>{
        removeEvent(item.o,item.e,item.callback)
    });
    return F
};

export const select = (name) => document.querySelector(name);

export const selects = (name) => document.querySelectorAll(name);

/*
*  函数式方法
* */

export const unique = arr => Array.from(new Set(arr));

export const some = exp => arr => arr.some(exp);

export const map = exp => arr => arr.map(exp);

export const reduce = (exp, fir) => arr => arr.reduce(exp, fir);

export const reduceRight = (exp, fir) => arr => arr.reverse().reduce(exp, fir);

export const filter = exp => arr => arr.filter(exp);

export const every = exp => arr => arr.every(exp);

export const compose = (funcs) => {
    let length = funcs.length;
    let index = length;
    while (index--) {
        if (typeof funcs[index] !== 'function') {
            throw new TypeError('Expected a function');
        }
    }
    return (...args) => {
        let index = 0;
        let result = length ? funcs[index].apply(this, args) : args[0];
        while (++index < length) {
            result = funcs[index].call(this, result)
        }
        return result
    }
};
export const composeRight = (funcs) => {
    return compose(funcs.reverse())
};

export const extend = data => JSON.parse(JSON.stringify(data));

const F = {
    unique,
    some,
    every,
    map,
    filter,
    reduce,
    reduceRight,
    registerEvent,
    removeEvent,
    removeEvents,
    compose,
    composeRight,
    select,
    selects,
    extend,
};

export default F
