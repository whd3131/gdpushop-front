<template>
  <div class="table-classic-wrapper">

    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">新建数据</el-button>
        <el-button type="primary" @click="handleImport">导入数据</el-button>
        <el-button type="primary" @click="exportVisible = true">导出数据</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </div>


      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="用户名">
          <el-input v-model="listQuery.id" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="listQuery.phone" placeholder="手机" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="listQuery.sex" placeholder="性别">
            <el-option :value="0" label="男" />
            <el-option :value="1" label="女" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格栏 -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column width="100" label="头像">
          <template scope="scope" >
            <img v-if="scope.row.avatar!==''" style="width: 50px; height: 50px" :src="scope.row.avatar"></img>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="用户名" align="center" width="120" />
        <el-table-column prop="name" label="昵称" align="center" width="120" />
        <el-table-column prop="password" label="密码" align="center" width="120" />
        <el-table-column prop="email" label="邮箱" align="center" width="150" />
        <el-table-column label="性别" align="center" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.sex === 0">男</div>
            <div v-if="scope.row.sex === 1">女</div>

          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机" align="center" />

        <el-table-column label="禁止编辑" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.forbid" @change="stateChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" align="center" width="300" show-overflow-tooltip sortable/>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.forbid" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <Pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="fetchData" />


      <!-- 新增/编辑 弹出栏 -->
      <el-dialog
        title="操作数据"
        :visible.sync="formVisible"
        width="30%"
        class="dialog-form"
        :before-close="handleClose"
      >
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="dialogForm.username" />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="dialogForm.password" />
          </el-form-item>
          <el-form-item label="电话：" prop="phone">
            <el-input v-model="dialogForm.phone" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="dialogForm.email" />
          </el-form-item>
          <el-form-item label="昵称：" prop="username">
            <el-input v-model="dialogForm.name" />
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-select v-model="dialogForm.sex">
              <el-option :value="0" label="男" />
              <el-option :value="1" label="女" />
            </el-select>
          </el-form-item>

          <div class="footer-item">
            <el-button @click="cancleForm">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="submitForm('dialogForm')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>


      <!-- 导入数据 弹出栏 -->
      <el-dialog
        title="导入数据"
        :visible.sync="importVisible"
        width="20%"
      >
        <div class="upload-box">
          <span>选择文件：</span>
          <Upload :files-format="filesFormat">
            <i class="vue-dsn-icon-upload" />上传文件
          </Upload>
        </div>
        <div class="hints">TIP：请选择要导出数据的格式。</div>
        <span slot="footer">
          <el-button @click="cancleImport">取 消</el-button>
          <el-button type="primary" @click="confirmImport">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 导出数据 弹出栏 -->
      <el-dialog
        title="导出数据"
        :visible.sync="exportVisible"
        width="30%"
      >
        <div class="export-data">
          <el-button type="primary" @click="exportTable('xlsx')">EXCEL格式</el-button>
          <el-button type="primary" @click="exportTable('csv')">CSV格式</el-button>
          <el-button type="primary" @click="exportTable('txt')">TXT格式</el-button>
        </div>
        <div class="hints">TIP：请选择要导出数据的格式。</div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { getTableList } from '../../api'
  import excel from '../../utils/excel'
  import Pagination from '../../components/Pagination'
  import Upload from '../../components/Upload'
  import axios from 'axios'
  import methods from "methods";

  export default {
    name: 'User',
    components: { Pagination, Upload },
    data() {
      return {
        // 数据列表加载动画
        listLoading: true,
        // 查询列表参数对象
        listQuery: {
          username: undefined,
          phone: undefined,
          sex: undefined,
          currentPage: 1,
          pageSize: 5
        },
        // 新增/编辑提交表单对象
        dialogForm: {
          username: undefined,
          password: undefined,
          phone: undefined,
          email:undefined,
          name:undefined,
          sex:undefined,

        },
        // 数据总条数
        total: 0,
        // 表格数据数组
        tableData: [],
        // 多选数据暂存数组
        multipleSelection: [],
        // 新增/编辑 弹出框显示/隐藏
        formVisible: false,
        // 表单校验 trigger: ['blur', 'change'] 为多个事件触发
        formRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ]
        },
        // 防止多次连续提交表单
        isSubmit: false,
        // 导入数据 弹出框显示/隐藏
        importVisible: false,
        // 导出文件格式
        filesFormat: '.txt, .csv, .xls, .xlsx',
        // 导出数据 弹出框显示/隐藏
        exportVisible: false
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 多选操作
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 新建数据
      handleCreate() {
        this.formVisible = true
        this.dialogForm.username = undefined
        this.dialogForm.password = undefined
        this.dialogForm.phone = undefined
        this.dialogForm.email = undefined
        this.dialogForm.name = undefined
        this.dialogForm.sex = undefined
      },
      // 编辑数据
      handleEdit(index, row) {
        console.log(index, row)
        this.formVisible = true
        this.dialogForm.username = row.username
        this.dialogForm.password = row.password
        this.dialogForm.phone = row.phone
        this.dialogForm.email = row.email
        this.dialogForm.name = row.name
        this.dialogForm.sex = row.sex

      },
      // 删除数据
      handleDelete(index, row) {
        console.log(index, row)
        this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 此处可添加--删除接口
          // 删除成功调用fetchData方法更新列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 批量删除
      batchDelete() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            message: '请先选择要删除的数据！',
            type: 'warning'
          })
        } else {
          this.handleDelete()
        }
      },
      // 新增/编辑弹出框 关闭时操作
      handleClose() {
        this.formVisible = false
        this.$refs.dialogForm.resetFields()
      },
      // 获取数据列表
      fetchData() {
        this.listLoading = true
        // 获取数据列表接口
        axios({
          method:'get',
          url:'http://localhost:8082/user/getUserList',
          headers:{
            admin:'admin'
          }
        }).then(res=>{
          this.tableData = res.data.data.userList
          console.log(this.tableData)
          this.listLoading=false
        }).catch(error=>{

        })


        // getTableList(this.listQuery).then(res => {
        //   const data = res.data
        //   if (data.code === 0) {
        //     this.total = data.data.total
        //     this.tableData = data.data.list
        //     this.listLoading = false
        //   }
        // }).catch(() => {
        //   this.listLoading = false
        // })
      },
      // 查询数据
      onSubmit() {
        this.listQuery.currentPage = 1
        this.fetchData()
      },
      // 导入数据
      handleImport() {
        this.importVisible = true
      },
      // 新增/编辑表单确认提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 此处添加 新增/编辑数据的接口 新增成功后调用fetchData方法更新列表
            // 先 this.isSubmit = true 接口返回成功后 再 this.isSubmit = false
            this.formVisible = false
          } else {
            this.isSubmit = false
            return false
          }
        })
      },
      // 新增/编辑表单取消提交
      cancleForm() {
        this.$refs.dialogForm.resetFields()
        this.formVisible = false
      },
      // 导入数据弹出栏 确认操作
      confirmImport() {
        // 此处添加 后台接收的接口，将导入的数据传给后台处理
        this.importVisible = false
      },
      // 导入数据弹出栏 取消操作
      cancleImport() {
        // 将导入的数据清空
        this.importVisible = false
      },
      // 导出数据--excle格式
      exportTable(type) {
        if (this.tableData.length) {
          const params = {
            header: [ '用户名', '密码', '邮箱', '性别', '手机', '禁止编辑', '创建日期'],
            key: [ 'username', 'password', 'email', 'sex', 'phone', 'isDeleted', 'createTime'],
            data: this.tableData,
            autoWidth: true,
            fileName: '用户列表',
            bookType: type
          }
          excel.exportDataToExcel(params)
          this.exportVisible = false
        }
      },
      // 列表中婚姻状况栏，状态值改变时，调用
      selectChange(row) {
        // 此处添加后台接口，成功后调用fetchData方法更新列表
      },
      // 列表中禁止编辑栏，状态值改变时，调用
      stateChange(row) {
        // 此处添加后台接口，成功后调用fetchData方法更新列表
      }
    }
  }
</script>

<style lang="less">
  .table-classic-wrapper {
    .el-card {
      min-height: 656px;
    }
    .control-btns {
      margin-bottom: 20px;
    }
    .search-form {
      padding-top: 18px;
      margin-bottom: 15px;
      background-color: #f7f8fb;
    }
    .el-table thead {
      font-weight: 600;
      th {
        background-color: #f2f3f7;
      }
    }
    .dialog-form {
      .el-input {
        width: 380px;
      }
      .footer-item {
        margin-top: 50px;
        text-align: right;
      }
    }
    .upload-box,
    .export-data {
      width: 300px;
      margin: 0 auto 30px;
    }
    .upload-box {
      width: 156px;
      .files-upload {
        color: #20a0ff;
      }
    }
    .hints {
      font-size: 12px;
      color: #aaa;
      text-align: center;
    }
  }
</style>
