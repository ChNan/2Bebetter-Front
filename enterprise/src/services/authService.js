import { Message } from 'yl-element';
import { t } from '@/i18n/index';

const ENTERPRISE = 'enterprise';
const TIMEOUT = 'TIMEOUT';
const TIMEOUT_STAMP =  30 * 60 *1000 ; //ms
class auth {
    login(enterprise) {
        sessionStorage.setItem(ENTERPRISE, JSON.stringify(enterprise));
        sessionStorage.setItem(TIMEOUT, new Date().getTime());
    }

    logout() {
        sessionStorage.removeItem(ENTERPRISE);
    }

    check(router) {
        let _timeout = new Date() - sessionStorage.getItem(TIMEOUT)< TIMEOUT_STAMP;
        let _login = !!sessionStorage.getItem(ENTERPRISE);
        if(_login&&!_timeout&&router){
            Message({
                message:t('service.common.token.unauthorized'),
                type:'error'
            });
            this.logout();
        }
        return _login && _timeout;
    }

    updateTimeout() {
        sessionStorage.setItem(TIMEOUT, new Date().getTime());
    }

    getEnterprise() {
        let info = sessionStorage.getItem(ENTERPRISE);
        return JSON.parse(info || "{}");
    }
}

export default new auth()
