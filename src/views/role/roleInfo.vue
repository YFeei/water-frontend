<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="width:60%">
      <el-form ref="form" :model="data" label-width="80px">
        <el-form-item label="角色名">
          <el-input
            v-model="data.name"
            placeholder="请输入角色名"
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
        <el-form-item label="备注">
          <el-input v-model="data.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            :data="permList"
            show-checkbox
            :default-checked-keys="selectedPerm"
            node-key="id"
            highlight-current
            :check-strictly="true"
            :props="defaultProps"
            @check-change="checkedChange"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="test">test</el-button>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">关闭</el-button>
      <el-button type="primary" @click="addOrUpdateRole()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { addRole, updateRole } from '@/api/role'
import { getPermList } from '@/api/perm'

export default {
  data() {
    return {
      visible: true,
      dir: {},
      mode: 'add',
      title: '添加角色',
      data: {
        name: '',
        remark: '',
        perms: ''
      },
      permList: [],
      selectedPerm: [],
      loadPerm: false,
      isChanged: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
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
      this.getCompList()
      if (mode === 'update') {
        this.data = data
        this.title = '编辑角色'
        this.selectedPerm = this.data.perms.split(',').map(Number)
      } else if (mode === 'add') {
        this.data = {
          name: '',
          remark: '',
          perms: ''
        }
        this.selectedPerm = []
      }
    },
    addOrUpdateRole() {
      this.data.perms = this.$refs.tree.getCheckedKeys().join(',').toString()
      if (this.mode === 'add') {
        this.addRole()
      } else if (this.mode === 'update') {
        this.updateRole()
      }
    },
    getCompList() {
      this.listLoading = true
      const params = {}
      if (this.searchValue !== '') {
        params[this.field] = this.searchValue
      }
      getPermList().then(response => {
        console.log(response)
        this.permList = response.data
      })
    },
    addRole() {
      addRole(this.data).then(resp => {
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
    updateRole() {
      const data = this.data
      // delete data.createTime
      // delete data.updateTime
      updateRole(data).then(resp => {
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
      console.log('selectPerm')
      this.getSelectedPerm()
    },
    getSelectedPerm() {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    checkedChange(data, check) {
      if (data.pid !== 0) {
        if (check === true) {
          this.$refs.tree.setChecked(data.pid, true)
        } else {
          const pNode = this.$refs.tree.getNode(data.pid)
          console.log('pNode')
          console.log(pNode)
          let pHasCheckedChild = false
          for (
            let i = 0, pChild = pNode.childNodes.length;
            i < pChild;
            i++
          ) {
            if (pNode.childNodes[i].checked === true) {
              pHasCheckedChild = true
              break
            }
          }
          if (!pHasCheckedChild) {
            this.$refs.tree.setChecked(data.pid, false)
          }
        }
      }
      if (data.children != null && check === false) {
        for (let j = 0, len = data.children.length; j < len; j++) {
          const childNode = this.$refs.tree.getNode(data.children[j].id)
          if (childNode.checked === true) {
            this.$refs.tree.setChecked(childNode.data.id, false)
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
