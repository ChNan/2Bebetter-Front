import YlPopover from './src/popover.vue';

/* istanbul ignore next */
YlPopover.install = function(Vue) {
  Vue.component(YlPopover.name, YlPopover);
};

export default YlPopover;
