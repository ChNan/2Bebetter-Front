import conferenceChannel from 'conference-channel';
import common from 'conference-channel/dist/util/Common'

//邀请成员
const CONF_DIAL_OUT = '\<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<addUser>\
<conferenceKeys confEntity="{3}"/>\
<user requestUri="{4}"/>\
</addUser>\
</request>';

//批量邀请
const ADD_MULTI_USER = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<addMultiUser>\
<conferenceKeys confEntity="{3}"/>\
<users>{4}<users>\
</addMultiUser> \
</request>';

//获取完整会议信息
const CONF_GETCONFERENCE = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<getConference>\
<conferenceKeys confEntity="{3}">\
</getConference>\
</request>';

//正在进行的会议
const CONF_GETBOOK_RUNNING = '<?xml version="1.0"?>\
<request to="{0}" from="{1}" requestId="{2}">\
<getBookConferencePointRunning>\
<DateTime>{3}</DateTime>\
</getBookConferencePointRunning>\
</request>';

//删除会议
const CONF_DEL_CONFERENCE = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<deleteConference>\
<conferenceKeys confEntity="{3}"/>\
</deleteConference>\
</request>';

// 预约会议立即结束
const CONF_END_CONFERENCE = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<deleteConference>\
<endNow>true</endNow>\
<conferenceKeys confEntity="{3}"/>\
</deleteConference>\
</request>';

// 移除人员
const CONF_DEL_USER = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<deleteUser>\
<userKeys confEntity="{3}" userEntity="{4}"/>\
</deleteUser>\
</request>';

// 改变用户角色
const CONF_MODIFY_USER_ROLE = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<modifyUserRoles>\
<userKeys confEntity="{3}" userEntity="{4}"/>\
<user-roles>\
<entry>{5}</entry>\
</user-roles>\
</modifyUserRoles>\
</request>';

// 修改用户媒体
const CONF_MODIFY_ENDPOINT_MEDIA = '\<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<modifyEndpointMedia mcuUri="{3}">\
<mediaKeys confEntity="{4}" userEntity="{5}" endpointEntity="{6}" mediaId="{7}"/>\
<media id="{8}">\
<type>{9}</type>\
<status>{10}</status>{11}\
</media>\
</modifyEndpointMedia>\
</request>';

// 全体禁言/解禁
const CONF_MODIFY_ALL_USER_MUTE = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<modifyConference>\
<conference-info entity="{3}" state="partial">\
<conference-view>\
<entity-view state="partial" entity="{4}">\
<entity-state>\
<mediaFiltersRules>\
<initialFilters>\
<role>default</role>\
<ingressFilter>{5}</ingressFilter>\
</initialFilters>\
</mediaFiltersRules>\
</entity-state>\
</entity-view>\
</conference-view>\
</conference-info>\
</modifyConference>\
</request>';

//会议锁定/解锁
const CONF_LOCK_CONFERENCE = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<modifyConferenceLock>\
<conferenceKeys confEntity="{3}"/>\
<locked>{4}</locked>\
<admission-policy>{5}</admission-policy>\
</modifyConferenceLock>\
</request>';

//设置演讲者上台、下台
const CONF_SET_DEMONSTRATOR = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<setDemonstrator>\
<conferenceKeys confEntity="{3}"/>\
<userEntity>{4}</userEntity>\
<demoState>{5}</demoState>\
</setDemonstrator>\
</request>';

// 会议布局修改
const CONF_MODIFY_CONFERENCE_LAYOUT = '<?xml version="1.0"?>\
<request version="1" to="{0}" from="{1}" requestId="{2}">\
<modifyConference>\
<conference-info entity="{3}" state="partial">\
<conference-view>\
<entity-view state="partial" entity="{4}">\
<entity-state>{5}</entity-state>\
</entity-view>\
</conference-view>\
</conference-info>\
</modifyConference>\
</request>';

// 可控制会议列表
const CONF_LIST = '<request version="1" to="{0}" from="{1}" requestId="{2}">\
  <getGlobalConferences>\
    <conditions uid="{3}"/>\
  </getGlobalConferences>\
</request>'

// 可控制会议列表即时会议删除
const CONF_VMNDEL = '<request version="1" to="{0}"  from="{1}" requestId="{2}">\
  <endConference>\
    <conferenceKeys confNum="{3}"/>\
  </endConference>\
</request>'

// 可控制会议列表预约会议删除
const CONF_RECODRD_DEL = '<request version="1" to="{0}"  from="{1}" requestId="{2}">\
<endConference>\
<conferenceKeys confNum="{3}" recordId="{4}"/>\
</endConference>\
</request>'

// 主席模式主持人布局演讲者身份
const SET_PRESENTER_DEMONSTRATOR = '<request version="1" to="{0}" from="{1}" requestId="{2}">\
  <setPresenterDemonstrator>\
    <conferenceKeys confEntity="{3}"/>\
    <userEntity>{4}</userEntity>\
    <demoState>{5}</demoState>\
  </setPresenterDemonstrator>\
</request>'
/**
 * conference event use for UI update conference state
 */
const E = {
    DESCRIPTION: 'description',
    CONFSTATE: 'conferenceState',
    VIEWSTATE: 'view',
    USERSTATE: 'user',
};

/**
 * conference profile
 */
const PROFILE = {
    DEFAULT: 'default',
    DEMONSTRATOR: 'demonstrator',
};

/**
 * conference add member mode
 */
const ADDMEMBER = {
    DIAL_OUT: 0,
    DIAL_IN: 1,
};

/**
 * conferece user permission
 */
const USERPRI = {
    ORGANIZER: 'organizer',
    PRESENTER: 'presenter',
    ATTENDEE: 'attendee',
};

/**
 * conference user demostate
 */
const DEMO = {
    DEMONSTRATOR: 'demonstrator',
    AUDIENCE: 'audience',
};

/**
 * conference endpoint media attribute
 */
const MEDIA = {
    MUTE: 'block',
    UNMUTE: 'unblock',
};

/**
 * conference demonstrator state
 */
const DEMOSTATE = {
    ON: 'OnDemo',
    OFF: 'OffDemo',
};

/**
 * conference layout
 */
const LAYOUT = {
    // normal mode
    EQUALITY: 'Equality',
    SPEECH: 'SpeechExcitation',
    EXCLUSIVE: 'Exclusive',
    // presenter mode
    PRESENTER: 'Presentation',
};

/**
 * conference lock limit
 */
const LIMIT = {
    ORGANIZER: "0", // lock = true
    INVITED: "1", // lock = false, admission-policy = closedAuthenticated
    UNION: "2", // lock = false, admission-policy = openAuthenticated
    ANY: "3", // lock = false, admission-policy = anonymous
};

/**
 * parse conference schedule type
 */
const PARSE = {
    RUNNING: 1,
    SCHEDULE: 2,
};

const SESSIONTYPE = {
    AV: 'audio-video',
    FOCUS: 'focus',
    CHAT: 'chat',
    AS: 'applicationsharing'
}

/**
 * @data include audio-video, focus, chat, applicationsharing
 */
function getIndexByChannelName(data) {
    if (data.indexOf(SESSIONTYPE.AV) != -1)
        return 'av';
    else if (data.indexOf(SESSIONTYPE.FOCUS) != -1)
        return 'focus';
    else if (data.indexOf(SESSIONTYPE.CHAT) != -1)
        return 'chat';
    else if (data.indexOf(SESSIONTYPE.AS) != -1)
        return 'as';
    else
        return 'Unknown';
}

class Control {
    constructor() {

        this.conf = null; /*store current conference*/
        this.requestId = 0; /*!< request unique identification */
        this.index = -1; /*!< conference unique identification use difference conference - conference entity attribute */
        this.factoryURI = ''; /*!< factory URI use get focus URI */
        this.focusURI = null; /*!< conference focus uri */
        this.state = '', /*!< subscription conference state, include full, partial and deleted */
        this.nowTime = null,
        this.version = '', /*!< request version */
        this.notifyVersion = 0, /*!< subscrption receive notify information version */
        this.uaRolesPri = USERPRI.ATTENDEE, /*!< our ua roles permission */
        this.uaRolesDemo = DEMO.AUDIENCE, /*!< our ua is demonstrator or audience */
        this.confDesc = { /*!< conference description */
            displayText: '',
            subject: '',
            profile: PROFILE.DEFAULT,
            avURI: '',
            /*!< conference audio-video uri */
            focusURI: '',
            /*!< conference focus uri */
            chatURI: '',
            /*!< conference chat uri */
            asURI: '',
            /*!< conference applicationsharing uri */
            organizer: { /*!< organizer information */
                uri: '',
                /*!< organizer uri sip:username@relam */
                uid: '',
                username: '',
                realm: '',
                displayName: ''
            },
            confId: 0,
            /*!< conference identification */
            confNumber: 0,
            /*!< conference number */
            maxUserCount: 0,
            /*!< allow max user count in conference */
            startTime: '',
            /*!< conference start time */
            expiryTime: '',
            /*!< conference end time */
            remindEarly: 0,
            period: '',
            admissionPolicy: '',
            lobbyCapable: false,
            joinURL: '',
            autopromote: 0,
            serverMode: 0,
        };

        this.confState = {
            active: false,
            locked: false,
            lockedPolicy: LIMIT.ANY

        };

        this.users = {
            participantCount: 0,
            user: {}
        };

        this.confView = {
            focusLocked: false,
            entryExitAnnouncementsEnable: false,
            entryExitAnnouncementsModifiable: false,
            videoLayout: '',
            videoPresenterLayout: '',
            muteAll: false /*!< conference room all audience whether be mute */
        };

        this.ua = null; /*!< store current ua */
        this.subscription = null; /*!< store subscription for conference information */
        this.sessionCtrl = null; /*!< store session ctrl for conference focus session */
        this.sessionAV = null; /*!< store session audio-video for conference audio-video session */
        this.sessionChat = null; /*!< store session chat for conference chat session */
        this.sessionAS = null; /*!< store session applicationsharing for conerence applicationsharing session */
        this.addmemberMode = ADDMEMBER.DIAL_OUT;
    }
    /**
     * 
     * @param {object} options username 用户名 password 密码 domain 域 
     */

    connect(options) {
        const username = options.username;
        const domain = options.domain;
        const password = options.password;
        return new Promise(function (resolve, reject) {
            if (!username || !domain || !password)
                resolve(false)
            conferenceChannel.connect({
                username: username,
                password: password,
                domain: domain,
                outbound: options.outbound,
                wsServers: options.wsServers
            });
            conferenceChannel.on(conferenceChannel.events.CONNECT_WEB_FAILED, function (error) {
                console.log("connect web failed", error.name, error.message);
                resolve(false)
            });
            conferenceChannel.on(conferenceChannel.events.CONNECT_FS_FAILED, function (error) {
                console.log("connect fs failed", error.name, error.message);
                resolve(false)
            });
            conferenceChannel.on(conferenceChannel.events.REGISTER_FS_FAILED, function (error) {
                console.log("register fs failed", error.name, error.message);
                resolve(false)
            });
            conferenceChannel.on(conferenceChannel.events.CONNECT_FS_SUCCESS, function () {
                console.log("connect fs success");
                resolve(true)
            });
        })

    }

    disconnect() {
        conferenceChannel.disconnect();
    }

    connectConference(options) {
        let that = this;
        const number = options.number;
        const domain = options.domain;
        const id = options.id;
        return new Promise(function (resolve, reject) {
            if (!number || !domain || !id)
                resolve(false)
            let focusURI = `sip:Conference_${number}@${domain};opaque=app:conf:focus:id:${id}`;
            conferenceChannel.ua.connectConference({
                focusURI: focusURI
            }).then(function (conf) {
                resolve(true)
                that.conf = conf;
                console.log(conf)
                if (conf.firstNotifyXML) {
                    common.xml2json(conf.firstNotifyXML);
                    that.getConferenceInfoFromObj(common.xml2json(conf.firstNotifyXML))
                }
                conf.on(conferenceChannel.events.CONFERENCE_NOTIFY, function (xml) {
                    common.xml2json(xml);
                    that.getConferenceInfoFromObj(common.xml2json(xml))
                });
            }).catch(function (error) {
                resolve(false)
                console.error("connect conference foucs channel failed ", error.name, error.message);
            });
        })


    }
    /**销毁会议控制实例
     * @this {Conference} Get conference information use cccp command
     * @return {[null]}      
     */
    destroyConferences() {
        // 断开连接初始化数据
        this.conf = null; /*store current conference*/
        this.requestId = 0; /*!< request unique identification */
        this.index = -1; /*!< conference unique identification use difference conference - conference entity attribute */
        this.factoryURI = ''; /*!< factory URI use get focus URI */
        this.focusURI = null; /*!< conference focus uri */
        this.state = '', /*!< subscription conference state, include full, partial and deleted */
            this.version = '', /*!< request version */
            this.notifyVersion = 0, /*!< subscrption receive notify information version */
            this.uaRolesPri = USERPRI.ATTENDEE, /*!< our ua roles permission */
            this.uaRolesDemo = DEMO.AUDIENCE, /*!< our ua is demonstrator or audience */
            this.confDesc = { /*!< conference description */
                displayText: '',
                subject: '',
                profile: PROFILE.DEFAULT,
                avURI: '',
                /*!< conference audio-video uri */
                focusURI: '',
                /*!< conference focus uri */
                chatURI: '',
                /*!< conference chat uri */
                asURI: '',
                /*!< conference applicationsharing uri */
                organizer: { /*!< organizer information */
                    uri: '',
                    /*!< organizer uri sip:username@relam */
                    uid: '',
                    username: '',
                    realm: '',
                    displayName: ''
                },
                confId: 0,
                /*!< conference identification */
                confNumber: 0,
                /*!< conference number */
                maxUserCount: 0,
                /*!< allow max user count in conference */
                startTime: '',
                /*!< conference start time */
                expiryTime: 0,
                /*!< conference end time */
                remindEarly: 0,
                period: '',
                admissionPolicy: '',
                lobbyCapable: false,
                joinURL: '',
                autopromote: 0,
                serverMode: 0,
            };

        this.confState = {
            active: false,
            locked: false,
            lockedPolicy: LIMIT.ANY

        };

        this.users = {
            participantCount: 0,
            user: {}
        };

        this.confView = {
            focusLocked: false,
            entryExitAnnouncementsEnable: false,
            entryExitAnnouncementsModifiable: false,
            videoLayout: '',
            videoPresenterLayout: '',
            muteAll: false /*!< conference room all audience whether be mute */
        };

        this.ua = null; /*!< store current ua */
        this.subscription = null; /*!< store subscription for conference information */
        this.sessionCtrl = null; /*!< store session ctrl for conference focus session */
        this.sessionAV = null; /*!< store session audio-video for conference audio-video session */
        this.sessionChat = null; /*!< store session chat for conference chat session */
        this.sessionAS = null; /*!< store session applicationsharing for conerence applicationsharing session */
        this.addmemberMode = ADDMEMBER.DIAL_OUT;
        conferenceChannel.ua.destroyConferences()
    }

    /**获取会议详细信息
     * @this {Conference} Get conference information use cccp command
     * @return {[null]}      
     */
    getConference = function () {
        const that = this;
        const conf = this.conf;
        const sessionCtrl = conf.sessionCtrl;
        const ua = conf.ua;
        if (!ua || !sessionCtrl)
            return false;
        if (!sessionCtrl.dialog || !sessionCtrl.dialog.remote_target) { // call not estabish
            console.log('getConference failed, call has not been estabished', that);
            return false;
        }
        // if (sessionCtrl.status === SIP.Session.C.STATUS_TERMINATED) { // already hangup
        //     console.log('getConference failed, session was already hangup', that);
        //     return false;
        // }
        const requestId = sessionCtrl.requestId = common.randomNumber(10);
        const from = that.generateCtrlFrom();
        const xmlbody = String.format(CONF_GETCONFERENCE, that.entity, from,
            requestId, that.entity);
        sessionCtrl.sendConfCtrlRequest(xmlbody, function (response) {
            if (!/^2[0-9]{2}$/.test(response.status_code)) {
                return;
            }
            try {
                that.getConferenceInfoFromResponseXML(response.body)

            } catch (e) {
                console.log('getConference parse conference xmlbody fail requestId ', requestId, e);
            }
        });
    }

    /**
     * @this {Conference}
     * @description delete conference 删除会议
     * @return {Boolean} 
     */
    deleteConference = function () {
        const that = this;
        const conf = this.conf;
        const ua = conf.ua;
        const session = conf.sessionCtrl;
        if (!conf || !that.entity || !session)
            return false;
        const requestId = common.randomNumber(10);
        // from format: realm/username
        const from = conf.generateCtrlFrom();
        const xmlbody = String.format(CONF_DEL_CONFERENCE, that.entity, from, requestId, that.entity);
        session.sendConfCtrlRequest(xmlbody, (res) => {
            const resBody = common.xml2json(res.body);
            let code;
            if (resBody && resBody['response'])
                code = resBody['response']['$code'];
            if (code === 'success')
                return true
            else
                return false;
        });
        return true;
    };

    /**
     * @this {Conference}
     * @description delete conference 预约会议立即结束
     * @return {Boolean} 
     */
    endConference = function () {
        const that = this;
        const conf = this.conf;
        const ua = conf.ua;
        const session = conf.sessionCtrl;
        if (!conf || !that.entity || !session)
            return false;
        const requestId = common.randomNumber(10);
        // from format: realm/username
        const from = conf.generateCtrlFrom();
        const xmlbody = String.format(CONF_END_CONFERENCE, that.entity, from, requestId, that.entity);
        session.sendConfCtrlRequest(xmlbody, (res) => {
            const resBody = common.xml2json(res.body);
            let code;
            if (resBody && resBody['response'])
                code = resBody['response']['$code'];
            if (code === 'success')
                return true
            else
                return false;
        });
        return true;
    };

    /**获取正在进行的会议
     * @this {Conference} Get conference information use cccp command
     * @return {[null]}      
     */
    getBookConferencePointRunning() {
        const ua = conferenceChannel.ua;
        return new Promise(function (resolve, reject) {
            const extraHeaders = [];
            const requestId = common.randomNumber(10);
            const from = ua.generateFrom();
            const xmlbody = String.format(CONF_GETBOOK_RUNNING, '', from, requestId, common.toUTCString());

            extraHeaders.push('Content-Type: application/conference-ctrl+xml');
            const serv = ua.service(ua.sipInfo.uri, "conference", {
                extraHeaders: extraHeaders,
                body: xmlbody
            });

            serv.on('service_ok', function bookPointRunningResponse(response, cause) {
                const obj = common.xml2json(response.body);
                const res = obj.response;

                if (common.isUndefined(res)) {
                    console.warn("=== book point running invalid response", obj);
                    return resolve(null);
                }

                if (requestId != res.$requestId || res.$code != 'success') {
                    console.warn("=== book point running requestId: " + requestId + " res.$requestId: " + res.$requestId + " code: " + res.$code);
                    return resolve(null);
                }

                const pointrunning = res['getBookConferencePointRunning'];
                if (common.isUndefined(pointrunning)) {
                    console.warn("=== book point running getBookConferencePointRunning undefined");
                    return resolve(null);
                }

                const state = pointrunning['state'];
                if (state && (state === 'nullResult' || state === 'nullUpdate')) {
                    console.log("=== book point running nullResult/nullUpdate");
                    return resolve(null);
                }

                console.log(obj)

            });
        });
    }

    /**批量邀请人员
     * @this {Conference} Get conference information use cccp command
     *  sip/h323:'sip:9999@chengy-test.5060.space'
     * sip/h323:10.2.61.167
     * @return {[null]}      
     */
    addMultiUser = function (ARR_URI) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        const confEntity = that.entity;
        const session = conf.sessionCtrl;
        let users = [];
        if(ARR_URI instanceof Array && ARR_URI.length > 0) {
            ARR_URI.forEach((val, i ,arr )=> {
                users.push(`<user requestUri="${val}"/>`)
            })
        } else {
            return false;
        }
        return new Promise(function (resolve, reject) {
            if (!conf || !confEntity || !users.length == 0 || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(ADD_MULTI_USER, confEntity, from,
                requestId, confEntity, users);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success' || code === 'pending')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    }
    /**邀请人员
     *  sip/h323:'sip:9999@chengy-test.5060.space'
     * sip/h323:10.2.61.167
     * @return {[null]}      
     */
    addUserByDialOut = function (userURI) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        const confEntity = that.entity;
        const session = conf.sessionCtrl;
        return new Promise(function (resolve, reject) {
            if (!conf || !confEntity || !userURI || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(CONF_DIAL_OUT, confEntity, from,
                requestId, confEntity, userURI);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success' || code === 'pending')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    }

    /**
     * @this {Conference}
     * @description conference remove member 移除人员
     * @param {String} [userEntity] need remove user uri 
     * sip:9999@chengy-test.5060.space;gr=urn:uuid:161edce9-1385-4ecd-82d9-857c088390ba
     * @return {Boolean} 
     */
    removeMember = function (userEntity) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        const confEntity = that.entity;
        const session = conf.sessionCtrl;
        return new Promise(function (resolve, reject) {
            if (!conf || !confEntity || !userEntity || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(CONF_DEL_USER, confEntity, from,
                requestId, confEntity, userEntity);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    };

    /**用户角色（主持人、观众）
     * @this {Conference}
     * @description conference modify user role 改变用户角色
     * @param {String} [userEntity] need modify user role
     * @param {String} [userPri] presenter or attendee 
     * @return {Boolean} 
     */
    modifyUserPremission = function (userEntity, userPri) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        const session = conf.sessionCtrl;
        return new Promise(function (resolve, reject) {
            if (!conf || !that.entity || !userEntity || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(CONF_MODIFY_USER_ROLE, that.entity, from,
                requestId, that.entity, userEntity, userPri);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    };

    /**
     * @this {Conference}
     * @description set conference demonstrator 设置演讲者上下台
     * @param {Object} [options] UI Event demostate： DEMOSTATE.ON/DEMOSTATE.OFF OnDemo表示上台动作，OffDemo表示下台动作
     * @return {Boolean} 
     */
    setPresenterDemonstrator = function (userEntity, demostate) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        const session = conf.sessionCtrl;
        return new Promise(function (resolve, reject) {
            if (!conf || !that.entity || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(SET_PRESENTER_DEMONSTRATOR, that.entity, from, requestId,
                that.entity, userEntity, demostate);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    };

     /**
     * @this {Conference}
     * @description set conference presenter demonstrator 表示主席模式下，主持人看到的布局中的演讲者身份
     * @param {Object} [options] UI Event demostate： DEMOSTATE.ON/DEMOSTATE.OFF OnDemo表示上台动作，OffDemo表示下台动作
     * @return {Boolean} 
     */
    setDemonstrator = function (userEntity, demostate) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        const session = conf.sessionCtrl;
        return new Promise(function (resolve, reject) {
            if (!conf || !that.entity || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(CONF_SET_DEMONSTRATOR, that.entity, from, requestId,
                that.entity, userEntity, demostate);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    };

    /**禁言、闭音
     * @this {Conference}
     * @description modify media block(Mute), unblock(UnMute), unblocking(apply for speak)
     * @param {Object} [options] UI Event type:mute/estoppel; ifilter:block/unblock/unblocking; userEntity: userEntity
     * @return {Boolean} 
     */
    modifyMemberMedia = function (options) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        const userEntity = options.userEntity;
        const ifilter = options.ifilter; // MEDIA.MUTE/MEDIA.UNMUTE
        let endpoint, uuid, mediaId, tpl;
        return new Promise(function (resolve, reject) {
            if (options.type == 'mute') {
                tpl = `<media-ingress-filter>${ifilter}</media-ingress-filter>`
            } else if (options.type == 'estoppel') {
                tpl = `<media-egress-filter>${ifilter}</media-egress-filter>`
            } else {
                resolve(false)
            }

            if (!conf || !that.entity || !conf.sessionCtrl) {
                resolve(false)
            }
            endpoint = that.getEndpointBySessionType(userEntity, 'audio-video');
            if (!endpoint) {
                resolve(false)
            }

            const session = conf.sessionCtrl;
            const requestId = common.randomNumber(10);
            const mcuURI = that.confDesc.avURI;
            let status = 'recvonly',
                sessionType = 'audio';
            uuid = endpoint.uuid;
            mediaId = that.users.user[userEntity].muteMediaId;
            if (ifilter === MEDIA.MUTE) {
                status = 'sendrecv';
            }
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(CONF_MODIFY_ENDPOINT_MEDIA, that.entity, from, requestId, mcuURI,
                that.entity, userEntity, uuid, mediaId, mediaId, sessionType, status, tpl);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success')
                    resolve(true)
                else
                    resolve(false)
            });
        });
        // conf.sessionAV.muteLocalMedia(ifilter === MEDIA.MUTE ? true : false, 'audio');
    };

    /**
     * @this {Conference}
     * @description set all members(demonstrator/audience) mute 全体禁言
     * @param {string} [defIfilter] UI Event block(mute) or unblock(unmute)
     * @return {Boolean} 
     */
    modifyMembersMute = function (defIfilter) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        // if you want to set all members mute, you can set demoIfilter=MUTE and defIfilter=MUTE
        const session = conf.sessionCtrl;
        return new Promise(function (resolve, reject) {
            if (!conf || !that.entity || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            const mcuURI = that.confDesc.avURI;
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(CONF_MODIFY_ALL_USER_MUTE, that.entity, from, requestId, that.entity, mcuURI,
                defIfilter);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    };

    /**
     * @this {Conference}
     * @description lock/unlock conference 锁定/解锁会议
     * @param {string} [options] UI Event  0,1,2,3
     * @return {Boolean} 
     */
    modifyConferenceLock = function (lockedPolicy) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        const session = conf.sessionCtrl;
        let policytext = "";
        let locked = "false";
        return new Promise(function (resolve, reject) {
            if (!conf || !that.entity || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            switch (lockedPolicy) {
                case LIMIT.ORGANIZER:
                    locked = "true";
                    break;
                case LIMIT.INVITED:
                    locked = "false";
                    policytext = "closedAuthenticated";
                    break;
                case LIMIT.UNION:
                    locked = "false";
                    policytext = "openAuthenticated";
                    break;
                case LIMIT.ANY:
                    locked = "false";
                    policytext = "anonymous";
                    break;
            }
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(CONF_LOCK_CONFERENCE, that.entity, from, requestId,
                that.entity, locked, policytext);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    };

    /**
     * @this {Conference}
     * @description Modify conference audio-video layout, only switch layout under the normal mode
     * @param {Object} [options] UI Event    1.普通模式下分为等分Equality，语音激励SpeechExcitation(语音激励里根据max-view不同，又分为语音激励和1+N)和一个独占Exclusive布局{type: , layout: , viewnum: }
    2.主席模式(演讲者模式)下主席模式布局Presentation
    目前不支持模式之间相互切换，所以布局切换只在普通模式下三种布局之间切换；

    * @return {Boolean} 
    */
    modifyConferenceLayout = function (options) {
        const conf = this.conf;
        const that = this;
        const ua = conf.ua;
        // LAYOUT.EQUALITY/LAYOUT.SPEECH/LAYOUT.EXCLUSIVE
        const session = conf.sessionCtrl;
        return new Promise(function (resolve, reject) {
            if (!conf || !that.entity || !session)
                resolve(false)
            const requestId = common.randomNumber(10);
            const mcuURI = that.confDesc.avURI;
            let tpl;
            if (options.type == 'default') {
                tpl = `<video-layout>${options.layout}</video-layout>`
                if (options.layout == 'SpeechExcitation' && options.viewnum == '1') {
                    tpl = `${tpl}<video-max-view>1</video-max-view>`
                }
            } else if (options.type == 'demonstrator') {
                tpl = `<video-presenter-layout>${options.layout}</video-presenter-layout>`
                if (options.layout == 'SpeechExcitation' && options.viewnum == '1') {
                    tpl = `${tpl}<video-presenter-max-view>1</video-presenter-max-view>`
                }
            }
            // from format: realm/username
            const from = that.generateCtrlFrom();
            const xmlbody = String.format(CONF_MODIFY_CONFERENCE_LAYOUT, that.entity, from, requestId,
                that.entity, mcuURI, tpl);
            session.sendConfCtrlRequest(xmlbody, (res) => {
                const resBody = common.xml2json(res.body);
                let code;
                if (resBody && resBody['response'])
                    code = resBody['response']['$code'];
                if (code === 'success')
                    resolve(true)
                else
                    resolve(false)
            });
        });
    };

    /**获取可控制的会议
     * @this {Conference} Get conference information use cccp command
     * @return {[null]}      
     */
    getGlobalConferences(userUid) {
        const ua = conferenceChannel.ua;
        const that = this;
        return new Promise(function (resolve, reject) {
            const extraHeaders = [];
            const requestId = common.randomNumber(10);
            const from = ua.generateFrom();
            const xmlbody = String.format(CONF_LIST, '', from, requestId, userUid);

            extraHeaders.push('Content-Type: application/conference-ctrl+xml');
            const serv = ua.service(ua.sipInfo.uri, "conference", {
                extraHeaders: extraHeaders,
                body: xmlbody
            });
            serv.on('service_ok', function globalConferencesResponse(response, cause) {
                const obj = common.xml2json(response.body);
                const res = obj.response;

                if (common.isUndefined(res)) {
                    console.warn("=== Controllable meetings invalid response", obj);
                    return resolve(null);
                }

                if (requestId != res.$requestId || res.$code != 'success') {
                    console.warn("=== Controllable meetings requestId: " + requestId + " res.$requestId: " + res.$requestId + " code: " + res.$code);
                    return resolve(null);
                }

                const canControlList = res['getGlobalConferences'];
                if (that.isEmptyObject(canControlList)) {
                    console.log("=== Controllable meetings null");
                    return resolve(null);
                }

                return resolve(that.parseObjControlList(canControlList));

            });
        });
    }
    /**
     * @this {Conference}删除会议列表的即时会议
     * @return {[null]}      
     */
    delVMN(confNum) {
        const ua = conferenceChannel.ua;
        const that = this;
        return new Promise(function (resolve, reject) {
            const extraHeaders = [];
            const requestId = common.randomNumber(10);
            const from = ua.generateFrom();
            const xmlbody = String.format(CONF_VMNDEL, '', from, requestId, confNum);

            extraHeaders.push('Content-Type: application/conference-ctrl+xml');
            const serv = ua.service(ua.sipInfo.uri, "conference", {
                extraHeaders: extraHeaders,
                body: xmlbody
            });
            serv.on('service_ok', function delVMNResponse(response, cause) {
                const obj = common.xml2json(response.body);
                const res = obj.response;

                if (common.isUndefined(res)) {
                    console.warn("=== deleted VMN invalid response", obj);
                    return resolve(null);
                }
                if (requestId != res.$requestId || res.$code != 'success') {
                    console.warn("=== deleted VMN requestId: " + requestId + " res.$requestId: " + res.$requestId + " code: " + res.$code);
                    return resolve(null);
                }
                if (res.$code == 'success') {
                    return resolve(true);
                }
            });
        });
    }

        /**
     * @this {Conference}删除会议列表的预约会议
     * @return {[null]}      
     */
    delRecord(confNum, recordId) {
        const ua = conferenceChannel.ua;
        const that = this;
        return new Promise(function (resolve, reject) {
            const extraHeaders = [];
            const requestId = common.randomNumber(10);
            const from = ua.generateFrom();
            const xmlbody = String.format(CONF_RECODRD_DEL, '', from, requestId, confNum, recordId);

            extraHeaders.push('Content-Type: application/conference-ctrl+xml');
            const serv = ua.service(ua.sipInfo.uri, "conference", {
                extraHeaders: extraHeaders,
                body: xmlbody
            });
            serv.on('service_ok', function delRecordesponse(response, cause) {
                const obj = common.xml2json(response.body);
                const res = obj.response;

                if (common.isUndefined(res)) {
                    console.warn("=== deleted Record invalid response", obj);
                    return resolve(null);
                }
                if (requestId != res.$requestId || res.$code != 'success') {
                    console.warn("=== deleted Record requestId: " + requestId + " res.$requestId: " + res.$requestId + " code: " + res.$code);
                    return resolve(null);
                }
                if (res.$code == 'success') {
                    return resolve(true);
                }
            });
        });
    }

    /**解析会议信息
     * @this {Conference} 
     * @param {xmlbody} [notify xmlbody or response xmlbody]
     * @param {Object} [obj] [top level <conference-info> ]
     * @return {Boolean} update conference in ua conferences by xmlbody
     */
    getConferenceInfoFromObj = function (obj) {
        "use strict";
        const conf = this,
            ua = conf.conf.ua;
        const objConfInfo = obj['conference-info'];
        let currentConf, notifyVersion;
        if (common.isUndefined(objConfInfo)) {
            return false;
        }

        notifyVersion = Number(objConfInfo.$version);
        conf.entity = objConfInfo.$entity;
        currentConf = conf;
        /**
         * rfc4575#session-4.4
         * receive the document version is equal to or less than the local version,
         * the document is discarded without processing
         */
        // if (notifyVersion < currentConf.notifyVersion) {
        //     console.warn("receive the document version(", +notifyVersion + ") is equal to or less than the local version(" + currentConf.notifyVersion + ").");
        //     return true;
        // }
        /**
         * if the 'version' number in the received document is more than one number
         * higher than the previous local version number, the subscriber MUST gennerate a
         * subscription refresh request to trigger a full state notification
         */
        if ((notifyVersion - currentConf.notifyVersion > 1) && currentConf.notifyVersion != 0) {
            // set empty conference users
            currentConf.users = {
                participantCount: 0,
                user: {}
            };
            conf.getConference();
            console.warn("receive the document version(", +notifyVersion + ") is more than one number higher than local version(" + currentConf.notifyVersion + ").");
            return true;
        }
        currentConf.entity = objConfInfo.$entity;
        currentConf.state = objConfInfo.$state;
        currentConf.nowTime = objConfInfo['now-time'];
        // 会议删除判断
        // if (currentConf.state === 'deleted') {
        //     conf.disconnect()
        //     console.log('conference deleted')
        //     return true;
        // }

        conf.receiverScreenSharingStateChanged = false;
        // handle all xml attribute use full type        
        getConferenceDescription(conf, objConfInfo); // get conference description information   
        getConferenceState(conf, objConfInfo); // get conference state information 
        getLockedPolicy(conf); // get conference lock policy always update, because locked and prolicy is separated   
        getConferenceUsers(conf, objConfInfo); // get users information  
        getConferenceView(conf, objConfInfo); // get conference view information
        currentConf.notifyVersion = notifyVersion; // set current notify version
        // conf.conf.emit('confUpdate', currentConf.toString()); //UI change
        conferenceChannel.eventEmitter.emit('confUpdate', currentConf.toString()); //UI change
        console.log(currentConf)
        return true;

        /**
         * private
         */
        function getConferenceDescriptionURIs(conf, objConfDesc) {
            const objConfURIs = objConfDesc['conf-uris'];
            if (!common.isUndefined(objConfURIs)) {
                const entry = common.convertJson2Array(objConfURIs['entry']);
                for (let i = 0; i < entry.length; i++) {
                    const curConfURIEntry = entry[i];
                    const purpose = curConfURIEntry['purpose'];
                    if (common.isUndefined(purpose))
                        continue;
                    const uri = curConfURIEntry['uri'];
                    if (common.isUndefined(uri))
                        continue;
                    if (purpose === SESSIONTYPE.FOCUS) {
                        conf.confDesc.focusURI = uri;
                    } else if (purpose === SESSIONTYPE.AV) {
                        conf.confDesc.avURI = uri;
                    } else if (purpose === SESSIONTYPE.CHAT) {
                        conf.confDesc.chatURI = uri;
                    } else if (purpose === SESSIONTYPE.AS) {
                        conf.confDesc.asURI = uri;
                    }
                }

            }
        }

        /**
         * private
         */
        function getLockedPolicy(conf) {
            if (conf.confState.locked) {
                conf.confState.lockedPolicy = LIMIT.ORGANIZER;
            } else {
                if (conf.confDesc.admissionPolicy == 'closedAuthenticated') {
                    conf.confState.lockedPolicy = LIMIT.INVITED;
                } else if (conf.confDesc.admissionPolicy == 'openAuthenticated') {
                    conf.confState.lockedPolicy = LIMIT.UNION;
                } else if (conf.confDesc.admissionPolicy == 'anonymous') {
                    conf.confState.lockedPolicy = LIMIT.ANY;
                } else {
                    conf.confState.lockedPolicy = LIMIT.ANY;
                }
            }
        }

        /**
         * general state is full
         * private 
         */
        function getConferenceDescription(conf, objConfInfo) {
            
            const objConfDesc = objConfInfo['conference-description'];
            if (common.isUndefined(objConfDesc))
                return;

            const displayText = objConfDesc['display-text'];
            if (!common.isUndefined(displayText)) {
                conf.confDesc.displayText = displayText;
            }
            const subject = objConfDesc['subject'];
            if (!common.isUndefined(subject)) {
                conf.confDesc.subject = subject;
            }
            const scheduleId = objConfDesc['schedule-id'];
            if (!common.isUndefined(scheduleId)) {
                conf.confDesc.scheduleId = scheduleId;
            }
            const profile = objConfDesc['profile'];
            if (!common.isUndefined(profile)) {
                conf.confDesc.profile = profile;
            }
            getConferenceDescriptionURIs(conf, objConfDesc);
            const organizer = objConfDesc['organizer'];
            if (!common.isUndefined(organizer)) {
                const displayName = organizer['display-text'];
                if (!common.isUndefined(displayName)) {
                    conf.confDesc.organizer.displayName = displayName;
                }
                const uid = organizer['uid'];
                if (!common.isUndefined(uid)) {
                    conf.confDesc.organizer.uid = uid;
                }
                const username = organizer['username'];
                const realm = organizer['realm'];
                if (!common.isUndefined(username) && !common.isUndefined(realm)) {
                    conf.confDesc.organizer.username = username;
                    conf.confDesc.organizer.realm = realm;
                    conf.confDesc.organizer.uri = 'sip:' + username + '@' + realm;
                }
            }
            const confType = objConfDesc['conference-type'];
            if (!common.isUndefined(confType)) {
                conf.confDesc.confType = confType;
            }
            const confId = objConfDesc['conference-id'];
            if (!common.isUndefined(confId)) {
                conf.confDesc.confId = confId;
            }
            const confNumber = objConfDesc['conference-number'];
            if (!common.isUndefined(confNumber)) {
                conf.confDesc.confNumber = confNumber;
            }
            const presenterPin = objConfDesc['presenter-pin'];
            if (!common.isUndefined(presenterPin)) {
                conf.confDesc.presenterPin = presenterPin;
            }
            const attendeePin = objConfDesc['attendee-pin'];
            if (!common.isUndefined(attendeePin)) {
                conf.confDesc.attendeePin = attendeePin;
            }
            const maxUserCount = objConfDesc['maximum-user-count'];
            if (!common.isUndefined(maxUserCount)) {
                conf.confDesc.maxUserCount = maxUserCount;
            }
            const startTime = objConfDesc['book-start-time'];
            if (!common.isUndefined(startTime)) {
                conf.confDesc.startTime = startTime;
            }
            const expiryTime = objConfDesc['book-expiry-time'];
            if (!common.isUndefined(expiryTime)) {
                conf.confDesc.expiryTime = expiryTime;
            }
            const _startTime = objConfDesc['start-time'];
            if (!common.isUndefined(_startTime)) {
                conf.confDesc._startTime = _startTime;
            }
            const remindEarly = objConfDesc['remind-early'];
            if (!common.isUndefined(remindEarly)) {
                conf.confDesc.remindEarly = remindEarly;
            }
            const createearly = objConfDesc['create-early'];
            if (!common.isUndefined(createearly)) {
                conf.confDesc.createearly = createearly;
            }
            const admissionPolicy = objConfDesc['admission-policy'];
            if (!common.isUndefined(admissionPolicy)) {
                conf.confDesc.admissionPolicy = admissionPolicy;
            }
            const lobbyCapable = objConfDesc['lobby-capable'];
            if (!common.isUndefined(lobbyCapable)) {
                conf.confDesc.lobbyCapable = common.str2bool(lobbyCapable);
            }
            const joinURL = objConfDesc['join-url'];
            if (!common.isUndefined(joinURL)) {
                conf.confDesc.joinURL = joinURL;
            }
            const autopromote = objConfDesc['autopromote'];
            if (!common.isUndefined(autopromote)) {
                conf.confDesc.autopromote = autopromote;
            }
            const serverMode = objConfDesc['server-mode'];
            if (!common.isUndefined(serverMode)) {
                conf.confDesc.serverMode = serverMode;
            }

        }

        /**
         * general state is full
         * private 
         */
        function getConferenceState(conf, objConfInfo) {
            const objConfState = objConfInfo['conference-state'];
            if (common.isUndefined(objConfState))
                return;
            const active = objConfState['active'];
            if (!common.isUndefined(active)) {
                conf.confState.active = common.str2bool(active);
            }
            const locked = objConfState['locked'];
            if (!common.isUndefined(locked)) {
                conf.confState.locked = common.str2bool(locked);
            }
        }

        /**
         * private
         */
        function parseUserRoles(conf, userEntity, objRoles) {
            if (common.isUndefined(objRoles))
                return;
            const entry = common.convertJson2Array(objRoles['entry']);
            const userURI = conf.users.user[userEntity].uri;

            for (let i = 0; i < entry.length; i++) {
                const curUserRole = entry[i];
                const entity = curUserRole['$entity'];
                const text = curUserRole['__text'];
                if (entity === 'permission') {
                    conf.users.user[userEntity].rolesPri = text;
                    if (userEntity == ua.userEntity) { // our ua permission
                        conf.uaRolesPri = text;
                    }
                    if (!common.isUndefined(userURI)) {
                        if (userURI == conf.confDesc.organizer.uri && text === USERPRI.PRESENTER) { // current user is organizer
                            conf.users.user[userEntity].rolesPri = USERPRI.ORGANIZER;
                        }
                    }
                } else if (entity === 'demostate') {
                    conf.users.user[userEntity].rolesDemoState = text;
                    if (userEntity == ua.sipInfo.userEntity) { // our ua demonstrator or audience
                        conf.uaRolesDemo = text;
                    }
                } else if (entity === 'presenter-demostate') {
                    conf.users.user[userEntity].presenterDemostate = text;
                }
            }
        }

        /**
         * private
         */
        function parseMediaInfo(conf, userEntity, sessionType, objMedia) {
            const medias = common.convertJson2Array(objMedia);
            for (let i = 0; i < medias.length; i++) {
                const curMedia = medias[i];
                const mediaType = curMedia['type'];
                if (common.isUndefined(mediaType))
                    continue;
                if (mediaType == 'audio' && sessionType === SESSIONTYPE.AV) {
                    if (!common.isUndefined(curMedia['media-ingress-filter'])) {
                        const muteBlockby = curMedia['media-ingress-filter']['$blockby'];
                        // const estoppelBlockBy = curMedia['media-egress-filter']['$blockby'];
                        if (common.isUndefined(muteBlockby)) {
                            conf.users.user[userEntity].mute = curMedia['media-ingress-filter'];
                        } else {
                            conf.users.user[userEntity].mute = curMedia['media-ingress-filter']['__text'];
                            conf.users.user[userEntity].muteBlockBy = muteBlockby;
                        }
                        // if (common.isUndefined(estoppelBlockBy)) {
                        //     conf.users.user[userEntity].estoppel = curMedia['media-egress-filter'];
                        // } else {
                        //     conf.users.user[userEntity].estoppel = curMedia['media-egress-filter']['__text'];
                        //     conf.users.user[userEntity].estoppelBlockBy = estoppelBlockBy;
                        // }
                        conf.users.user[userEntity].muteMediaId = curMedia['$id'];
                    }
                } else if (mediaType == 'video' && sessionType === SESSIONTYPE.AV) {
                    if (curMedia['label'] == 'applicationsharing' && conf.users.user[userEntity].screenRole != curMedia['status']) {
                        console.debug("endpoint mediaType changed(bfcp): ", conf.users.user[userEntity].displayText, conf.users.user[userEntity].screenRole, curMedia['status']);
                        conf.users.user[userEntity].screenRole = curMedia['status'];
                        conf.receiverScreenSharingStateChanged = true;
                    }
                } else if (mediaType == 'video' && sessionType === SESSIONTYPE.AS) {
                    console.debug("endpoint mediaType changed(invite): ", conf.users.user[userEntity].displayText, conf.users.user[userEntity].screenRole, curMedia['status']);
                    if (conf.users.user[userEntity].screenRole != curMedia['status']) {
                        conf.users.user[userEntity].screenRole = curMedia['status'];
                        conf.receiverScreenSharingStateChanged = true;
                    }
                }
                if( (sessionType === SESSIONTYPE.AV && curMedia['$id'] === '3') || (sessionType === SESSIONTYPE.AS && curMedia['$id'] === '3') ) {
                    if ( curMedia['status'] == 'sendonly') {
                        conf.users.user[userEntity].applicationsharing = true;
                    } else if ( curMedia['status'] == 'sendonly') {
                        conf.users.user[userEntity].applicationsharing = true;
                    } else  {
                        conf.users.user[userEntity].applicationsharing = false;
                    }
                }
            }

        }

        /**
         * [parseConferenceUser parse users's user]
         * @param  {[Object]} conf             [current conference information object]
         * @param  {[Object]} objUser          [user object from xmlbody]
         * @param  {[String]} usersState       [users's state]
         * @param  {[Number]} participantCount [users's participant count]
         * @return {[null]}            
         */
        function parseConferenceUser(conf, objUser, usersState, participantCount) {
            const userEntity = objUser['$entity'];
            const userState = objUser['$state'];
            let isNewUser = false;

            if (common.isUndefined(userEntity))
                return;
            const oldUser = conf.users.user[userEntity];
            if (!oldUser && userState === 'partial') { // A member of the do not calculate before we enter the meeting
                isNewUser = true;
            }
            conf.users.user[userEntity] = conf.users.user[userEntity] || {};
            conf.users.user[userEntity].userEntity = userEntity;
            if (userState === 'deleted') {
                // conf.emit('userRemoved', oldUser);
                conf.receiverScreenSharingStateChanged = true;
                delete conf.users.user[userEntity];
                return;
            }
            // basic info
            const displayText = objUser['display-text'];
            if (!common.isUndefined(displayText)) {
                conf.users.user[userEntity].displayText = displayText;
            }
            const uid = objUser['uid'];
            if (!common.isUndefined(uid)) {
                conf.users.user[userEntity].uid = uid;
            }
            const username = objUser['username'];
            const realm = objUser['realm'];
            if (!common.isUndefined(username) && !common.isUndefined(realm)) {
                conf.users.user[userEntity].username = username.trim();
                conf.users.user[userEntity].realm = realm.trim();
                conf.users.user[userEntity].uri = 'sip:' + username + '@' + realm;
            }
            const phone = objUser['phone'];
            if (!common.isUndefined(phone)) {
                conf.users.user[userEntity].phone = phone;
            }
            const userAgent = objUser['user-agent'];
            if (!common.isUndefined(userAgent)) {
                conf.users.user[userEntity].userAgent = userAgent;
            }
            // roles
            parseUserRoles(conf, userEntity, objUser['roles']);
            // endpoint 
            const endpoint = common.convertJson2Array(objUser['endpoint']);
            for (let i = 0; i < endpoint.length; i++) {
                const curEndpoint = endpoint[i];
                const endState = curEndpoint['$state'];
                const sessionType = curEndpoint['$session-type'];
                const id = curEndpoint['$entity'];

                if (common.isUndefined(id))
                    continue;

                conf.users.user[userEntity].endpoint = conf.users.user[userEntity].endpoint || {};
                conf.users.user[userEntity].endpoint[id] = conf.users.user[userEntity].endpoint[id] || {};
                if (endState === 'deleted') {
                    if (conf.users.user[userEntity].endpoint[id].sessionType == SESSIONTYPE.AS) {
                        conf.users.user[userEntity].screenRole = 'inactive';
                    }
                    conf.receiverScreenSharingStateChanged = true;
                    delete conf.users.user[userEntity].endpoint[id];
                    continue;
                }

                conf.users.user[userEntity].endpoint[id].sessionType = sessionType;
                conf.users.user[userEntity].endpoint[id].uuid = curEndpoint['$entity'];
                const status = curEndpoint['status'];
                if (!common.isUndefined(status)) {
                    conf.users.user[userEntity].endpoint[id].status = status;
                }
                const joiningMethod = curEndpoint['joining-method'];
                if (!common.isUndefined(joiningMethod)) {
                    conf.users.user[userEntity].endpoint[id].joiningMethod = joiningMethod;
                }
                const joiningInfo = curEndpoint['joining-info'];
                if (!common.isUndefined(joiningInfo)) {
                    const when = joiningInfo['when'];
                    if (!common.isUndefined(when)) {
                        conf.users.user[userEntity].endpoint[id].joiningWhen = when;
                    }
                }
                // parse media info 
                parseMediaInfo(conf, userEntity, sessionType, curEndpoint['media']);
            }

            if (isNewUser) {
                // conf.emit('userAdd', conf.users.user[userEntity]);
            }
        }

        /**
         * private
         * state could be full, partial, deleted
         */
        function getConferenceUsers(conf, objConfInfo) {
            const objConfUsers = objConfInfo['users'];
            if (common.isUndefined(objConfUsers))
                return;
            const usersState = objConfUsers['$state'];
            if (common.isUndefined(objConfUsers['user']) && usersState === 'deleted') { // deleted all users
                conf.users.user = {};
                conf.receiverScreenSharingStateChanged = true;
                return;
            }
            conf.users.participantCount = objConfUsers['$participant-count'];
            const user = common.convertJson2Array(objConfUsers['user']);
            for (let i = 0; i < user.length; i++) {
                const curObjUser = user[i];
                parseConferenceUser(conf, curObjUser, usersState, conf.users.participantCount);
            }
        }

        /**
         * general state is full, partial
         * private
         */
        function getConferenceView(conf, objConfInfo) {
            const objConfView = objConfInfo['conference-view'];
            const tmpConfView = {};
            if (common.isUndefined(objConfView))
                return;
            const viewState = objConfView['$state'];
            const entityView = common.convertJson2Array(objConfView['entity-view']);
            for (let i = 0; i < entityView.length; i++) {
                const curEntityView = entityView[i];
                const entity = curEntityView['$entity'];
                if (common.isUndefined(entity))
                    continue;
                const id = getIndexByChannelName(entity);
                if (id === 'av') { // audio-video
                    const entityState = curEntityView['entity-state'];
                    if (!common.isUndefined(entityState)) {
                        const entryExitAnnouncements = entityState['entry-exit-announcements'];
                        if (!common.isUndefined(entryExitAnnouncements)) {
                            const enable = entryExitAnnouncements['enable'];
                            if (!common.isUndefined(enable)) {
                                tmpConfView.entryExitAnnouncementsEnable = common.str2bool(enable);
                            }
                            const modifiable = entryExitAnnouncements['modifiable'];
                            if (!common.isUndefined(modifiable)) {
                                tmpConfView.entryExitAnnouncementsModifiable = common.str2bool(modifiable);
                            }
                        }
                        const videoLayout = entityState['video-layout'];
                        if (!common.isUndefined(videoLayout)) {
                            tmpConfView.videoLayout = videoLayout;
                        }
                        const videoMaxView = entityState['video-max-view'];
                        if (!common.isUndefined(videoMaxView)) {
                            tmpConfView.videoMaxView = videoMaxView;
                        }
                        const videoPresenterLayout = entityState['video-presenter-layout'];
                        if (!common.isUndefined(videoPresenterLayout)) {
                            tmpConfView.videoPresenterLayout = videoPresenterLayout;
                        }
                        const videoPresenterMaxView = entityState['video-presenter-max-view'];
                        if (!common.isUndefined(videoPresenterMaxView)) {
                            tmpConfView.videoPresenterMaxView = videoPresenterMaxView;
                        }
                        if (!common.isUndefined(entityState['mediaFiltersRules'])) {
                            const tmp = entityState['mediaFiltersRules']['initialFilters'];
                            if (!common.isUndefined(tmp) && !common.isUndefined(tmp['ingressFilter']) && !common.isUndefined(tmp['role']) &&
                                tmp['role'] == 'default') { // default = audience
                                tmpConfView.muteAll = tmp['ingressFilter'] === 'unblock' ? false : true;
                            }
                        }

                    }
                } else if (id === 'focus') {
                    const entityState = curEntityView['entity-state'];
                    if (!common.isUndefined(entityState)) {
                        const locked = entityState['locked'];
                        if (!common.isUndefined(locked))
                            tmpConfView.focusLocked = common.str2bool(locked);
                    }
                }
            }
            // no changed
            if (common.deepCompare(conf.confView, tmpConfView) == true)
                return true;
            conf.confView = tmpConfView;
        }
    };

    endpointToString = function (user) {
        const endpoint = user.endpoint;
        let arry = [];

        if (!endpoint) {
            return [];
        }
        for (let i in endpoint) {
            const e = endpoint[i];
            let _obj = {};
            _obj.entity = i;
            _obj.sessionType = e.sessionType;
            _obj.joiningMethod = e.joiningMethod;
            _obj.joiningWhen = e.joiningWhen;
            _obj.status = e.status;
            arry.push(_obj);
        }
        return arry;
    }

    usersToString = function () {
        const users = this.users;
        const user = users.user;
        let arry = [];
        if (!user) {
            return arry;
        }
        for (let i in user) {
            const u = user[i];
            let _obj = {};
            _obj.entity = i;
            _obj.displayText = u.displayText;
            _obj.uid = u.uid;
            _obj.muteMediaId = u.muteMediaId;
            _obj.mute = u.mute;
            _obj.muteBlockBy = u.muteBlockBy;
            // _obj.estoppel = u.estoppel;
            // _obj.estoppelBlockBy = u.estoppelBlockBy;
            _obj.phone = u.phone;
            _obj.userAgent = u.userAgent;
            _obj.rolesDemoState = u.rolesDemoState
            _obj.presenterDemostate = u.presenterDemostate
            _obj.rolesPri = u.rolesPri;
            _obj.screenRole = u.screenRole;
            _obj.applicationsharing = u.applicationsharing;
            _obj.endpoint = this.endpointToString(u);
            arry.push(_obj);
        }
        return arry;
    }

    /**
     * @this {Conference}
     * @description parse conference attribute to string
     */

    toString = function () {
        const desc = this.confDesc;
        const state = this.confState;
        const view = this.confView;
        const users = this.users;

        let obj = {};
        let Desc = {};
        let State = {};
        let View = {};
        let Users = {};

        obj.receiverScreenSharingStateChanged = this.receiverScreenSharingStateChanged;
        obj.factoryURI = this.factoryURI;
        obj.entity = this.entity;
        obj.nowTime = this.nowTime;
        obj.notifyVersion = this.notifyVersion;
        obj.addmemberMode = this.addmemberMode;
        obj.state = this.state;
        obj.hasAV = (this.sessionAV ? true : false);
        obj.hasAS = (this.sessionAS ? true : false);
        obj.hasCtrl = (this.sessionCtrl ? true : false);
        obj.hasChat = (this.sessionChat ? true : false);
        obj.uaRolesPri = this.uaRolesPri;

        Desc.avURI = desc.avURI;
        Desc.focusURI = desc.focusURI;
        Desc.asURI = desc.asURI;
        Desc.org_displayName = desc.organizer.displayName;
        Desc.org_uri = desc.organizer.uri;
        Desc.org_uid = desc.organizer.uid;
        Desc.org_name = desc.organizer.username;
        Desc.org_realm = desc.organizer.realm;
        Desc.confType = desc.confType;
        Desc.confId = desc.confId;
        Desc.confNumber = desc.confNumber;
        Desc.attendeePin = desc.attendeePin;
        Desc.presenterPin = desc.presenterPin;
        Desc.startTime = desc.startTime;
        Desc.expiryTime = desc.expiryTime;
        Desc._startTime = desc._startTime;
        Desc.remindEarly = desc.remindEarly;
        Desc.subject = desc.subject;
        Desc.profile = desc.profile;
        Desc.scheduleId = desc.scheduleId;
        obj.Desc = Desc;

        State.active = state.active;
        State.locked = state.locked;
        State.policy = state.lockedPolicy;
        obj.State = State;

        View.focusLocked = view.focusLocked;
        View.videoLayout = view.videoLayout;
        View.videoMaxView = view.videoMaxView;
        View.videoPresenterLayout = view.videoPresenterLayout;
        View.videoPresenterMaxView = view.videoPresenterMaxView;
        View.muteAll = view.muteAll;
        obj.View = View;

        Users.participant = users.participantCount;
        Users.user = this.usersToString();
        obj.Users = Users;

        return obj
    }

    generateCtrlFrom = function () {
        const conf = this.conf;
        const ua = conf.ua;
        const from = ua.sipInfo.domain + '\\' + ua.sipInfo.displayName;
        return from;
    }

    getEndpointBySessionType = function (userEntity, sessionType) {
        const conf = this;
        const endpoints = conf.users.user[userEntity].endpoint;

        for (let i in endpoints) {
            if (endpoints[i].sessionType == sessionType) {
                return endpoints[i];
            }
        }
        return null;
    };

    /**
     * @this {Conference} 解析返回的会议ResponseXML的 
     * @param {String} [xmlbody] [response xmlbody by sessionCtrl c3p command]
     * @return {Boolean} update conference in ua conferences by xmlbody
     */
    getConferenceInfoFromResponseXML = function (xmlbody) {

        /* // use for test
        const conf = this;
        const obj = common.xml2json(xmlbody);
        conf.getConferenceInfoFromObj(xmlbody, obj['response']['getConference']);       
        return;*/
        const conf = this.conf;
        const that = this;
        if (xmlbody.indexOf('<response ') == -1) // it is not normal response xml body
            return false;
        const obj = common.xml2json(xmlbody);
        const code = obj['response']['$code'],
            requestId = obj['response']['$requestId'];
        if (requestId == conf.sessionCtrl.requestId) {
            if (code == "success") {
                that.notifyVersion = Number(obj['response']['getConference']['conference-info']['$version']) - 1;
                that.getConferenceInfoFromObj(obj['response']['getConference']);
            }
        }
        return true;
    };

    isEmptyObject = function (e) {
        var t;
        for (t in e)
            return !1;
        return !0
    }

    parseObjControlList = function (obj) {
        console.log(obj)
        let arrObj = obj['conference-info'];
        let nowTime = obj['now-time'];
        let data = {};
        if (!(arrObj instanceof Array))
            arrObj = common.convertJson2Array(arrObj)
        let arr = []
        arrObj.forEach((val) => {
            let o = {}
            let conflist = val
            o.entity = conflist.$entity
            if (!common.isUndefined(conflist['conference-description'])) {
                o.confNum = conflist['conference-description']['conference-number']
                o.confType = conflist['conference-description']['conference-type']
                o.startTime = conflist['conference-description']['start-time']
                o.state = conflist['conference-description']['state']
                o.subject = conflist['conference-description']['subject']
                o.presenterPin = conflist['conference-description']['presenter-pin']
                o.attendeePin = conflist['conference-description']['attendee-pin']
                o.recordId = conflist['conference-description']['record-id']
                o.planId = conflist['conference-description']['plan-id']
                o.organizerUid = conflist['conference-description']['organizer']['uid']
                o.organizerDisplayName = conflist['conference-description']['organizer']['displayText']
            }
            arr.push(o)
        })
        data.nowTime = nowTime;
        data.arr = arr;
        return data;
    }


}


export default new Control()


window.onbeforeunload = function (event) {
    conferenceChannel.disconnect()
};
