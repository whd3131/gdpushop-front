<template>
  <div class="drag-list-wrapper">
    <Hints>
      <template slot="hintName">给商家分配商品</template>
      <template slot="hintInfo">
        <p>直接将商品拖拽到商家栏即可</p>
      </template>
    </Hints>

    <span>请选择商家: </span>
    <!--选择商家-->
    <el-select @change="changeSelect"  v-model="choiceBusiness" placeholder="请选择">
      <el-option
        v-for="item in businessList"
        :key="item.businessId"
        :label="item.businessName"
        :value="item.businessId">
      </el-option>
    </el-select>
    <el-button @click="saveBusinessGoods">保存修改</el-button>


    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="always">
          <div slot="header" class="title">商品列表</div>
          <div v-if="goodsList.length === 0" style="color:gray;text-align: center">没有未分配的商品</div>
          <Draggable v-model="goodsList" group="list" class="list-cont list1" @end="handleChange($event, '列表1')">
            <el-card v-for="(item, index) in goodsList" :key="index" shadow="hover">{{ item.title }}</el-card>
          </Draggable>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="always">
          <div v-if="comBusinessName != null" slot="header" class="title">{{comBusinessName}}</div>
          <div v-if="comBusinessName == null" slot="header" class="title">请先选择商家</div>
          <Draggable v-model="listTwo" group="list" class="list-cont list2" @end="handleChange($event, '列表2')">
            <el-card v-for="(item, index) in listTwo" :key="index" shadow="hover">{{item.title}}</el-card>
          </Draggable>
        </el-card>
      </el-col>
<!--      <el-col :span="4">-->
<!--        <el-card shadow="always">-->
<!--          <div slot="header" class="title">操作记录</div>-->
<!--          <div class="list-cont">-->
<!--            <p v-for="(item, index) in handleList" :key="index">{{ item }}</p>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="5">-->
<!--        <el-card shadow="always">-->
<!--          <div slot="header" class="title">列表1数据</div>-->
<!--          <pre class="list-cont">{{ goodsList }}</pre>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="5">-->
<!--        <el-card shadow="always">-->
<!--          <div slot="header" class="title">列表2数据</div>-->
<!--          <pre class="list-cont">{{ listTwo }}</pre>-->
<!--        </el-card>-->
<!--      </el-col>-->
    </el-row>


  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import Hints from '@/components/Hints'
  import axios from "axios";

  export default {
    name: 'BusinessGoods',
    components: { Draggable, Hints },
    data() {
      return {
        listOne:[],
        listTwo: [],
        handleList: [],

        choiceBusiness:'',//用户所选的商家
        // choiceBusinessName:this.comBusinessName(),
        businessList:[ //商家列表
          {businessId:'',businessName:''}
        ],

        goodsList:[],//商品列表数据
      }
    },
    created() {
      this.initBusinessList()
      this.initGoodsList()
    },
    computed: {
      //用户所选的商家的名字
      comBusinessName() {
        for(let bu of this.businessList){
          if(bu.businessId === this.choiceBusiness){
            return bu.businessName
          }
        }
      }
    },
    methods: {
      //保存当前商家的关联商品
      saveBusinessGoods(){
        let businessId = this.choiceBusiness
        let goodsIdList = []

        for (let g of this.listTwo){
          goodsIdList.push(g.goodsId)
        }

        //发送请求，保存关联关系
        axios({
          method:'post',
          url:'http://localhost:8082/business/addBusinessGoods',
          headers:{
            admin:'admin'
          },
          data:{
            businessId:businessId,
            goodsIdList:goodsIdList,
          }
        }).then(res=>{
          if(res.data.success){
            this.$message.success("保存成功！")
            this.initGoodsList()
            setTimeout(()=>{
              this.$router.go(0)
            },700)
          }else{
            this.$message.error("保存失败！")
          }
        }).catch(error=>{
          this.$message.error("保存失败！")
        })

      },

      //商家选择改变时
      changeSelect(businessId){
        this.listTwo = []
        this.initGoodsList()
      },

      //初始化商品列表:这里的商品是还未分配的商品列表
      initGoodsList(){
        axios({
          method:'get',
          url:'http://localhost:8082/goods/getGoodsNonDistribution',
          headers:{
            admin:'admin'
          }
        }).then(res=>{
          this.goodsList = res.data.data.goodsList
          this.listOne = this.goodsList
          console.log(this.goodsList)
          this.listLoading=false
        }).catch(error=>{

        })
      },

      //初始化商家列表
      initBusinessList(){
        axios({
          method:'get',
          url:'http://localhost:8082/business/getAllBusiness',
          headers:{
            admin:'admin'
          }
        }).then(res=>{
          this.businessList = res.data.data.businessList

          console.log(this.businessList)
        }).catch(error=>{

        })
      },


      handleChange(event, type) {
        const srcClassName = event.from.classList[1]
        const targetClassName = event.to.classList[1]
        let from = ''
        let to = ''
        if (srcClassName === targetClassName) {
          if (type === '列表1') {
            from = '列表1'
            to = '列表1'
          } else {
            from = '列表2'
            to = '列表2'
          }
        } else {
          if (type === '列表1') {
            from = '列表1'
            to = '列表2'
          } else {
            from = '列表2'
            to = '列表1'
          }
        }
        this.handleList.push(`${from} => ${to}, ${event.oldIndex} => ${event.newIndex}`)
      }
    }
  }
</script>

<style lang="less">
  .drag-list-wrapper {
    .list-cont {
      //height: 510px;
      .el-card {
        margin-bottom: 10px;
        .el-card__body {
          padding: 14px 20px;
        }
      }
    }
  }
</style>
