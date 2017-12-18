

export default {
    state:{
        timezone:{},
        recordId:"",
        planId:"",
        editType:"",
        utcOffset:0,
        cycleModal:false,
        organizer:{
            name:"",
            id:""
        },
        isEdit:false,
        transferMode:"",
        bussinessMode:{},
        language:"zh-CN",
    },
    mutations:{
        setTimezone (state,timezone) {
            state.timezone = timezone;
        },
        setRecordId (state, recordId) {
            state.recordId = recordId;
        },
        setPlanId (state, planId) {
            state.planId = planId;
        },
        setEditType (state, type) {
            state.editType  = type;
        },
        setUtcOffset (state,utcOffset){
            state.utcOffset = utcOffset;
        },
        setCycleModal (state, open) {
            state.cycleModal = open;
        },
        setOrganizer (state, organizer) {
            state.organizer = organizer;
        },
        setEditMode (state,mode) {
            state.isEdit = mode;
        },
        setTransferMode (state, mode) {
            state.transferMode = mode;
        },
        setBussinessMode (state, mode) {
            state.bussinessMode = mode
        },
        setLanguage (state, language) {
            state.language = language
        },
    },
    getters:{
    
    }
   
}
