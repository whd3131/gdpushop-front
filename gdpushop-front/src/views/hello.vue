<template>
  <div>
    <el-button @click="hello">点我发送请求</el-button>

    <el-table
      :data="personList"
      style="width: 100%">
      <el-table-column
        label="ID"
        width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>是否被删除: {{ scope.row.isDeleted }}</p>
            <p>创建时间: {{ scope.row.createTime }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
  export default {
    name: "hello",
    data() {
      return {
        res: '',
        personList:[],
      }
    },
    created() {
      this.hello()
    },
    methods: {
      hello() {
        // this.$axios.get('http://localhost:8080/hello')
        // .then((response)=>{
        //   this.res = response
        // })

        this.$axios.get('http://localhost:8082/person/getAll',{
          params:{
            id:123
          }
        })
        .then((response)=>{
          this.res = response.data.data.list
          this.personList = response.data.data.list

          console.log(response)
        })
        .catch((error)=>{
          console.log(error)
        })

      },

      //编辑
      handleEdit(index, row){
          console.log(index+'--'+row)
          console.log("id:"+row.id)
      },
      //删除
      handleDelete(){

      }


    },
  }
</script>

<style scoped>

</style>
