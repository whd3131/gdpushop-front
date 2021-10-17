<template>
  <div class="table-classic-wrapper">

    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">新建数据</el-button>
      </div>


      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="商家ID">
          <el-input v-model="listQuery.businessId" placeholder="商家ID" />
        </el-form-item>
        <el-form-item label="商家名称">
          <el-input v-model="listQuery.businessName" placeholder="商家名称" />
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
        <el-table-column prop="businessId" label="商家ID" align="center" width="180" />
        <el-table-column prop="businessName" label="商家名称" align="center" width="120" />
        <el-table-column prop="businessContent" label="商家简介" align="center"  show-overflow-tooltip/>
        <el-table-column prop="countPraise" label="商家好评数量" align="center" width="120" />
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
        width="50%"
        class="dialog-form"
        :before-close="handleClose"
      >
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          label-width="200px"
        >
          <el-form-item label="商家名称" prop="businessName">
            <el-input v-model="dialogForm.businessName" />
          </el-form-item>
          <el-form-item label="商家简介" prop="businessContent">
            <el-input v-model="dialogForm.businessContent" />
          </el-form-item>
          <div class="footer-item">
            <el-button @click="cancleForm">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="submitForm('dialogForm')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>


    </el-card>
  </div>
</template>

<script>
  import excel from '../../utils/excel'
  import Pagination from '../../components/Pagination'
  import Upload from '../../components/Upload'
  import axios from 'axios'

  export default {
    name: 'Business',
    components: { Pagination, Upload },
    data() {
      return {
        // 数据列表加载动画
        listLoading: true,
        // 查询列表参数对象
        listQuery: {
          businessName:'',
          businessContent:'',
          currentPage: 1,
          pageSize: 5
        },
        // 新增/编辑提交表单对象
        dialogForm: {
          businessName:undefined,
          businessContent:undefined,
        },
        // 数据总条数
        total: 0,
        // 表格数据数组
        tableData: [],
        // 多选数据暂存数组
        multipleSelection: [],
        // 新增/编辑 弹出框显示/隐藏
        formVisible: false,

        // 防止多次连续提交表单
        isSubmit: false,

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
        this.dialogForm.businessName = undefined
        this.dialogForm.businessContent = undefined

      },
      // 编辑数据
      handleEdit(index, row) {
        console.log(index, row)
        this.formVisible = true
        this.dialogForm.businessName = row.businessName
        this.dialogForm.businessContent = row.businessContent

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
          url:'http://localhost:8082/business/getAllBusiness',
          headers:{
            admin:'admin'
          }
        }).then(res=>{
          this.tableData = res.data.data.businessList
          console.log(this.tableData)
          this.listLoading=false
        }).catch(error=>{

        })
      },


      // 查询数据
      onSubmit() {
        this.listQuery.currentPage = 1
        this.fetchData()
      },


      // 新增/编辑表单确认提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 此处添加 新增/编辑数据的接口 新增成功后调用fetchData方法更新列表
            // 先 this.isSubmit = true 接口返回成功后 再 this.isSubmit = false
            this.isSubmit = true

           axios({
              method:'post',
              url:`http://localhost:8082/business/addBusiness`,
              headers:{
                admin:'admin'
              },
              data:{
                businessName:this.dialogForm.businessName,
                businessContent:this.dialogForm.businessContent,
              }
            }).then(res=>{
              if(res.data.success){
                this.$message.success("操作成功！")
                this.fetchData()
                this.formVisible = false
              }
            }).catch(error=>{
            })


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
