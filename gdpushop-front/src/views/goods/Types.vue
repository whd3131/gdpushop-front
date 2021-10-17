<template>
  <div>
    <myHeader></myHeader>

<!--    该分类热门购买-->
    <div class="zuckContainer">
      <div class="remen">
        <div class="container">
          <div v-if="goodsList[0] != null" class="box" @click="gotoDetail(goodsList[0].goodsId)">
            <h2>01</h2>
            <h3>{{goodsList[0].title}}</h3>
            <p v-html="good0Content">
            </p>
            <img style="height:200px;width:200px" :src="goodsList[0].goodsImg" >
          </div>
          <div v-if="goodsList[1] != null" class="box" @click="gotoDetail(goodsList[1].goodsId)">
            <h2>02</h2>
            <h3>{{goodsList[1].title}}</h3>
            <p v-html="good1Content">
            </p>
            <img style="height:200px;width:200px" :src="goodsList[1].goodsImg" >
          </div>
          <div v-if="goodsList[2] != null" class="box" @click="gotoDetail(goodsList[2].goodsId)">
            <h2>03</h2>
            <h3>{{goodsList[2].title}}</h3>
            <p v-html="good2Content"></p>
            <img style="height:200px;width:200px" :src="goodsList[2].goodsImg" >
          </div>
        </div>
      </div>

<!--      展示每一个商品-->

      <div class="con-1">
        <div class="con-2">

          <!-- 查询栏 -->
          <el-form
            ref="searchForm"
            :inline="true"
            :model="listQuery"
            label-width="90px"
            class="search-form"
          >
            <el-form-item label="商品名">
              <el-input v-model="listQuery.title" placeholder="用户名" />
            </el-form-item>
            <el-form-item label="商家">
              <el-input v-model="listQuery.business" placeholder="手机" />
            </el-form-item>
            <el-form-item label="排序">
              <el-select v-model="listQuery.sex" placeholder="选择排序方式">
                <el-option :value="0" label="按销量排序" />
                <el-option :value="1" label="按评论数排序" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="myButton"  @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>

        </div>

<!--        其他所有同类商品-->
        <div class="con-3">

          <el-row style="margin:5px">
            <el-col style="margin:5px" :span="5" v-for="(g, index) in goodsList" :key="index" >
              <el-card style="padding: 5px" :body-style="{ padding: '1px' }">
                <img style="width:100px;height:100px" :src="g.goodsImg" class="image">
                <div style="padding: 20px;">
                  <span>{{g.title}}</span>
                  <div class="bottom clearfix">
                    <time class="time" style="color: indianred">{{g.price}}￥</time>
                    <el-button type="text" class="button" @click="gotoDetail(g.goodsId)">Buy!</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </div>
      </div>


    </div>





  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  export default {
    name: "Types",
    components:{
      myHeader
    },
    data() {
      return {
        typeValue: '',
        goodsList:[],
        listQuery:{ //查询栏

        },
      }
    },
    computed: {
      //商品的描述基本很长，不能直接展示，用开头一段话加省略号代替。
      good0Content() {
        let gc = this.goodsList[0].goodsContent.slice(0,20);
        gc += "...";
        return gc;
      },
      good1Content() {
        let gc = this.goodsList[1].goodsContent.slice(0,20);
        gc += "...";
        return gc;
      },
      good2Content() {
        let gc = this.goodsList[2].goodsContent.slice(0,20);
        gc += "...";
        return gc;
      }
    },
    created() {
      if(this.typeValue === ''){
        this.typeValue = this.$route.params.typeValue
      }

      this.initGoods()
    },
    methods: {
      //跳转到商品详情页面
      gotoDetail(goodsId){
        this.$router.push({path:`/goods/${goodsId}`})
      },

      //根据商品查询该分类下所有的商品信息
      initGoods() {
        let catId = this.typeValue
        if(catId == null){
          return
        }
        this.$axios({
          methods:'get',
          url:`http://localhost:8082/goods/getGoodsByCatValue/${catId}`,
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res=>{
          this.goodsList = res.data.data.goodsList
          console.log( this.goodsList)
        }).catch(error=>{

        })
      }
    },
  }
</script>

<style scoped>

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  /**/

  @import url('https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap');
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }
  body{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(#0f4675, #0f4675 50%, #fff 50%, #fff 100%);
  }
  .container{
    width: 1100px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .container .box{
    position: relative;
    width: 320px;
    background: #fff;
    padding: 100px 40px 60px;
    box-shadow: 0 15px 45px rgba(0,0,0,.1);
  }
  .container .box:before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ff226d;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.5s;
  }
  .container .box:hover:before{
    transform: scaleY(1);
    transform-origin: bottom;
    transition: transform 0.5s;
  }
  .container .box h2{
    position: absolute;
    left: 40px;
    top: 60px;
    font-size: 4em;
    font-weight: 800;
    z-index: 1;
    opacity: 0.1;
    transition: 0.5s;
  }
  .container .box:hover h2{
    opacity: 1;
    color: #fff;
    transform: translateY(-40px);
  }
  .container .box h3{
    position: relative;
    font-size: 1.5em;
    z-index: 2;
    color: #333;
    transition: 0.5s;
  }
  .container .box p{
    position: relative;
    z-index: 2;
    color: #555;
    transition: 0.5s;
  }
  .container .box:hover h3,
  .container .box:hover p{
    color: #fff;
  }


/*
*/

  .zuckContainer{
    width:1150px;
    height:1400px;

    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;

    border: 5px solid #ededed;
    box-shadow: 0 0 40px #ddd;
  }

  .remen{
    width:1150px;
    height:500px;

    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;

    border: 5px solid #ededed;
  }

  .con-1{
    margin-top:100px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    list-style: none;
  }

  .con-2{
    padding:20px;
    margin:5px;
    box-shadow: 0 10px 5px rgba(0,0,0,.1);
  }

  .con-3{
    padding:10px;

    list-style: none;

    text-align: center;

    width: 180px; /*每个元素的初始化宽度*/
    /*margin-top: 10px;*/
    /*margin-bottom: 10px;*/
    margin:10px;
    flex:auto;  /*这是关键*/

    /*box-shadow: 0 10px 5px rgba(0,0,0,.1);*/
  }

  .myButton{
    width:100px;
    height:40px;
    border-radius: 10px;

  }

</style>
