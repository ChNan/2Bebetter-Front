import TopBar from './src/TopBar';

/* istanbul ignore next */
TopBar.install = function(Vue) {
    Vue.component(TopBar.name, TopBar);
};

export default TopBar;
