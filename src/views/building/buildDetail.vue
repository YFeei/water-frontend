<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="width: 70%">
      <el-form ref="form" :model="data" label-width="100px" disabled >
        <el-form-item label="楼栋ID" prop="id">
          <el-input
            v-model="data.id"
          />
        </el-form-item>
        <el-form-item label="楼栋名称" prop="name">
          <el-input
            v-model="data.name"
          />
        </el-form-item>
        <el-form-item label="公司ID" prop="manager">
          <el-input
            v-model="data.companyId"
          />
        </el-form-item>
        <el-form-item label="公司名称" prop="telephone">
          <el-input
            v-model="data.companyName"
          />
        </el-form-item>
        <el-form-item label="机构ID" prop="addr">
          <el-input
            v-model="data.orgId"
          />
        </el-form-item>
        <el-form-item label="机构名称" prop="addr">
          <el-input
            v-model="data.orgName"
          />
        </el-form-item>
        <el-form-item label="设备1的ID" prop="deviceId1">
          <el-input
            v-model="data.deviceId1"
          />
        </el-form-item>
        <el-form-item label="设备2的ID" prop="deviceId2">
          <el-input
            v-model="data.deviceId2"
          />
        </el-form-item>
        <el-form-item label="使用状态">
          <el-switch
            v-model="data.status"
            style="display: block"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="楼栋状态">
          <el-switch
            v-model="data.connected"
            style="display: block"
            active-value="正常"
            inactive-value="离线"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="data.remark"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input
            v-model="data.createTime"
          />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input
            v-model="data.updateTime"
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: '楼栋详情信息',
      data: {},
      visible: true
    }
  },
  methods: {
    init(data) {
      console.log('进入buildDetail界面的初始化')
      this.data = data
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
