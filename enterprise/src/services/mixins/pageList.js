export default {
    data() {
        return {
            mixinHeight: null,
            TABLE_HEIGHT: -1,
            params: {
                skip: 0,
                limit: Number.parseInt(localStorage.getItem('currentSize') || 10),
                orderbys: null,
                orderByField: null,
                order: null,
                key: '',
                autoCount: true
            },
            tableData: [],
            multipleSelection: [],
            total: 0,
            orderType: 1 // 0：写在params那边，1：params.orderbys
        }
    },
    mounted() {
        if (this.mixinHeight !== null) this._swatch()
        this.getList()
    },

    methods: {
        _swatch() {
            let exec = _ => {
                let _main_height = $('.right').height() - (this.mixinHeight || 86);
                this.TABLE_HEIGHT = _main_height;
            }
            $(window).resize(exec)
            exec()
        },
        resetParams(assign, isGetPage) {
            /*this.params = {
                skip: 0,
                limit: 10,
                orderbys: [],
                key: '',
                autoCount: true
            }*/
            if (assign instanceof Object) {
                Object.assign(this.params, assign)
            }
            if (isGetPage) {
                this.getList();
            }
        },
        orderByField({ order, prop }) {
            this.params.skip = 0
            let orderby = !!prop ? (order === 'ascending' ? 1 : -1) : null
            if (this.orderType === 0) {
                this.params.orderByField = prop
                this.params.order = orderby
            } else {
                this.params.orderbys = !!prop ? [{ field: prop, order: orderby }] : []
            }
            console.log(JSON.stringify(this.params))
            this.getList();
        },

        handleSelectionChange(selection) {
            this.multipleSelection = selection;
        },
        batchDelete() {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                let ids = this.multipleSelection.map(data => {
                    return data.id
                });
                this.doListDelete(ids)
                this.$emit('select', [])
            } else {

            }
        },
        confirmDeleteTree() {
            return this.$confirm(this.$t('popUpWindow.delete.data'), this.$t('login.dialog.tit'), {
                confirmButtonText:this.$t('user.table.title.delete'),
                cancelButtonText:  this.$t('popUpWindow.cancel')
            })
        }
    },
    beforeDestroy() {
        if (this.mixinHeight >= 0) $(window).unbind('resize')
    }
};
