<template>
  <div>
    <myHeader></myHeader>

    <div class="goodsIndex-container">

      <div class="goodsIndex-title">热销爆款</div>
      <div class="goodsIndex-subTitle">每周精选。爆款促销</div>

      <el-row :gutter="20">
        <el-col :span="10">
          <div class="type grid-content bg-purple">
            <div>广告位</div>
            <img style="height: 400px;width:500px;" src="https://imgcps.jd.com/ling4/100021400874/6auY5oCn6IO955S16ISR5LyY6YCJ/54iG5qy-55u06ZmN/p-5bd8253082acdd181d02fa5d/1f0a2133/cr/s/q.jpg" alt="">
          </div>
        </el-col>
        <el-col :span="10">
          <div class="type grid-content bg-purple">
            <div>广告位</div>
            <img style="height: 400px;width:500px;" src="https://img30.360buyimg.com/babel/s320x320_jfs/t1/206710/8/3164/135588/6155a3aeE50f6b97d/bc76aed3c0943bff.jpg!cc_320x320.webp" alt="">

          </div>
        </el-col>
      </el-row>

    </div>

    <div class="goodsIndex-search">
      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="商品名">
          <el-input v-model="listQuery.title" placeholder="请输入要查询的商品名称" style="width:300px;"/>
        </el-form-item>
        <el-form-item label="商家">
          <el-input v-model="listQuery.business" placeholder="选择商家" />
        </el-form-item>

          <el-form-item label="价格区间在">

            <el-input-number
              :min="priceMin"
              :step="100"
              @change="handleChange"
              v-model="listQuery.priceRange1"
              placeholder="最小"
              style="width:150px;"/>

            <span style="color:indianred">￥</span>
            <span style="padding:30px">  到  </span>

            <el-input-number
              :min="priceMin"
              :step="100"
              v-model="listQuery.priceRange2"
              placeholder="最大"
              style="width:150px;"/>
            <span style="color:indianred">￥</span>

          </el-form-item>

        <el-form-item label="排序">
          <el-select v-model="listQuery.sortType" placeholder="选择商品排序方式">
            <el-option :value="0" label="按销量排序" />
            <el-option :value="1" label="按评论数排序" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <button class="custom-btn btn-16" @click="searchGoods(page)">搜 索</button>
        </el-form-item>
      </el-form>
    </div>

    <div class="goodsIndex-goods">

      <!--商品评论区-->
      <Hints v-if="goodsList.length === 0">
        <template slot="hintInfo">
          <p style="text-align: center;color:grey;font-size: 15px;padding:100px">无相关内容</p>
        </template>
      </Hints>


      <el-row>
        <el-col :span="8" v-for="(g, index) in goodsList" :key="index" >
          <el-card class="goodsCard" :body-style="{ padding: '0px' }" >
            <div @click="toDetail(g.goodsId)">
              <img style="width:150px;height:150px" :src="g.goodsImg" class="image" >
              <div style="padding: 14px;">
                <div>{{g.title}}</div>
                <span style="font-weight:700;color:indianred">{{g.price}}￥</span>
                <span style="color:grey;font-size: 12px;" v-if="listQuery.sortType === 0">{{ g.countBuy }}人购买</span>
                <span style="color:grey;font-size: 12px;" v-if="listQuery.sortType === 1">{{ g.countBuy }}人评论</span>

              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>


    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="searchGoods"
    />


  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  import Hints from "../../components/Hints";
  export default {
    name: "goodsIndex",
      components:{
        myHeader,Hints,
      },
    data() {
      return {
        //查询表单
        listQuery:{
          title:'',
          business:'',
          priceRange1:0,
          priceRange2:0,
          sortType:0, // 0：按销量，1：按评论数量
        },
        //价格查询的最低值
        priceMin:0,

        //商品列表
        goodsList:[],
        //商品总数
        total:0,
        page:1,
        pageSize:8,

        name:localStorage.getItem("name"),

      }
    },
    created() {
      this.searchGoods(1)
    },

    methods: {

      //跳转商品页面
      toDetail(goodsId){
        this.$router.push({path:`/goods/${goodsId}`})
      },

      //查询商品
      searchGoods(page = 1){
        this.page = page
        let pageSize = this.pageSize
        this.$axios({
          method:'post',
          url:`http://localhost:8082/goods/getSearchGoods/${this.page}/${pageSize}`,
          headers:{
            token:localStorage.getItem("token")
          },
          data:{
            goodsSearchVo:this.listQuery
          }
        }).then(res=>{
          if(res.data.success){
            this.goodsList = res.data.data.goodsList
            this.total = res.data.data.total
          }
        }).catch(error=>{
        })

      },

      //让价格上限的值 跟随最低值变化
      handleChange(value) {
        this.priceMin = value
        if(this.listQuery.priceRange2 < this.listQuery.priceRange1){
          this.listQuery.priceRange2 = value + 1
        }
      },


    },
  }
</script>

<style scoped>
  .goodsIndex-container{
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    margin: 20px auto;
    width: 1400px;
    height: auto;

    border: 1px solid #ededed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background-color: white;

    padding: 20px;

  }

  .goodsIndex-title{
    font-weight: 900;
    font-size: 20px;
    margin:auto;
    padding:20px;
    height:20px;
    text-align: center;
  }

 .goodsIndex-subTitle{
   color:grey;
   font-size: 14px;
   height:30px;
   text-align: center;
 }



  .bg-purple {

  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .type{
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
    padding: 10px;
      margin: auto;
      text-align: center;
  }

  .goodsIndex-goods{
    align-items: center;
    border-radius: 10px;
    margin: 20px auto;
    width: 1400px;
    height: auto;

    border: 1px solid #ededed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background-color: white;

    padding: 20px;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    list-style: none;
  }

  .goodsIndex-search{
    align-items: center;
    border-radius: 10px;
    margin: 20px auto;
    width: 1400px;
    height: auto;

    border: 1px solid #ededed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background-color: white;

    padding: 20px;
  }

  .goodsCard{
    cursor: pointer;
    transition: all 0.6s;

    list-style: none;

    text-align: center;
    width: 250px; /*每个元素的初始化宽度*/
    height:250px;
    margin-top: 30px;
    /*margin-bottom: 10px;*/
    margin-left:100px;
    flex:auto;  /*这是关键*/

    padding: 10px;

    /*box-shadow: 0 10px 5px rgba(0,0,0,.1);*/
  }

  .goodsCard:hover{
    color:#409eff;
    transform: scale(1.1);
  }

  /*搜索框7*/
  .bar7 {background: #7BA7AB;}
  .bar7 form {
    height: 42px;
  }
  .bar7 input {
    width: 250px;
    border-radius: 42px;
    border: 2px solid #324B4E;
    background: #F9F0DA;
    transition: .3s linear;
    float: right;
  }
  .bar7 input:focus {
    width: 300px;
  }
  .bar7 button {
    background: none;
    top: -2px;
    right: 0;
  }
  .bar7 button:before{
    content: "\f002";
    font-family: FontAwesome;
    color: #324b4e;
  }




  .custom-btn {
    width: 130px;
    height: 40px;
    color: #fff;
    border-radius: 5px;
    padding: 10px 25px;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
    7px 7px 20px 0px rgba(0,0,0,.1),
    4px 4px 5px 0px rgba(0,0,0,.1);
    outline: none;
  }

  .btn-16 {
    border: none;
    color: #000;
  }
  .btn-16:after {
    position: absolute;
    content: "";
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    direction: rtl;
    z-index: -1;
    box-shadow:
      -7px -7px 20px 0px #fff9,
      -4px -4px 5px 0px #fff9,
      7px 7px 20px 0px #0002,
      4px 4px 5px 0px #0001;
    transition: all 0.3s ease;
  }
  .btn-16:hover {
    color: #000;
  }
  .btn-16:hover:after {
    left: auto;
    right: 0;
    width: 100%;
  }
  .btn-16:active {
    top: 2px;
  }

</style>
