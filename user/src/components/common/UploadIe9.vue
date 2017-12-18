<style scoped>
    .ie9-form {
        display: inline;
    }

    .ie9-form .file {
        width: 90px;
        height: 36px;
        opacity: 0;
        filter: opacity(0);
        position: absolute;
        top: 0px;
        left: 0px;
        cursor: pointer;
    }
</style>
<template>
    <div>
        <form class="ie9-form" id="formDemo" method="post" enctype="multipart/form-data">
            <input class="file" type="file" name="file" id="file" :accept="accept" :disabled="disabled"
                   @change="uploadFile"/>
            <slot></slot>
        </form>
    </div>
</template>
<script>
    import $ from  'jquery';
    import 'jquery-form';
    import ElButton from '../../button';
    export default {
        name: 'ElUploadIE9',
        props: ['action', 'data', 'onSuccess', 'onError', 'accept', 'disabled'],
        data() {
            return {};
        },
        methods: {
            uploadFile() {
                if (document.getElementById('file').value) {
                    $('#formDemo').ajaxSubmit({
                        url: `${this.action}?token=` + (this.data && this.data.token) || sessionStorage.getItem('token') || '',
                        success: (data) => {
                            this.onSuccess && this.onSuccess(JSON.parse(data || '{}'));
                        },
                        error: function(error) {
                            this.onError && this.onError(JSON.parse(error || '{}'));
                        }
                    });
                }
            }
        }
    };
</script>

