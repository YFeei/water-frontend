<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="width:60%">
      <el-form ref="form" :model="data" label-width="80px">
        <el-form-item label="权限名">
          <el-input
            v-model="data.name"
            placeholder="请输入权限名"
          />
        </el-form-item>
        <el-form-item label="权限url">
          <el-input
            v-model="data.url"
            placeholder="请输入权限编码"
          />
        </el-form-item>
        <el-form-item label="权限编码">
          <el-input
            v-model="data.perm"
            placeholder="请输入权限编码"
          />
        </el-form-item>
        <el-form-item label="优先度">
          <el-input
            v-model="data.seq"
            placeholder="请输入优先度"
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
        <el-form-item label="权限类型">
          <el-radio-group v-model="data.type">
            <el-radio label="菜单">菜单</el-radio>
            <el-radio label="按钮">按钮</el-radio>
            <el-radio label="数据">数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" />
        </el-form-item>
        <el-form-item label="父级权限">
          <el-cascader
            v-model="data.pid"
            :options="permList"
            :props="defaultProps"
            :show-all-levels="false"
          />
        </el-form-item>
        <!--<el-form-item label="所属公司">
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
        </el-form-item>-->
      </el-form>
    </div>
    <el-button @click="test">test</el-button>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">关闭</el-button>
      <el-button type="primary" @click="addOrUpdatePerm()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addPerm, updatePerm } from '@/api/perm'

export default {
  data() {
    return {
      visible: true,
      mode: 'add',
      title: '添加权限',
      data: {
        name: '',
        type: 1,
        parentId: 0,
        role: ''
      },
      permList: [],
      selectedPerm: [],
      isChanged: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        checkStrictly: true,
        value: 'id',
        emitPath: false
      }
    }
  },
  methods: {
    init1(mode, list, data, pid = 1) {
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
      this.permList = list
      if (mode === 'update') {
        this.data = data
        this.title = '编辑权限'
      } else if (mode === 'add') {
        this.data = {
          name: '',
          type: '菜单',
          pid: pid,
          url: '',
          perm: '',
          seq: 10,
          remark: '',
          id: 1
        }
      }
    },
    addOrUpdatePerm() {
      this.data.rid = this.selectedPerm.join(',').toString()
      if (this.mode === 'add') {
        this.addPerm()
      } else if (this.mode === 'update') {
        this.updatePerm()
      }
    },
    addPerm() {
      this.data.rId = this.selectedPerm.join(',')
      addPerm(this.data).then(resp => {
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
    updatePerm() {
      const data = this.data
      data.rId = this.selectedPerm.join(',')
      // delete data.createTime
      // delete data.updateTime
      updatePerm(data).then(resp => {
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
      console.log(this.data)
    }
  }
}
</script>

<style scoped>

</style>
