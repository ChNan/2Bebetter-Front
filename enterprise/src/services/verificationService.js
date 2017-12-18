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

const REG_D_11 = /^(\d{4}-|\d{3}-)?\d{3,14}$/

const REG_D_64 = /^(\d{4}-|\d{3}-|\d{5}-)?(\d{4}-|\d{3}-|\d{5}-|\d{6}-)?\d{3,64}$/

const PASS = /^(?![a-zA-Z]+$)(?!\d+$)(?![@*_\-.]+$)([a-zA-Z\d@*_\-.]+){8,64}$/;
//密码格式验证
export const validatePass = (rule, value, callback) => {
    if (!value) {
        //不能为空
        callback(new Error(t('validate.word.null')));
    } else if (value.replace(/\s/g, '') !== value) {
        //不能有空额
        callback(new Error(t('validate.word.format.space')));
    } else if (!PASS.test(value)) {
        //符合正则规则
        callback(new Error(t('validate.word.format')));
    } else {
        callback();
    }
};

export const validateTel = (rule, value, callback) => {
    if (value&&!REG_D_64.test(value)) {
        callback(new Error(t('validate.phone.format')));
    } else {
        callback();
    }
};

export const validateEmail = (rule, value, callback) => {
    if (!value) {
        callback(new Error(t('validate.email.null')));
    } else if (!REG_EMAIL.test(value)) {
        callback(new Error(t('validate.email.format')));
    } else {
        callback();
    }
}
