const express = require('express')
const router = express.Router()
const request = require('request')
const config = require('../config/config')
const errcode = require('../lib/errcode')
const crypto = require('crypto')
const Base64 = require('js-base64').Base64;

module.exports = (app) => {
    app.use('/', router);
};

// Outlook 登录
router.post('/api/v1/outlook/login', (req, res) => {
    let post_data = {
        'username': req.body.username,
        'password': req.body.password
    };
    console.log(req.body.password)
    let url = `${req.app.get('SER')}/api/v1/personal/outlookLogin`;
    let headers = {
        'Content-Type': 'application/json'
    };
    request.post({
        url: url,
        headers: headers,
        body: JSON.stringify(post_data),
        timeout: 8000
    }, function (err, response, body) {
        console.log(req.cookies['meeting.sid'])
        try {
            _body = JSON.parse(body)
            let data = {}
            if (_body.ret > 0) {
                req.session.token = _body.data && _body.data.token;
                // data.sessionId = req.sessionID
                const hash = crypto.createHmac('sha256', 'yealink')
                                    .update(req.sessionID)
                                    .digest('hex')
                data.sessionId = 's:vjECbBe3sly38XSec9D_I_xWoirkZ2xk.2O88ms28OkbDAYIO3+sDE5m0LF2QWqJY0JSfONBISLY'
                console.log(data.sessionId)
                let url = {
                    "conferenceManage": "/meeting/index/ControlList",
                    "bookOrdinary": "/meeting/index/room",
                    "bookVideo": "/meeting/index/reservation",
                    "main": "/meeting"
                }
                data.url = url
                res.send(errcode.MakeResult(errcode.OK, data))
            } else {
                res.send(body)
            }
        } catch (e) {
            console.info('-------------------------------------');
            console.log(e);
            res.send(errcode.MakeResult(errcode.ERR, null, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
            console.info('-------------------------------------\n');
        }
    });
})
// Outlook 主持的会议
router.get('/api/v1/outlook/presidedConference', (req, res) => {
    console.log(req.cookies)
    let url = `${req.app.get('SER')}/api/v1/personal/confOngoing/getListByStaff`;
    let headers = {
        'Content-Type': 'application/json',
        'token': req.session.token
    };
    console.log(req.session.token)
    request.get({
        url: url,
        headers: headers,
        timeout: 8000
    }, function (err, response, body) {
        console.log(body)
        try {
            _body = JSON.parse(body)
            let data = {}
            if (_body.ret > 0) {
                res.send(errcode.MakeResult(errcode.OK, data))
            } else {
                res.send(body)
            }
        } catch (e) {
            console.info('-------------------------------------');
            console.log(e);
            res.send(errcode.MakeResult(errcode.ERR, null, errcode.INTERNAL_ERROR, 'server.common.internal.error'));
            console.info('-------------------------------------\n');
        }
    });
})
