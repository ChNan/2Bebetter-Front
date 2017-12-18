DATA = {
    "receiverScreenSharingStateChanged": false,
    "factoryURI": "",
    "entity": "sip:Conference_55265@chengy-test.5060.space;opaque=app:conf:focus:id:55265",
    "notifyVersion": 149,
    "addmemberMode": 0,
    "state": "partial",
    "hasAV": false,
    "hasAS": false,
    "hasCtrl": false,
    "hasChat": false,
    "uaRolesPri": "presenter", //UA权限  演示者presenter，与会者attendee，观众为castviewer
    "Desc": {
        "avURI": "sip:Conference_55265@chengy-test.5060.space;opaque=app:conf:audio-video:id:55265",
        "focusURI": "sip:Conference_55265@chengy-test.5060.space;opaque=app:conf:focus:id:55265",
        "asURI": "sip:Conference_55265@chengy-test.5060.space;opaque=app:conf:applicationsharing:id:55265",
        "org_uri": "sip:9999@chengy-test.5060.space",
        "org_uid": "62cae516f21a41edb6da860593cead15",
        "org_name": "9999",
        "org_realm": "chengy-test.5060.space", //域 
        "confId": "55265",
        "confNumber": 55265, //会议号码
        "startTime": "2017-09-12 01:00:00", //开始时间   时区根据用户电脑显示
        "expiryTime": "2017-09-12 10:00:00", //结束时间
        "remindEarly": 0,
        "subject": "zjl的视频会议0911", //会议主题
        "profile": "default", //会议模式 普通模式为default，主席模式为demonstrator
        "_startTime": "2017-09-12 01:00:00", //真正开始时间 
    },
    "State": {
        "active": true, //会议状态，true为激活状态；
        "locked": false, // 会议锁住，不再添加成员；
        "policy": "3" //(0)会锁住; （大于0）表示哪些人在会议没有locked锁住时，可以直接加入会议(1) closedAuthenticated：表示演示者邀请的用户;(2) openAuthenticated：表示与组织者同一个域或者联盟内的用户(3) anonymous：表示任何人都可以加入会议；
    },
    "View": {
        "focusLocked": false, //表示Lobby大厅是否开启 
        "videoLayout": "SpeechExcitation", //平等模式Equality，单方全屏Exclusive，语音激励模式SpeechExcitation；（讨论模式）
        "videoMaxView": "1",
        "videoPresenterLayout": "SpeechExcitation",//平等模式Equality，单方全屏Exclusive，语音激励模式SpeechExcitation； （主席模式）
        "videoPresenterMaxView": "1"
    },
    "Users": {
        "participant": 2, //当前人数
        "user": [{
            "entity": "sip:1234@chengy-test.5060.space;gr=urn:uuid:336b17f4-2fde-51cc-8722-aa42c264cd19",
            "displayText": "zjl_test", //名称
            "muteMediaId": "1",
            "mute": "block", //禁言 block禁言 unblock未禁言 unblocking表示举手发言
            "muteBlockBy": "client",
            "estoppel": "unblock", //闭音 block闭音 unblock未闭音 
            "phone": "1234", //号码
            "userAgent": "Yealink VCDesktop 1.23.0.47", //设备信息
            "rolesDemoState": "audience",  // 演讲者demonstrator和观众audience
            "rolesPri": "attendee",//演示者presenter，与会者attendee，观众为castviewer
            "presenterDemostate": "", //表示主席模式下，主持人看到的布局中的演讲者身份演讲者demonstrator和观众audience
            "screenRole": "inactive",
            "applicationsharing": true, //是否分享辅流
            "endpoint": [{
                "entity": "038c2b16-9696-11e7-81ca-799dfdeae206",
                "sessionType": "focus",
                "joiningMethod": "dialed-in",
                "joiningWhen": "2017-09-11 02:07:50",
                "status": "connected"
            }, {
                "entity": "03d72f26-9696-11e7-81d4-799dfdeae206",
                "sessionType": "audio-video",
                "joiningMethod": "dialed-in",
                "joiningWhen": "2017-09-11 02:07:51",
                "status": "connected"
            }]
        }, {
            "entity": "sip:9999@chengy-test.5060.space;gr=urn:uuid:829e232c-916b-44ec-bb42-d1b0b8ccb23f",
            "displayText": "zjl",
            "phone": "9999",
            "userAgent": "Yealink SIP-WEB LIB1.0.0",
            "rolesDemoState": "audience",
            "rolesPri": "presenter",
            "endpoint": [{
                "entity": "3ab4e2ae-96c8-11e7-b0e1-799dfdeae206",
                "sessionType": "focus",
                "joiningMethod": "dialed-in",
                "joiningWhen": "2017-09-11 08:07:18",
                "status": "connected"
            }]
        }]
    }
}

//获取密码接口（账号从前端Session Storage里取）
'/front/getPsw'
// 返回格式{"ret":1,"error":{"errorCode":null,"msg":null,"fieldErrors":null},"data":"OTE4OTA4N2g="}
// ret=1 成功   data为密码base64加密的  用户端解密base64的库已有
// ret=-1 失败 token或session密码不存在   可跳到登录页

import control from '@/services/meetingControl'
//请求会控通道库连接FS，并注册到FS。
//@return {Boolean}  true 成功  false
control.connect({
    username: '9999', //账号
    password: '123456', //密码
    domain: 'chengy-test.5060.space', //域名
    outbound: '10.200.110.209', //制定fs服务器ip，用于开发
    wsServers: 'ws://127.0.0.1:3000/' //ws服务或者wss服务
})

//销毁会议通道库实例，包括销毁已连接的会议，或注销UA。建议离开会控页面时调用。
control.disconnect()

// 连接会议控制通道，并订阅会议通告
control.connectConference({
    number: '76029',
    domain: 'chengy-test.5060.space',
    id: '76029'
})

/**销毁会议控制实例
 * @this {Conference} Get conference information use cccp command
 * @return {[null]}      
 */
control.destroyConferences()

// ui监听会议通知，有通过过来需更新数据
control.conf.on('confUpdate', this._conferenceUpdateListener)

// 邀请人员（不支持批量，一次请求一个人）
// 参数格式  
// sip/h323:'sip:9999(账号)@chengy-test.5060.space（域）'
// sip/h323:10.2.61.167（ip）
control.addUserByDialOut('sip:8888@chengy-test.5060.space')

// 删除会议（清空人员）
control.deleteConference()

//删除会议并释放会议室
control.endConference(entity)

//移除人员
//参数 entity
control.removeMember('sip:9999@chengy-test.5060.space;gr=urn:uuid:f09039fd-27e9-4246-987c-e6ad6062d981')


/**用户角色（主持人、观众）
 * @this {Conference}
 * @description conference modify user role 改变用户角色
 * @param {String} [userEntity] need modify user role
 * @param {String} [userPri] presenter（主持人） or attendee （与会者即访客）
 * @return {Boolean}  
 * modifyUserPremission(userEntity,userPri)
 */
control.modifyUserPremission('sip:8888@chengy-test.5060.space;gr=urn:uuid:336b17f4-2fde-51cc-8722-aa42c264cd19', 'attendee')


/**
 * @this {Conference}
 * @description set conference demonstrator 设置演讲者上下台
 * @param {Object} [options] UI Event demostate： DEMOSTATE.ON/DEMOSTATE.OFF OnDemo表示上台动作，OffDemo表示下台动作
 * @return {Boolean} 
 * setDemonstrator(userEntity, demostate)
 */
control.setDemonstrator('sip:1234@chengy-test.5060.space;gr=urn:uuid:336b17f4-2fde-51cc-8722-aa42c264cd19', 'OffDemo') //OffDemo表示下台动作


/**禁言、闭音
 * @this {Conference}
 * @description modify media block(Mute 禁言), unblock(UnMute 解除禁言), unblocking(apply for speak 申请发言)
 * @param {Object} [options] UI Event type:mute/estoppel; ifilter:block/unblock/unblocking; userEntity: userEntity
 * @return {Boolean} 
 * modifyMemberMedia (options)
 */
control.modifyMemberMedia({
    type: 'estoppel',
    ifilter: 'block',
    userEntity: 'sip:1234@chengy-test.5060.space;gr=urn:uuid:336b17f4-2fde-51cc-8722-aa42c264cd19'
})


/**
 * @this {Conference}
 * @description set all members(demonstrator/audience) mute 全体禁言
 * @param {string} [defIfilter] UI Event block(mute) or unblock(unmute)
 * @return {Boolean} 
 * modifyMembersMute('unblock')
 */
control.modifyMembersMute('defIfilter')


/**
 * @this {Conference}
 * @description lock/unlock conference 锁定/解锁会议
 * @param {string} [string] UI Event  0,1,2,3 （一般只用到0和3）
 * "0", //lock = true  锁定
INVITED: "1", // lock = false, admission-policy = closedAuthenticated
UNION: "2", // lock = false, admission-policy = openAuthenticated
ANY: "3", // lock = false, admission-policy = anonymous   允许任何人加入会议
 * @return {Boolean} 
 * modifyConferenceLock(lockedPolicy)
 */
control.modifyConferenceLock('3')


 /**
 * @this {Conference}
 * @description Modify conference audio-video layout, only switch layout under the normal mode
 * @param {Object} [options] UI Event    1.普通模式下分为等分Equality，语音激励SpeechExcitation(语音激励里根据max-view不同，又分为语音激励和1+N)和一个独占Exclusive布局
2.主席模式(演讲者模式)下主席模式布局Presentation{type: 会议类型 , layout: 布局类型 , viewnum: 当SpeechExcitation需要传1(非必传) } 
目前不支持模式之间相互切换，所以布局切换只在普通模式下三种布局之间切换；
* @return {Boolean} 
* modifyConferenceLayout (options)
*/
control.modifyConferenceLayout({
    type: 'default',
    layout:'SpeechExcitation',
    viewnum: '1'
})