import auth from '../authService'

export default {
    data() {
        let { enterprise:{enterpriseId} } = auth.getEnterprise()
        return {
            enterpriseId: ''
        }
    },
    created() {
    /*    console.log( auth.getEnterprise());
        let { enterprise:{enterpriseId} } = auth.getEnterprise()
        this.enterpriseId = enterpriseId*/
    },
    methods: {},
};
