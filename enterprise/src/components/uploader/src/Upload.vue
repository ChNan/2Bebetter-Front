<template>
    <div :style="className">
        <div id="btn-group" class="yl-full" style="margin-bottom:10px;">
            <div class="logo" v-if="showType=='logo'&&imageUrl" :style="className">
                <img :src="imageUrl" class="avatar">
                <div class="logo-hint">{{text}}</div>
            </div>
        </div>
        <slot name="hint">
        </slot>
        <ul :class="['el-upload-list', 'el-upload-list--' + listType]"
            v-if="showType!=='logo'&&files!=undefined&&files.length>0">
            <li v-for="(file,index) in files" :class="['el-upload-list__item', 'is-' + file.statusText]" :key="index"
                :id="file.id">
                <template v-if="showType ==='file'">
                    <a class="el-upload-list__item-name">
                        <i class="el-icon-document"></i>
                        {{file.name}}
                    </a>
                    <label class="el-upload-list__item-status-label" v-if="file.loaded>-1">
                        <i class="el-icon-upload-success el-icon-circle-check"></i>
                    </label>
                    <label class="el-upload-list__item-status-label" v-else>
                        <i class="el-warinning el-icon-warning"></i>
                    </label>
                    <i class="el-icon-close" @click="deleteFile(file)"></i>
                </template>
                <el-progress :type="showType === 'file' ? 'line' : 'circle'" v-show="file.statusText === 'uploading'"
                             :stroke-width="showType === 'file' ? 2 : 6" :percentage="file.loaded">
                </el-progress><!-- v-if="file.statusText === 'uploading'" -->
                <span class="el-upload-list__item-actions" v-if="showType === 'img-list'">
                    <span class="el-upload-list__item-delete" id="delete" @click="deleteFile(file)">
                        <i class="el-icon-delete2"></i>
                    </span>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    import uploader from './index.js'

    export default {
        name: 'YlUpload',
        data() {
            return {
                files: [],
                imageUrl: null,
                myloader: null,
                listType: 'text',
                text: ''
            }
        },
        created() {
            this.listType = this.showType === 'img-list' ? 'picture-card' : 'text';
        },
        mounted() {

            let _this = this;
            this.myloader = uploader(this.configs, this.showType, this.uploadIcon);
            // 当有文件添加进来的时候
            this.myloader.on('fileQueued', (file) => {
                _this.$emit('fileQueued', file)
                _this.files.push(file)
                /* 超出最大值-1的时候就移除掉列队较早的 */
                if (this.files.length >= (this.configs.fileNumLimit || 1000)) {
                    this.myloader.removeFile(this.files[0]);
                    this.files.splice(0, 1);
                }
                if (_this.showType != 'file') {
                    _this.myloader.makeThumb(file, (error, src) => {
                        if (error) {
                            return;
                        }
                        if (_this.showType == 'logo')
                            _this.imageUrl = src;
                        else {
                            let li = document.getElementById("" + file.id);
                            var img = document.createElement("img");
                            img.src = src;
                            img.style.width = "100%";
                            img.style.height = "100%";
                            li.appendChild(img);
                        }

                    });
                }
            });

            this.myloader.on('uploadProgress', (file, percentage) => {
                console.log(percentage);
                if (_this.showType === 'logo') {
                    _this.text = this.$t('user.uploading');
                } else {
                    _this.files.forEach((item) => {
                        if (item.id == file.id) {
                            item.statusText = 'uploading'
                            item.loaded  =   (percentage *100).toFixed(2)
                        }
                    })
                }

            });
            this.myloader.on('uploadError', (file, reason) => {
                _this.$emit('uploadError', reason)
            });
            this.myloader.on('fileDequeued', (file) => {
                //_this.myuploader.removeFile(file);
                _this.$emit('fileDequeued', file)
            })
            this.myloader.on('uploadSuccess', (file, response) => {
                if (response.ret > -1) {
                    if (_this.showType === 'logo') {
                        _this.text = this.$t('user.upload.success');
                    } else {
//                        _this.files.forEach((item) => {
//                            if (item.id == file.id) {
//                               // item.statusText = 'uploading'
//
//
//                            }
//                        })

//                        _this.files.forEach((item) => {
//                            if (item.id == file.id) {
//                                item.statusText = 'success'
//                            }
//                        })
                    }
                    _this.$emit('uploadSuccess', response)
                } else {
                    _this.files.forEach((item) => {
                        if (item.id == file.id) {
                            item.statusText = 'error';
                            item.loaded = -1;
                        }
                    })
                    _this.$emit('uploadFail', response)
                }

            })

            /**
             * 验证文件格式以及文件大小
             Q_EXCEED_NUM_LIMIT ：在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值时派送。
             Q_EXCEED_SIZE_LIMIT ：在设置了Q_EXCEED_SIZE_LIMIT且尝试给uploader添加的文件总大小超出这个值时派送。
             Q_TYPE_DENIED ：当文件类型不满足时触发。
             */

            this.myloader.on("error", (type) => {
                _this.$emit('beforeUpload', type);
                // if (type == "Q_TYPE_DENIED") {
                //   _this.$message.error('文件类型错误');
                // } else if (type == "Q_EXCEED_SIZE_LIMIT") {
                //   _this.$message.error('文件大小错误');
                // }
            });

        },
        props: {
            showType: {
                type: String,
                default: 'file'
                //file,logo,img-list
            },
            configs: {
                type: Object,
                required: true
            },
            uploadIcon: {
                type: String
            },
            className: {
                type: Object
            }
        },
        methods: {
            parsePercentage(val) {
                return parseInt(val, 10);
            },
            deleteFile(file) {
                this.myloader.removeFile(file);
                this.files.splice(this.files.indexOf(file), 1);
            },
            upload() {
                this.myloader.upload();
            },
            hasFile() {
                return this.myloader.getFiles().length > 0;
            },
            removeFile() {
                this.myloader.getFiles().forEach(_ => {
                    this.deleteFile(_);
                })
            }
        }
    }
</script>

<style lang="css">
    /*el-upload-list__item-thumbnail*/

    .headerbtn {
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    cursor: pointer;
    }
    .headerbtn .el-message-box__close{
        color:#d9d9d9;
        padding:5px;
    }

    .el-warinning {
        color: #FF4949;
        background: white;
    }

    .el-upload-list__item.is-error:hover .el-upload-list__item-status-label {
        display: none;
    }

    .el-upload-list__item.is-error .el-upload-list__item-status-label {
        display: block;
    }

    .yl-full {
        height: 100%;
        width: 100%;
    }

    .yl-full-disable label {
        cursor: not-allowed !important;
    }

    .yl-full-disable .file .webuploader-pick {
        color: #ccc;
        border: solid 1px #ccc;
    }

    .avatar-uploader {
        height: 100%;
        width: 100%;
        position: relative;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 100%;
        text-align: center;
        margin-top: 45%;
    }

    .avatar {
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        z-index: 200;
    }

    .webuploader-container {
        position: relative;
    }

    .avatar-uploader .webuploader-pick {
        position: absolute;
        display: inline-block;
        height: 100%;
        width: 100%;
        left: 0;
    }

    .webuploader-element-invisible {
        position: absolute !important;
        clip: rect(1px 1px 1px 1px);
        /* IE6, IE7 */
        clip: rect(1px, 1px, 1px, 1px);
    }

    .file .webuploader-pick {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border-radius: 4px;
        border: solid 1px #2699f4;
        color: #2699f4;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 10px 15px;
        font-size: 14px;
        border-radius: 4px;
    }

    .webuploader-pick-hover {
        color: #20a0ff;
        border-color: #20a0ff;
    }

    .webuploader-pick-disable {
        opacity: 0.6;
        pointer-events: none;
    }

    .logo {
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        position: absolute;
    }

    .logo-hint {
        background: rgba(51, 51, 51, 0.75);
        color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 28px;
        line-height: 28px;
        width: 100%;
        z-index: 1000;
    }
</style>
