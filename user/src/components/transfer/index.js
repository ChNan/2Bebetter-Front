import YlTransfer from './src/';

/* istanbul ignore next */
YlTransfer.install = function(Vue) {
  Vue.component(YlTransfer.name, YlTransfer);
};

export default YlTransfer;
