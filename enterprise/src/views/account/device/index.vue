<style lang="scss" scoped>
.device {
  h3 {
    float: left;
  }
  .search {
    float: left;
    padding-left: 42px;
    width: 360px;
  }
  .f-tac {
    .icon-kongshuju {
      color: #c9c9c9;
      font-size: 58px;
    }
  }
}

.u-search {
  width: 30%;
  margin-bottom: 20px;
}
</style>

<template>
    <div class="device g-bd">
        <!--页面头部-->
        <div class="g-hd">
            <h3>  {{$t('device.title')}}</h3>
            <div class="btn-right">
                <el-button type="primary" @click="addUser">
                    <i class="iconfont icon-jia"></i>
                    {{$t('device.add')}}
                </el-button>
            </div>
        </div>
        <div class="g-box">
            <el-input :placeholder="$t('common.placeholder.default')" :maxlength="128" v-model="inputKey" icon="search" class="u-search" @focus="onFocus" @blur="onBlur" :on-icon-click="onIconClick"></el-input>
            <el-table ref="table" :data="tableData" :default-sort="{prop: 'date', order: 'descending'}" @sort-change="orderByField" @selection-change="handleSelectionChange" :max-height="TABLE_HEIGHT">
                <div slot="empty">
                    <table-no-data v-model="params.key" @cb="cb"></table-no-data>
                </div>
                <el-table-column type="selection" width="58" align="center"></el-table-column>
                <el-table-column prop="account" :label="$t('device.account')" min-width="120" sortable="custom" class-name="a"></el-table-column>
                <el-table-column prop="name" :label="$t('device.name')" min-width="120" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column prop="extension" :label="$t('device.extension')" min-width="120" sortable="custom"></el-table-column>
                <el-table-column prop="roomName" :label="$t('device.room')" min-width="120" show-overflow-tooltip ></el-table-column>
                <el-table-column :label="$t('common.operate')" width="160" align="center">
                    <template scope="scope">
                        <el-button type="text" @click="handleClick(scope.row,'edit')">
                            <i class="icon-operation iconfont icon-bianji"></i>
                        </el-button>
                        <el-button type="text" @click="handleClick(scope.row,'delete')">
                            <i class="icon-operation iconfont icon-shanchu"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <table-bar :total="total" table="table" @change="getList">
                <span slot="more">
                    <el-button type="primary" size="small" @click.native="batchDelete" :disabled="multipleSelection.length===0">{{$t('common.batchDelete')}}</el-button>
                </span>
            </table-bar>
        </div>
    </div>
</template>
<script>
import { getPagedList, deleteDevice } from "../../../api/account/device";
import PageList from "../../../services/mixins/pageList";
import TableNoData from "@/components/common/TableNoData";
export default {
  mixins: [PageList],
  components: {
    TableNoData
  },
  data() {
    return {
      mixinHeight: 0,
      orderType: 0,
      inputKey: ""
    };
  },
  mounted() {},
  methods: {
    listener(e) {
      if (e) {
        e = window.event ? window.event : e;
        if (e.keyCode != 13) {
          return;
        }
      }
      this.params.key = this.inputKey;
      this.total = 0;
      this.getList();
    },
    cb() {
      this.inputKey = "";
      this.params.key = "";
      this.getList();
    },
    onIconClick() {
      this.listener(false);
    },
    onBlur() {
      document.removeEventListener("keydown", this.listener);
    },
    onFocus() {
      document.addEventListener("keydown", this.listener);
    },
    getList(assign) {
      if (assign instanceof Object) {
        Object.assign(this.params, assign);
      }
      getPagedList(this.params, this.params.skip === 0).then(json => {
        this.tableData = json.data.data;
        this.total = json.data.total;
      });
    },
    confirmDelete() {
      return this.$confirm(
        this.$t("list.delete.account"),
        this.$t("login.dialog.tit"),
        {
          confirmButtonText: this.$t("user.table.title.delete"),
          cancelButtonText: this.$t("popUpWindow.cancel")
        }
      );
    },
    //执行类目删除
    doListDelete(id) {
      let ids = [];
      if (id instanceof Array) {
        ids = [...id];
      } else {
        ids.push(id);
      }
      this.confirmDelete()
        .then(() => {
          deleteDevice({ ids }).then(json => {
            if (json.ret >= 0) {
              this.$message({
                message: this.$t("common.message.delete.ok"),
                type: "success"
              });
              this.getList();
              this.multipleSelection = [];
            }
          });
        })
        .catch(() => {});
    },
    //表格中点击触发事件
    handleClick(row, type) {
      if (type === "edit")
        this.$router.push({ path: "deviceEdit", query: { id: row.id } });
      else if (type === "delete") {
        this.doListDelete(row.id);
      }
    },
    addUser() {
      this.$router.push("/enterprise/deviceEdit");
    }
  }
};
</script>

