<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="width: 70%">
      <el-form ref="form" :model="data" :rules="rules" label-width="100px">
        <el-form-item label="楼栋名称" prop="name">
          <el-input
            v-model="data.name"
          />
        </el-form-item>
        <el-form-item label="设备1的ID" prop="deviceId1">
          <el-input
            size="small"
            v-model="data.deviceId1"
          />
        </el-form-item>
        <el-form-item label="设备2的ID" prop="deviceId2">
          <el-input
            v-model="data.deviceId2"
          />
        </el-form-item>
        <el-form-item label="所属公司" prop="companyName">
          <el-select v-model="data.companyName" placeholder="请选择公司" @change="compChange">
            <el-option
              v-for="item in compList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构" prop="orgName">
          <el-select v-model="data.orgName" placeholder="请选择机构" @change="orgChange">
            <el-option
              v-for="item in orgList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-radio v-model="data.status" label="有效">启用</el-radio>
          <el-radio v-model="data.status" label="无效">关闭</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="data.remark"
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消保存</el-button>
      <el-button type="primary" @click="addOrUpdateBuild('form')">保存楼栋</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addBuild, updateBuild } from '../../api/build'
import { getCompList } from '../../api/comp'
import { getOrgListByCompId } from '../../api/org'

export default {
  data() {
    return {
      mode: 'add',
      title: '添加楼栋',
      visible: true,
      data: {
        name: '',
        companyId: '',
        companyName: '',
        orgId: '',
        orgName: '',
        status: 'true'
      },
      compList: [],
      orgList: [],
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, message: '长度至少 3 个字符', trigger: 'blur' }
        ],
        deviceId1: [
          { required: true, message: '请输入设备ID', trigger: 'blur' }
        ],
        companyName: [
          { required: true, trigger: 'blur' }
        ],
        orgName: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(mode, data) {
      // 用来进行界面的初始化
      console.log('进行buildInfo界面的初始化')
      this.mode = mode
      this.visible = true
      this.getCompList()
      if (mode === 'update') {
        this.title = '编辑楼栋'
        this.data = data
        this.getOrgList()
      } else {
        this.title = '添加楼栋'
        this.data = {
          name: '',
          companyId: '',
          companyName: '',
          orgId: '',
          orgName: '',
          status: 'true'
        }
      }
    },
    close() {
      this.$emit('refreshList')
      this.visible = false
    },
    addOrUpdateBuild(form) {
      // 先检验，确定没有违反relus，再进行下面的具体操作
      this.$refs[form].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.mode === 'add') {
            this.addBuild()
          } else {
            this.updateBuild()
          }
        } else {
          console.log('error submit!!')
        }
      })
    },
    addBuild() {
      addBuild(this.data).then(response => {
        if (response.code === 4001) {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1000
          })
          this.close()
        } else {
          this.$message({
            message: '添加楼栋失败',
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    updateBuild() {
      updateBuild(this.data).then(response => {
        if (response.code === 4001) {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
          this.close()
        } else {
          this.$message({
            message: '更新楼栋失败',
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    getCompList() {
      getCompList(1, 20000).then(response => {
        console.log(response)
        this.compList = response.data.records
      })
    },
    getOrgList() {
      const companyId = this.data.companyId
      getOrgListByCompId(1, 20000, companyId).then(resp => {
        this.orgList = resp.data.records
      })
    },
    compChange(val) {
      for (const item in this.compList) {
        if (this.compList[item].name === val) {
          this.data.companyId = this.compList[item].id
          break
        }
      }
      this.orgList = []
      delete this.data.orgId
      delete this.data.orgName
      this.getOrgList()
    },
    orgChange(val) {
      for (const item in this.orgList) {
        if (this.orgList[item].name === val) {
          this.data.orgId = this.orgList[item].id
          break
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
