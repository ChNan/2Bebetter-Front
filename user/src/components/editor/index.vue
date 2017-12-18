<template>
    <div v-html="content" :value="result" @input="result" id="editor">
    </div>
</template>

<script>
    import WangEditor from 'wangeditor'
    export default {
        props: ['content', 'path'],
        data() {
            return {
                editor: ''
            }
        },
        mounted() {
            this.editor = new WangEditor('editor');
            this.editor.config.menus = ['source', '|', 'bold', 'underline', 'italic', 'strikethrough', 'eraser', 'forecolor', 'bgcolor', '|', 'quote', 'fontfamily', 'fontsize', 'head', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright',
                '|', 'link', 'unlink', 'table', /*'img', 'video', 'insertcode',*/ '|', 'undo', 'redo', 'fullscreen'
            ];

            this.editor.config.lang = {
                aligncenter: this.$t('editor.aligncenter'),
                alignleft: this.$t('editor.alignleft'),
                alignright: this.$t('editor.alignright'),
                bgcolor: this.$t('editor.bgcolor'),
                bold:this.$t('editor.bold'),
                cancel: this.$t('editor.cancel'),
                clearLocation: this.$t('editor.clearLocation'),
                dynamicMap: this.$t('editor.dynamicMap'),
                emotion: this.$t('editor.emotion'),
                eraser: this.$t('editor.eraser'),
                fontfamily: this.$t('editor.fontfamily'),
                fontsize: this.$t('editor.fontsize'),
                forecolor: this.$t('editor.forecolor'),
                fullscreen:this. $t('editor.fullscreen'),
                head: this.$t('editor.head'),
                height: this.$t('editor.height'),
                img: this.$t('editor.img'),
                insertcode: this.$t('editor.insertcode'),
                italic: this.$t('editor.italic'),
                langDynamicOneLocation: this.$t('editor.langDynamicOneLocation'),
                link: this.$t('editor.link'),
                linkImg: this.$t('editor.linkImg'),
                loading: this.$t('editor.loading'),
                location: this.$t('editor.location'),
                openLink: this.$t('editor.openLink'),
                orderlist: this.$t('editor.orderlist'),
                quote: this.$t('editor.quote'),
                redo: this.$t('editor.redo'),
                searchlocation: this.$t('editor.searchlocation'),
                source: this.$t('editor.source'),
                strikethrough: this.$t('editor.strikethrough'),
                submit: this.$t('editor.submit'),
                table: this.$t('editor.table'),
                text: this.$t('editor.text'),
                underline: this.$t('editor.underline'),
                undo: this.$t('editor.undo'),
                unlink: this.$t('editor.unlink'),
                unorderlist: this.$t('editor.unorderlist'),
                uploadImg: this.$t('editor.uploadImg'),
                video: this.$t('editor.video'),
                width:this.$t('editor.width'),
            };
            this.editor.config.uploadImgUrl = this.path;
            this.editor.create();
            
            $(".wangeditor-menu-img-eraser").each(function () {this.click()})
            
        },
        computed:{
        
        },
        methods: {
            result() {
                this.$emit('input', this.editor.$txt.html());
            },
            setVal (str) {
                this.editor.$txt.html(str);
            },
            getVal () {
            	return this.editor.$txt.html();
            }
        }
    }
</script>
<style>
    #editor {
        height: 220px;
    }
    .wangEditor-menu-container {
        border-bottom: 1px solid #bfd0d9;
        padding-left: 20px;
    }
    .wangEditor-menu-container .menu-item {
        height: 36px;
    }
    .wangEditor-menu-container .menu-item a{
        padding: 10.5px 0;
    }
    .wangEditor-container {
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #bfd0d9;
    }
</style>
