export default [
    {
        "name": "max-height-swatch",
        "directive": {
            inserted(el, binding) {
                let h = _ => {
                    let _header = $(el).find('.el-table__header-wrapper')
                    let _body = $(el).find('.el-table__body-wrapper')
                    let value = Object.assign({
                        e: '.right',
                        h: 123
                    }, binding.value)
                    let _main_height = $(value.e).height() - value.h;
                    $(el).css('max-height', _main_height + "px")
                    $(el).attr("max-height-swatch", "");
                    _body.css('max-height', _main_height - _header.height() + "px")
                }
                h()
                $(window).resize(h)
            },
            unbind() {
                $(window).unbind('resize')
            }
        }
    }
]
