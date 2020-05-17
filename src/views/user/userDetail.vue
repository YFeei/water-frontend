<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="width:100%">
      <el-card class="box-card" shadow="never">
        <div class="text item">
          {{ '账号： ' + data.account }}
        </div>
        <div class="text item">
          {{ '用户名： ' + data.username }}
        </div>
        <div class="text item">
          {{ '公司： ' + comp.name }}
        </div>
        <div class="text item">
          {{ '机构： ' + org.name }}
        </div>
        <div class="text item">
          {{ '电话： ' + data.telephone }}
        </div>
        <div class="text item">
          状态：
          <el-tag :type="data.status==='有效' ? 'success' : 'danger'">{{ data.status }}</el-tag>
        </div>
        <div class="text item">
          角色：
          <el-tag v-for="r in role">{{ r }}</el-tag>
        </div>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCompById } from '@/api/comp'
import { getOrgById } from '@/api/org'
import { getRoleList } from '@/api/role'

export default {
  data() {
    return {
      visible: true,
      title: '用户详情',
      data: {
        name: '',
        type: 1,
        parentId: 0,
        role: '',
        comp: {
          name: ''
        },
        org: {
          name: ''
        }
      },
      roleList: [],
      comp: {
        name: ''
      },
      org: {
        name: ''
      },
      role: '',
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  methods: {
    init1(data) {
      this.visible = true
      this.data = data
      this.getCompById()
      this.getOrgById()
      this.getRoleList()
    },
    getRoleList() {
      getRoleList().then(resp => {
        this.roleList = resp.data.records
        const role = []
        for (let i = 0; i < this.roleList.length; i++) {
          if (this.data.rid.indexOf(this.roleList[i].id) !== -1) {
            role.push(this.roleList[i].name)
          }
        }
        this.role = role
      })
    },
    getCompById() {
      getCompById(this.data.companyId).then(resp => {
        this.comp = resp.data
      })
    },
    getOrgById() {
      getOrgById(this.data.orgId).then(resp => {
        this.org = resp.data
      })
    },
    close() {
      this.$emit('refreshList')
      this.visible = false
    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 15px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
  }
  .el-tag {
    margin-left: 10px;
  }
</style>
