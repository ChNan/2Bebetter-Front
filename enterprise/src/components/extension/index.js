import YlExtension from './src/extension';

/* istanbul ignore next */
YlExtension.install = function(Vue) {
    Vue.component(YlExtension.name, YlExtension);
};

export default YlExtension;