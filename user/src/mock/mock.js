import MockAdapter from 'axios-mock-adapter';
import {LoginUsers} from './data/user';
import {ControlList} from './data/control';

let mock = new MockAdapter(axios);

export default {
    /**
     * mock start
     */
    start() {
        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        });

        //登录
        mock.onPost('/login').reply(config => {
            let {username, password} = JSON.parse(config.data);
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
                        resolve([200, {code: 200, msg: '请求成功', user, data: {}}]);
                    } else {
                        resolve([200, {code: 500, msg: '账号或密码错误', data: {}}]);
                    }
                }, 1000);
            });
        });
        //会议控制列表
        mock.onGet('/GetList').reply(200, {
            msg: 'success',
            code:0,
            data:ControlList
        });
    },
    restore(){
        mock.restore();
    },
    reset(){
        mock.reset();
    }
};
