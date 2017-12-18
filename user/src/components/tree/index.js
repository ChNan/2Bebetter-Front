import YlTree from './src/tree.vue';

/* istanbul ignore next */
YlTree.install = function (Vue) {
    Vue.component(YlTree.name, YlTree);
};

export default YlTree;
