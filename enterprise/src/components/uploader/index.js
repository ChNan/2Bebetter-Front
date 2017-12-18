import YlUpload from './src/Upload.vue';
/* istanbul ignore next */
YlUpload.install = function(Vue) {
  Vue.component(YlUpload.name, YlUpload);
};
export default YlUpload;
