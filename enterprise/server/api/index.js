const express = require('express')
const router = express.Router()
const request = require('request')
const config = require('../config/config')
const svgCaptcha = require('svg-captcha')
const errcode = require('../lib/errcode')
const path = require('path')
const fs = require('fs')
const URL = require('url')
const commom = require('../lib/commom')

module.exports = (app) => {
    app.use('/enterprise', router);
};

// 验证码
router.get("/front/captcha", function (req, res) {
    try {
        var captcha = svgCaptcha.create({
            size: 4, // size of random string
            ignoreChars: '0o1il', // filter out some characters like 0o1i
            noise: 0, // number of noise lines
            color: false, // characters will have distinct colors instead of grey, true if background option is set
            width: 66,
            height: 30,
            fontSize: 38,
            charPreset: '6666'
        });
        req.session.checkcode = captcha.text;
        res.set('Content-Type', 'image/svg+xml');
        if (req.session.count && req.session.count >= 4) {
            res.status(200).send(errcode.MakeResult(errcode.OK, captcha.data));
        } else {
            res.status(200).send(errcode.MakeResult(errcode.UK, captcha.data));
        }
    } catch (e) {
        console.error(e);
        res.send(errcode.MakeResult(errcode.ERR, body, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
    }
});

router.post('/front/login', (req, res) => {
    if (req.session && req.session.count >= 4) {
        let checkcode = req.body.checkcode || '';
        if (checkcode.toLowerCase() != req.session.checkcode.toLowerCase()) {
            return res.send(errcode.MakeResult(errcode.ERR, null, errcode.CHECKCODE_ERR, 'login.auth.error.checkcode'));
        }
    }
    let post_data = {
        'username': req.body.username,
        'password': req.body.password,
    };
    let url = `${req.app.get('SER')}/api/v1/manager/login`;
    let headers = {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'],
        'x-forwarded-for' : commom.getClientIP(req)
    };
    request.post({
        url: url,
        headers: headers,
        body: JSON.stringify(post_data),
        timeout: 8000
    }, function (err, response, body) {
        console.log(`${req.app.get('SER')} => ${body}`)
        if (err) {
            console.error(err)
            return res.send(errcode.MakeResult(errcode.ERR, err, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
        }
        try {
            _body = JSON.parse(body)
            if (_body.ret > 0) {
                req.session.token = _body.data && _body.data.token;
                req.session.count = 0;
                delete _body.data.token;
            } else {
                req.session.count ? req.session.count++ : req.session.count = 1;
            }
            res.send(_body)
        } catch (e) {
            console.error(e);
            res.send(errcode.MakeResult(errcode.ERR, body, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
        }
    });

})
//退出
router.get('/front/logout', (req, res) => {
    try {
        let url = `${req.app.get('SER')}/api/v1/manager/logout?token=${req.session.token}`;
        let headers = {
            'Content-Type': 'application/json',
            'User-Agent': req.headers['user-agent'],
            'x-forwarded-for' : commom.getClientIP(req)
        };
        request.get({
            url: url,
            headers: headers,
            timeout: 8000
        }, function (err, response, body) {
            console.log(`${req.app.get('SER')} => ${body}`)
            if (err) {
                console.error(err)
            }
            req.session.token = null;
            req.session.count = null;
            res.send(body)
        });
    } catch (e) {
        console.error(e);
        res.send(errcode.MakeResult(errcode.ERR, body, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
    }
})
// 找回密码
router.post('/front/forgetPassword', (req, res) => {
    try {
        let checkcode = req.body.captcha || '';
        if (checkcode.toLowerCase() != req.session.checkcode.toLowerCase()) {
            return res.send(errcode.MakeResult(errcode.ERR, null, errcode.CHECKCODE_ERR, 'login.auth.error.checkcode'));
        }
        let url = `${req.app.get('SER')}/api/v1/manager/account/forgetPassword`;
        let headers = {
            'Content-Type': 'application/json',
            'User-Agent': req.headers['user-agent'],
            'x-forwarded-for' : commom.getClientIP(req)
        };
        let post_data = {
            'email': req.body.email
        };
        request.post({
            url: url,
            headers: headers,
            body: JSON.stringify(post_data),
            timeout: 8000
        }, function (err, response, body) {
            console.log(`${req.app.get('SER')} => ${body}`)
            if (err) {
                console.error(err)
                return res.send(errcode.MakeResult(errcode.ERR, err, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
            }
            res.send(body)
        });
    } catch (e) {
        console.error(e);
        res.send(errcode.MakeResult(errcode.ERR, body, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
    }
})
// 企业注册
router.post('/front/enterpriseApply', (req, res) => {
    try {
        let checkcode = req.body.captcha || '';
        if (checkcode.toLowerCase() != req.session.checkcode.toLowerCase()) {
            return res.send(errcode.MakeResult(errcode.ERR, null, errcode.CHECKCODE_ERR, 'login.auth.error.checkcode'));
        }
        let url = `${req.app.get('SER')}/api/v1/manager/enterprise/apply`;
        let headers = {
            'Content-Type': 'application/json',
            'User-Agent': req.headers['user-agent'],
            'x-forwarded-for' : commom.getClientIP(req)
        };
        let post_data = {
            'email': req.body.email
        };
        request.post({
            url: url,
            headers: headers,
            body: JSON.stringify(post_data),
            timeout: 8000
        }, function (err, response, body) {
            console.log(`${req.app.get('SER')} => ${body}`)
            if (err) {
                console.error(err)
                return res.send(errcode.MakeResult(errcode.ERR, err, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
            }
            res.send(body)
        });
    } catch (e) {
        console.error(e);
        res.send(errcode.MakeResult(errcode.ERR, body, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
    }
})
// 导入模板下载
router.get('/front/download/:filename', (req, res) => {
    try {
        const filepath = path.join(config.root, `/templates/${req.params.filename}`)
        const defaultPath = path.join(config.root, `/templates/ImportTemplate-zh-CN.xls`)
        fs.existsSync(filepath) ?
            res.download(filepath, 'ImportTemplate.xls') :
            res.download(defaultPath, 'ImportTemplate.xls')
    } catch (e) {
        console.error(e);
        res.send(errcode.MakeResult(errcode.ERR, body, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
    }
})
// 导入记录下载
router.get('/front/callRecord/export', (req, res) => {
    try {
        let url = `${req.app.get('SER')}/api/v1/manager/callRecord/download${URL.parse(req.url, true).search}`;
        let headers = {
            'Content-Type': 'application/json',
            'User-Agent': req.headers['user-agent'],
            'x-forwarded-for' : commom.getClientIP(req),
            'token': req.session.token
        };
        request.get({
            url: url,
            headers: headers,
            timeout: 8000
        }).pipe(res);
    } catch (e) {
        console.error(e);
        res.send(errcode.MakeResult(errcode.ERR, body, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
    }
})
