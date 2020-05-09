<template>
  <div class="app-container">
    <el-table
      v-loading="ListLoading"
      :data="userList"
      style="width: 100%;"
      :cell-style="{paddingTop:'10px',paddingBottom:'10px'}"

      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        header-align="left"
        align="left"
        width="300"
        label="用户名"
      >
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="联系电话"
      >
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="状态"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateStatus(scope.$index,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="showFileInfo(scope.row)">用户详情</el-button>
          <el-button type="warning" plain size="small" @click="enterFile(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="small" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="updateStatus(12,'有效')" />
  </div>
</template>

<script>
import { getUserList, updateUserStatus } from '@/api/user'
import { hasPerm } from '@/utils/auth'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      userList: [
        {
          'editorId': null,
          'sessionKey': null,
          'openId': '1',
          'telephone': '12334445',
          'updateTime': '2019-10-10 00:04:08',
          'rId': '2',
          'orgId': 1,
          'companyId': 1,
          'password': '123',
          'deleted': 0,
          'createTime': '2019-10-10 00:04:08',
          'deleteTime': null,
          'id': 1,
          'account': 'yfeei',
          'status': 'VALID_STATUS',
          'username': 'yfeei'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '1234345667',
          'updateTime': '2019-10-20 07:22:59',
          'rId': '1',
          'orgId': 1,
          'companyId': 1,
          'password': '123456',
          'deleted': 0,
          'createTime': '2019-10-20 07:22:59',
          'deleteTime': null,
          'id': 3,
          'account': 'yefei',
          'status': 'INVALID_STATUS',
          'username': 'yefei'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '98765432109',
          'updateTime': '2019-11-09 05:48:28',
          'rId': '1',
          'orgId': 0,
          'companyId': 0,
          'password': '0',
          'deleted': 0,
          'createTime': '2019-11-09 05:48:28',
          'deleteTime': null,
          'id': 4,
          'account': 'test0',
          'status': 'VALID_STATUS',
          'username': 'test0'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '98765432109',
          'updateTime': '2019-11-09 05:48:28',
          'rId': '1',
          'orgId': 1,
          'companyId': 1,
          'password': '1',
          'deleted': 0,
          'createTime': '2019-11-09 05:48:28',
          'deleteTime': null,
          'id': 5,
          'account': 'test1',
          'status': 'VALID_STATUS',
          'username': 'test1'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '98765432109',
          'updateTime': '2019-11-09 05:48:28',
          'rId': '1',
          'orgId': 2,
          'companyId': 2,
          'password': '2',
          'deleted': 0,
          'createTime': '2019-11-09 05:48:28',
          'deleteTime': null,
          'id': 6,
          'account': 'test2',
          'status': 'VALID_STATUS',
          'username': 'test2'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '98765432109',
          'updateTime': '2019-11-09 05:48:28',
          'rId': '1',
          'orgId': 3,
          'companyId': 3,
          'password': '3',
          'deleted': 0,
          'createTime': '2019-11-09 05:48:28',
          'deleteTime': null,
          'id': 7,
          'account': 'test3',
          'status': 'VALID_STATUS',
          'username': 'test3'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '98765432109',
          'updateTime': '2019-11-09 05:48:28',
          'rId': '1',
          'orgId': 4,
          'companyId': 4,
          'password': '4',
          'deleted': 0,
          'createTime': '2019-11-09 05:48:28',
          'deleteTime': null,
          'id': 8,
          'account': 'test4',
          'status': 'VALID_STATUS',
          'username': 'test4'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '98765432109',
          'updateTime': '2019-11-09 05:48:29',
          'rId': '1',
          'orgId': 0,
          'companyId': 5,
          'password': '5',
          'deleted': 0,
          'createTime': '2019-11-09 05:48:29',
          'deleteTime': null,
          'id': 9,
          'account': 'test5',
          'status': 'VALID_STATUS',
          'username': 'test5'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '98765432109',
          'updateTime': '2019-11-09 05:48:29',
          'rId': '1',
          'orgId': 1,
          'companyId': 6,
          'password': '6',
          'deleted': 0,
          'createTime': '2019-11-09 05:48:29',
          'deleteTime': null,
          'id': 10,
          'account': 'test6',
          'status': 'VALID_STATUS',
          'username': 'test6'
        },
        {
          'editorId': null,
          'sessionKey': null,
          'openId': null,
          'telephone': '98765432109',
          'updateTime': '2019-11-09 05:48:29',
          'rId': '1',
          'orgId': 2,
          'companyId': 7,
          'password': '7',
          'deleted': 0,
          'createTime': '2019-11-09 05:48:29',
          'deleteTime': null,
          'id': 11,
          'account': 'test7',
          'status': 'VALID_STATUS',
          'username': 'test7'
        }
      ],
      list: null,
      ListLoading: false,
      userListSeclections: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log('perm:' + hasPerm(this.$store.getters.perms, 'list1'))
      this.listLoading = true
      getUserList(1, 10).then(response => {
        this.userList = response.data.records
        this.listLoading = false
      })
    },
    selectionChangeHandle(val) {
      this.userListSelections = val
    },
    updateStatus(index, row) {
      console.log('update' + row.id + ' ' + row.status)
      updateUserStatus(row.id, row.status).then(response => {
        if (response.code !== 4001) {
          this.userList[index].status = row.status === '有效' ? '无效' : '有效'
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
