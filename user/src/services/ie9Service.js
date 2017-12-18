import {isIE9} from "./toolService";

/**
 * 解决激活码兼容问题
 */
const redirectActive = () => {
    const PREFIX = ['/register?step=', '/recovery?activeCode='];
    const HREF = window.location.href;
    if (PREFIX.some(x => HREF.includes(x)) && !HREF.includes('#')) {
        self.location = HREF.replace(window.location.pathname, window.location.pathname + '#' + window.location.pathname);
        throw 'Jumping links';
    }
}

if (isIE9()) {
    redirectActive();
}


