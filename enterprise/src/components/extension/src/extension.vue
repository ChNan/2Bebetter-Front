<style lang="scss">
.yl-extension {
  width: 100%;
}

.el-autocomplete-suggestion__wrap .el-table {
  border: none!important
}
</style>

<template>
  <div class="el-autocomplete yl-extension">
    <el-input ref="input" v-model.number="selectValue" :disabled="disabled" :placeholder="placeholder"
              :name="name" :size="size" :icon="iconClass" :on-icon-click="onIconClick" :maxlength="4"
              @compositionstart.native="handleComposition" @compositionupdate.native="handleComposition"
              @compositionend.native="handleComposition" @change="handleChange" @focus="handleFocus"
              @blur="handleBlur" @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
              @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
              @keydown.enter.native.prevent="handleKeyEnter">
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </el-input>
    <yl-extension-suggestions :props="props" :search="value" :class="[popperClass ? popperClass : '']" ref="suggestions" :suggestions="suggestions">
    </yl-extension-suggestions>
  </div>
</template>
<script>

import YlExtensionSuggestions from './extension-suggestions.vue';
import Emitter from '../utils/emitter';


export default {
  name: 'YlExtension',

  mixins: [Emitter],

  componentName: 'YlExtension',

  components: {
    YlExtensionSuggestions
  },

  props: {
    props: {
      type: Object,
      default() {
        return {
          value: 'extension'
        };
      }
    },
    popperClass: String,
    placeholder: String,
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    autofocus: Boolean,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    icon: String,
    onIconClick: Function,
    fetchSuggestions: Function
  },
  data() {
    return {
      isFocus: false,
      isOnComposition: false,
      suggestions: [],
      loading: false,
      selectValue: this.value,
      highlightedIndex: -1
    };
  },
  computed: {
    suggestionVisible() {
      const suggestions = this.suggestions;
      let isValidData = true//Array.isArray(suggestions) && suggestions.length > 0;
      return (isValidData || this.loading) && this.isFocus;
    },
    iconClass() {
      return this.suggestionVisible ? 'caret-bottom' : 'caret-top';
    },
  },
  watch: {
    suggestionVisible(val) {
      this.broadcast('YlExtensionSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth]);
    },
    value(val) {
      this.selectValue = val;
    },
    selectValue(val) {
      this.$emit('input', val);
    }
  },
  methods: {

    getData(queryString) {
      this.loading = true;
      this.fetchSuggestions(queryString, (suggestions) => {
        this.loading = false;
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions;
        } else {
          console.error('extension suggestions must be an array');
        }
      });
    },
    handleComposition(event) {
      if (event.type === 'compositionend') {
        this.isOnComposition = false;
        this.handleChange(this.value);
      } else {
        this.isOnComposition = true;
      }
    },
    handleChange(value) {
      this.$emit('input', value);
      if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
        this.suggestions = [];
        return;
      }
      this.getData(value);
    },
    handleFocus() {
      this.isFocus = true;
      if (this.triggerOnFocus) {
        this.getData(this.value);
      }
    },
    handleBlur() {
      // 因为 blur 事件处理优先于 select 事件执行
      setTimeout(_ => {
       if(this.value) this.isFocus = false;
      }, 100);
    },
    handleKeyEnter() {
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        this.select(this.suggestions[this.highlightedIndex]);
      }
    },
    select(item) {
        this.isFocus = false;
      this.$emit('input', item[this.props.value].toString());
      this.$emit('select', item);
      this.$nextTick(_ => {
//        this.suggestions = [];
      });
    },
    highlight(index) {
      if (!this.suggestionVisible || this.loading) { return; }
      if (index < 0) index = 0;
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1;
      }
      const suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap');
      const suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li');

      let highlightItem = suggestionList[index];
      let scrollTop = suggestion.scrollTop;
      let offsetTop = highlightItem.offsetTop;

      if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
        suggestion.scrollTop += highlightItem.scrollHeight;
      }
      if (offsetTop < scrollTop) {
        suggestion.scrollTop -= highlightItem.scrollHeight;
      }

      this.highlightedIndex = index;
    }
  },
  mounted() {
    this.$on('item-click', item => {
      this.select(item);
    });
  },
  beforeDestroy() {
    this.$refs.suggestions.$destroy();
  }
};
</script>
