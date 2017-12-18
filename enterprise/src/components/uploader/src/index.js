import {t} from '../../../i18n/index'
import WebUploader from 'webuploader/dist/webuploader'

function generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};
const uploader = (config, type, icon) => {
    let error = `上传控件不支持您的浏览器！请尝试升级flash版本或者使用Chrome引擎的浏览器。<a target="_blank" href="https://get.adobe.com/cn/flashplayer/">下载页面</a>`;
    let docheight = $(document).height();
    if (!WebUploader.Uploader.support()) {
        //追加一个层，使背景变灰　　
        $("body").append("<div id='greybackground' class='el-dialog__wrapper' style='z-index:200'>" +
            "<div class='el-card' style='z-index:2000;width:400px;margin:0 auto;'><div class='el- card__header'><div  class='clearfix' style='float:right'><button type='button' class='headerbtn' aria-label='Close'><i class='el-message-box__close el-icon-close'></i></button></div></div><div class='el-card__body'>" + error + "</div></div></div>");
        $("#greybackground").css({
            "background": "rgba(0, 0, 0, 0.68)",
            "height": docheight
        });
        $('#greybackground > .el-card').css({
            "margin-top": $(window).height() / 2
        })
        $('.headerbtn').on('click', function () {
            $("#greybackground").remove();
        })
        return;
    }
    let pickerid = generateUUID();
    if (type === 'file' || type === 'img-list') {
        if (typeof icon == 'undefined')
            // $('#btn-group').append("<div class='file'><div id=" + pickerid + ">t('common.select.file')</div></div>");
            $('#btn-group').append(`<div class="file"><div id="${pickerid}">${t('common.select.file')}</div></div>`);
        else {
            $('#btn-group').append(`<div class="file"><div id="${pickerid}"> <i class="${icon} pl5"></i>${ t('common.select.file')}</div></div>`);
        }
    } else if (type === 'logo') {
        $('#btn-group').append("<div class='avatar-uploader'><div class='el-upload el-upload--text'>" +
            " <i class='el-icon-plus avatar-uploader-icon' id=" + pickerid + "></i></div>")
    }

    let webuploaderoptions = $.extend({
            auto: true, // 选完文件后，是否自动上传
            swf: require('./Uploader.swf'), // swf文件路径
            server: config.server, // 文件接收服务端'/api/v1/resource/upload'
            // 只允许选择图片文件。
            withCredentials: true,
            //  deleteServer: '/Home/DeleteFile',
            pick: '#' + pickerid,
            //不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            duplicate: true, //支持文件重复上传
            fileNumLimit: config.fileNumLimit,
            fileSizeLimit: config.fileSizeLimit,
            fileSingleSizeLimit: config.fileSingleSizeLimit,
            //限制只能上传图片,格式gif,jpg,jpeg,bmp,png
            accept: config.accept
        },
        config);
    let loader = WebUploader.create(webuploaderoptions);
    return loader;
}
export default uploader
