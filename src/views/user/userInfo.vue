<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="width:60%">
      <el-form ref="form" :model="data" label-width="80px">
        <el-form-item label="账号">
          <el-input
            v-model="data.account"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="data.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="data.password"
            placeholder="仅支持英文数字,最多3个字符"
            on-key-up="value=value.replace(/[\W]/g,'')"
            maxlength="3"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="data.status"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="data.companyId" placeholder="请选择" @change="compChange">
            <el-option
              v-for="item in compList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构">
          <el-select v-model="data.orgId" placeholder="请选择">
            <el-option
              v-for="item in orgList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="selectedRole">
            <el-checkbox v-for="role in roleList" :label="role.id">{{ role.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="test">test</el-button>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">关闭</el-button>
      <el-button type="primary" @click="addOrUpdateUser()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCompList } from '@/api/comp'
import { getOrgListByCompId } from '@/api/org'
import { getRoleList } from '@/api/role'
import { addUser, updateUser } from '@/api/user'

export default {
  data() {
    return {
      visible: true,
      dir: {},
      mode: 'add',
      title: '添加用户',
      data: {
        name: '',
        type: 1,
        parentId: 0,
        role: ''
      },
      compList: [],
      orgList: [],
      roleList: [],
      selectedPerm: [],
      loadPerm: false,
      loadOrg: false,
      isChanged: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        id: 0,
        roleName: '',
        remark: ''
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  methods: {
    init1(mode, data) {
      /* this.dir = dir
      this.visible = true
      this.isChanged = false
      this.data.type = 0
      this.data.name = ''*/
      console.log('mode=' + mode)
      console.log('data=')
      console.log(data)
      this.mode = mode
      this.visible = true
      this.getPermList()
      if (mode === 'update') {
        this.data = data
        this.title = '编辑用户'
        this.getOrgList()
        this.selectedRole = this.data.rid.split(',').map(Number)
      } else if (mode === 'add') {
        this.data = {
          name: '',
          type: 1,
          parentId: 0,
          role: ''
        }
        this.selectedRole = []
      }
      this.getRoleList()
    },
    addOrUpdateRole() {
      this.data.rid = this.selectedPerm.join(',').toString()
      if (this.mode === 'add') {
        this.addRole()
      } else if (this.mode === 'update') {
        this.updateUser()
      }
    },
    getPermList() {
      this.listLoading = true
      const params = {}
      if (this.searchValue !== '') {
        params[this.field] = this.searchValue
      }
      getCompList(1, 20000).then(response => {
        console.log(response)
        this.compList = response.data.records
      })
    },
    getOrgList() {
      this.listLoading = true
      const companyId = this.data.companyId
      getOrgListByCompId(1, 20000, companyId).then(resp => {
        this.orgList = resp.data.records
        this.loadOrg = true
      })
    },
    permChange(val) {
      console.log('permChange')
      console.log(val)
      this.loadOrg = false
      this.orgList = []
      delete this.data.orgId
      this.getOrgList()
    },
    getRoleList() {
      getRoleList().then(resp => {
        this.roleList = resp.data.records
      })
    },
    addRole() {
      this.data.rId = this.selectedPerm.join(',')
      addUser(this.data).then(resp => {
        if (resp.code === 4001) {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1000
          })
          this.close()
        }
      })
    },
    updateUser() {
      const data = this.data
      data.rId = this.selectedPerm.join(',')
      // delete data.createTime
      // delete data.updateTime
      updateUser(data).then(resp => {
        if (resp.code === 4001) {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
          this.close()
        }
      })
    },
    close() {
      this.$emit('refreshList')
      this.visible = false
    },
    test() {
      console.log('selectRole')
      console.log(this.selectedPerm)
      console.log(this.selectedPerm.join(',').toString())
    }
  }
}
</script>

<style scoped>

</style>
