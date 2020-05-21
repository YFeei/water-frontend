<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="width: 70%">
      <el-form ref="form" :model="data" label-width="100px" disabled>
        <el-form-item label="公司ID" prop="id">
          <el-input
            v-model="data.id"
          />
        </el-form-item>
        <el-form-item label="公司名称" prop="name">
          <el-input
            v-model="data.name"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input
            v-model="data.addr"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input
            v-model="data.manager"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input
            v-model="data.telephone"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="data.remark"
          />
        </el-form-item>
        <el-form-item label="使用状态">
          <el-switch
            v-model="data.status"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
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
      title: '公司详情信息',
      data: {},
      visible: true
    }
  },
  methods: {
    init(data) {
      console.log('进行compDetail界面的初始化, data : ' + data)
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
