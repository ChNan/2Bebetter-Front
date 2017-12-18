<template>
  <div>
    <!--导航菜单-->
    <aside class="menu-expanded">
      <el-menu :default-active="getDefault()" class="el-menu-vertical-demo" @open="handleOpen" @select="handleSelect"
               unique-opened router>
        <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
          <el-submenu :index="index+''" v-if="!item.leaf">
            <template slot="title"><i :class="item.icon"></i> <span class="p25">{{$t(item.name)}}</span></template>
            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
              {{$t( child.name)}}
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-if="item.leaf&&item.children&&item.children.length>0" :index="item.children[0].path"><i
            :class="item.icon"></i><span class="p25">{{ $t(item.name)}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </aside>
  </div>
</template>


<script>
  export default {
    data() {
      return {}
    },
    mounted() {

    },
    methods: {
      getDefault(){
        let _menu = this.$route.meta && this.$route.meta.menu || this.$route.path
        return _menu
      },

      handleSelect(key, path) {

      },
      handleOpen(key, path) {

      }
    }
  }

</script>

<style scoped>
  .p25 {
    padding-left: 25px;
  }

  .el-menu-item, .el-submenu {
    border-left: 4px solid transparent;
  }

  .menu-collapsed {
    flex: 0 0 60px;
    width: 60px;
  }

  .menu-expanded {
    flex: 0 0 200px;
    width: 240px;
  }
</style>
