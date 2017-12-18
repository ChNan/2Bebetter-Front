/*
 * 接口返回格式
 *
 * @code ret 小于0 异常或错误；等于0 没有影响或未知；大于0 影响的行数或成功
 * @data 查询的时候返回的信息
 * @errcode 错误时的状态码
 * @msg 错误的信息
 * */
module.exports = {
    ERR: -1,
    UK: 0,
    OK: 1,
    NOT_ACCEPTABLE: 406,
    CHECKCODE_ERR: 444,
    INTERNAL_ERROR: 500,
    MakeResult: function (code, data, errcode = null, msg = null) {
        let result = {
            ret: code,
            error: {
                errorCode: errcode,
                msg: msg,
                fieldErrors: null
            },
            data: data
        };
        return JSON.stringify(result);
    }
}
