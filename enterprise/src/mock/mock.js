import MockAdapter from 'axios-mock-adapter';
import { LoginUsers } from './data/user';
import { zNodes, dataMaker, dataMaker1 } from './data/common';


export default {
    /**
     * mock start
     */
    start() {
        let mock = new MockAdapter(axios);
        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        }); // mock error request

        mock.onGet('/vmrCategory/categoryTreeWithVmrs').reply(config => {
            let count = 100000,
                type = "",
                icon = "";
            return new Promise((resolve, reject) => {
                let _zNodes = [];
                setTimeout(() => {
                    if (count) {
                        _zNodes = type ? dataMaker1(count, icon) : dataMaker1(count, icon)
                    } else {
                        _zNodes = zNodes
                    }
                    resolve([200, { code: 200, msg: '请求成功', data: _zNodes }]);
                }, 10);
            });
        });
        mock.onGet('/org/orgTreeWithUsers').reply(config => {
            // let { count, type, icon } = config.params;
            return new Promise((resolve, reject) => {
                let _zNodes = [];
                setTimeout(() => {
                    // if (count) {
                    //     _zNodes = type ? dataMaker1(count, icon) : dataMaker1(count, icon)
                    // } else {
                    //     _zNodes = zNodes
                    // }
                    console.log(dataMaker1())
                    resolve([200, { code: 200, msg: '请求成功', data: dataMaker1(10000) }]);
                }, 10);
            });
        });
        mock.onGet('/org/orgTree').reply(config => {
            let { count, type, icon } = config.params;
            console.log(config);
            return new Promise((resolve, reject) => {
                let _zNodes = [];
                setTimeout(() => {
                    if (count) {
                        _zNodes = type ? dataMaker1(count, icon) : dataMaker(count, icon)
                    } else {
                        _zNodes = zNodes
                    }
                    resolve([200, { code: 200, msg: '请求成功', data: _zNodes }]);
                }, 10);
            });
        });


        //登录
        mock.onPost('/login').reply(config => {
            let { username, password } = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                let user = null;
                setTimeout(() => {
                    let hasUser = LoginUsers.some(u => {
                        if (u.username === username && u.password === password) {
                            user = JSON.parse(JSON.stringify(u));
                            user.password = undefined;
                            return true;
                        }
                    });

                    if (hasUser) {
                        resolve([200, { code: 200, msg: '请求成功', user, data: {} }]);
                    } else {
                        resolve([200, { code: 500, msg: '帐号或密码错误', data: {} }]);
                    }
                }, 1000);
            });
        });
    },
    restore() {
        let mock = new MockAdapter(axios);
        mock.restore();
    },
    reset() {
        let mock = new MockAdapter(axios);
        mock.reset();
    }
};