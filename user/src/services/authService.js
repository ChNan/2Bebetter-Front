const USER = 'user';
import { Message } from 'yl-element';
import { t } from '@/i18n/index';


const TIMEOUT = 'TIMEOUT';
const TIMEOUT_STAMP =  30 * 60 *1000 ; //ms
class auth {

    login(user) {
        sessionStorage.setItem(USER, JSON.stringify(user));
        sessionStorage.setItem(TIMEOUT, new Date().getTime());
    }

    logout() {
        sessionStorage.removeItem(USER);
    }

    check(router) {
        let _timeout = new Date() - sessionStorage.getItem(TIMEOUT)< TIMEOUT_STAMP;
        let _login = !!sessionStorage.getItem(USER);
        if(_login&&!_timeout&&router){
            Message({
                message:t('service.common.token.unauthorized'),
                type:'error'
            });
        }
        return _login && _timeout;
    }
    
    updateTimeout() {
        sessionStorage.setItem(TIMEOUT, new Date().getTime());
    }

    getUser() {
        let info = sessionStorage.getItem(USER);
        return JSON.parse(info || "{}");
    }
}

export default new auth()
