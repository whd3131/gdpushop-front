<template>
  <div>
    <el-card shadow="always">

      <div class="uploadDiv">

        <el-tag>
          <i class="el-icon-download"/>

          <a href="https://edu-zuck.oss-cn-guangzhou.aliyuncs.com/Sample.xlsx">
            点击下载模版</a>
        </el-tag>

        <el-upload
          class="upload-demo"
          drag
          action="http://localhost:8082/category/addCategory"
          :headers='headers'
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
        </el-upload>
      </div>

      <div slot="header" class="title">可选择节点</div>
      <div style="height: 360px;">
        <el-tree
          :data="treeData"
          show-checkbox
          default-expand-all
          :props="defaultProps"
          @check-change="handleCheckChange"
        />
      </div>

      <el-button @click="delNode">删除所选节点</el-button>

    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import methods from "methods";
  import { Message } from 'element-ui'

  export default {
    name: "Category",
    data() {
      return {
        treeData:[
          {
            children:[
              {
                label: '',
              }
            ],
            label:'',
          }
        ],


        props: {
          label: 'label',
          children: 'children',
          value:'value',
          isLeaf: 'leaf'
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        count: 1,

        delData:[], //要删除的节点
      }
    },
    computed: {
      headers() {
        return {admin:'admin'};
      }
    },

    created() {
      this.initTreeData()
    },

    methods: {
      //删除节点
      delNode(){
        // 把所有待删节点的catId数组传给服务器
        let delArray = []
        for(let i of this.delData){
           delArray.push(i.cat_id)
        }
        console.log('delArray'+delArray)

        axios({
          method:'post',
          url:'http://localhost:8082/category/delCategory',
          data:{
            delCatIdArray:delArray
          },
          headers:{
            admin:'admin'
          }
        }).then(res=>{
          if(res.data.success){
            Message.success("删除成功");
            this.$router.go(0)
          }else{
            Message.error("删除失败");
          }
        }).catch(error=>{
          Message.error("删除失败");
        })


      },


      //初始化树形数据
      initTreeData(){
        axios({
          method:'get',
          url:'http://localhost:8082/category/getCategory',
          headers:{
            admin:'admin',
          }
        }).then(res=>{
          this.treeData = res.data.data.categoryVoList;
          console.log(this.treeData)

        }).catch(error=>{

        })

      },

      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }])
        }
        if (node.level > 2) return resolve([])

        setTimeout(() => {
          const data = [{
            name: 'zone' + this.count++,
            leaf: true
          }, {
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++,
            leaf: true
          }]

          resolve(data)
        }, 500)
      },
      handleCheckChange(data, checked, indeterminate) {

        if(checked){
          this.delData.push(data)
        }else{
          this.delData.pop()
        }
      }
    },
  }
</script>

<style scoped>
  .uploadDiv{
    margin: 20px;
    height: 250px;

  }
</style>
