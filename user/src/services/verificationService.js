import {
    t
} from '@/i18n/index'

/*
 * ==========公用正则==========
 * */

//用户名的正则
const REG_USN = /^[a-zA-Z0-9_@\-.]{1,}$/
//不能为空的正则
const REG_NOT_NULL = /\S/
//正则邮箱
const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
//5位以下数字
const REG_D_5 = /^\d{1,5}$/

const IP = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)|([a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?)/

//密码8~64位
const PASS = /^(?![a-zA-Z]+$)(?!\d+$)(?![@*_\-.]+$)([a-zA-Z\d@*_\-.]+){8,64}$/;

//密码格式验证
export const validatePass = (rule, value, callback) => {
    if (value != '' && !PASS.test(value)) {
        callback(new Error(t('validate.word.format')));
    } else {
        callback();
    }
};