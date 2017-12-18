import TreeDropdown from './src/index.vue';

/* istanbul ignore next */
TreeDropdown.install = function(Vue) {
  Vue.component(TreeDropdown.name, TreeDropdown);
};

export default TreeDropdown;
