const ADMIN = 'admin';
import { Message } from 'yl-element';
import { t } from '@/i18n/index';


const TIMEOUT = 'TIMEOUT';
const TIMEOUT_STAMP =  30 * 60 *1000 ; //ms

class auth {

    login(admin) {
        sessionStorage.setItem(ADMIN, JSON.stringify(admin));
        sessionStorage.setItem(TIMEOUT, new Date().getTime());
    }

    logout() {
        sessionStorage.removeItem(ADMIN);
    }

    check(router) {
        let _timeout = new Date() - sessionStorage.getItem(TIMEOUT)< TIMEOUT_STAMP;
        let _login = !!sessionStorage.getItem(ADMIN);
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

    getEnterprise() {
        let info = sessionStorage.getItem(ADMIN);
        return JSON.parse(info || "{}");
    }
}

export default new auth()
