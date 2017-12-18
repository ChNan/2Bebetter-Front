export default {
    data() {
        return {
            TABLE_HEIGHT: 0,
        }
    },
    methods: {
        swatch(h) {
            let exec = _ => {
                let _main_height = $('.right').height() -( h||86);
                this.TABLE_HEIGHT = _main_height;
            }
            $(window).resize(exec)
            exec()
        }
    },
    beforeDestroy() {
        $(window).unbind('resize')
    }
};
