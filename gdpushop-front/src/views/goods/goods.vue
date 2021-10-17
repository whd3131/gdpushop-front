<template>

  <div>
    <myHeader></myHeader>



<!--    具体商品的信息 -->
    <div class="goodsHeader">

      <el-row :gutter="20">
        <el-col :span="8">

          <!--商品图片-->
          <el-carousel indicator-position="outside">
            <el-carousel-item>
              <img :src="goods.goodsImg" alt="">
            </el-carousel-item>
            <el-carousel-item>
              <img :src="goods.goodsImg" alt="" class="my-img">
            </el-carousel-item>
          </el-carousel>

          <!--商品信息-->
        </el-col>
        <el-col :span="16">
          <div class="goodsMiaoSha">
            <i class="el-icon-message-solid"></i>
            广药秒杀
            <span class="MiaoShaClose">距离结束：{{nowDate}}</span>
          </div>
          <div class="grid-content bg-purple">
            <div class="shortShow">
              <p class="goodsTitle">{{goods.title}}</p>
              <li>价格：<span class="goodsPrice">{{goods.price}}￥</span></li>
              <li>分类：{{goods.catId}}</li>
              <li>浏览量：{{goods.countView}}</li>
              <li>{{goods.countBuy}}人已购买</li>
              <li>{{goods.countComment}}位同学评论了它</li>
              <li>商家：
                <el-tooltip class="item" effect="dark" :content="business.businessContent" placement="bottom">
                  <el-button type="text">{{business.businessName}}</el-button>
                </el-tooltip>
              </li>
              <li>商家好评数量：<span style="color: indianred">{{business.countPraise}}</span></li>
            </div>

          </div>
        </el-col>


        <div class="goodsBuy">
          <el-input-number v-model="num" @change="handleChange" :min="1" :max="999" label="购买数量"></el-input-number>
          <el-button plain @click="addCart()">加入购物车</el-button>
          <span style="font-size: 12px;color: slategrey">温馨提示 ·支持7天无理由退货(激活后不支持)</span>

        </div>

        <!--  商品介绍-->
        <div class="goodInfo">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商品介绍" name="first">
              <p v-html="goods.goodsContent"></p>
            </el-tab-pane>
            <el-tab-pane label="规格与包装" name="second">规格与包装</el-tab-pane>
            <el-tab-pane label="售后保障" name="third">售后保障</el-tab-pane>
            <el-tab-pane label="商品评价" name="fourth">

              <!--商品评论区-->
              <Hints v-if="commentVoList.length === 0">
                <template slot="hintName">{{goods.title}}</template>
                <template slot="hintInfo">
                  <p>该商品暂时无人评论</p>
                  <p>快加入购物车，分享你的评论吧！ </p>
                </template>
              </Hints>

              <div class="comment-add">

                <div class="comment-all" v-for="(c,index) in commentVoList" :key="index">

                  <div class="comment-avatar">
                    <el-avatar style="width: 50px;height: 50px" :src="c.avatar"></el-avatar>

                    <div class="comment-title">
                      {{c.name}}&nbsp&nbsp&nbsp
                      <i class="comment-title-i">同学评论了此商品：</i>
                    </div>
                  </div>




                  <div class="comment-time">
                    {{c.createTime}}
                  </div>

                  <!--评分-->
                  <div class="comment-rate">
                    <el-rate
                      v-model="c.rate"
                      disabled
                      text-color="#ff9900"
                    >
                    </el-rate>
                  </div>

                  <div class="content-body">
                    评论内容：{{c.content}}
                  </div>


                </div>

                <!-- 分页 -->
                <el-pagination v-if="commentVoList.length !== 0"
                  background
                  :current-page="page"
                  :page-size="limit"
                  :total="total"
                  style="padding: 30px 0; text-align: center;"
                  layout="total, prev, pager, next, jumper"
                  @current-change="initComment"
                />


                <!--         评分评价 -->
                <div class="block">
                  <span class="demonstration">商品评分</span>
                  <el-rate
                    v-model="rate"
                    :colors="colors">
                  </el-rate>
                </div>



                <el-input
                  type="textarea"
                  :rows="10"
                  placeholder="快来分享你的评论吧~"
                  v-model="user_content"
                  maxlength="250"
                  style="font-size: 15px"
                >
                </el-input>

                <el-button icon="el-icon-chat-line-square" @click="addComment">发表评论</el-button>


              </div>


            </el-tab-pane>
          </el-tabs>
        </div>


      </el-row>


    </div>

  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  import Hints from '../../components/Hints'

  export default {
    name: "goods",
    components:{
      myHeader,Hints,
    },
    data() {
      return {
        goods:{}, //商品详情
        nowDate:'', //目前时间
        timer:'', //秒杀计时器

        activeName: 'first', //标签

        //加入购物车需要的数据
        goodsId:'', //商品ID
        num:'',//购买数量
        userId:'', //用户ID

        rate:1,//用户评分
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],//评分颜色
        user_content:'',//用户的评论

        commentVoList:[],//评论列表

        //分页所需数据
        page:1,//当前页
        limit:5,//每页显示5条
        total:0,//总数据量

        //当前商品的商家信息
        business:{},
      }
    },
    created() {
      //从路由参数中得到商品ID
      this.goodsId = this.$route.params.goodsId

      // 从localStorage取得用户ID
      this.userId = localStorage.getItem('userId')

      // 初始化商品信息
      this.getGoodsInfo(this.goodsId);

      //初始化评论列表
      this.initComment();

      //获得当前时间
      let _this = this;
      this.timer = setInterval(() => {
        const tmpDate = new Date();

        const disHour = 24-tmpDate.getHours()
        const disMin = 60-tmpDate.getMinutes()
        const disSeconds = 60-tmpDate.getSeconds()

        _this.nowDate = disHour + ':' + disMin + ':' + disSeconds
      }, 1000);

      //用户点进来这个页面，就向后台传输数据保存用户的浏览记录
      this.saveHistory();

      //获得商家信息
      this.getBusiness()

    },
    beforeDestroy() {
      // 销毁定时器
      if(this.timer){
        clearInterval(this.timer)
      }
    },
    methods:{
      //获取当前商品的商家信息
      getBusiness(){
        let goodsId = this.goodsId;
        this.$axios({
          method:'get',
          url:`http://localhost:8082/business//getBusinessByGoodsId/${goodsId}`,
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res=>{
          this.business = res.data.data.business
        }).catch(error=>{
        })

      },

      //保存浏览记录
      saveHistory(){
        let goodsId = this.goodsId;
        this.$axios({
          method:'get',
          url:`http://localhost:8082/goods/saveGoodsHistory/${goodsId}`,
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res=>{
        }).catch(error=>{
        })
      },


      //每页显示条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      //当前页改变
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

      // 初始化评论列表
      initComment(page = 1){
        this.page = page
        let _this_ = this
        let goodsId = this.goodsId
        let currentPage = this.page
        let limit = this.limit
        this.$axios({
          method:'post',
          url:`http://localhost:8082/comment/getComment/${goodsId}/${currentPage}/${limit}`,
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res=>{
          this.commentVoList = res.data.data.commentVoList
          this.total = res.data.data.total

          console.log(this.total)
          console.log(this.commentVoList)
        }).catch(error=>{
        })

      },

      //添加一条评论
      addComment(){
        let _this = this

        this.$axios({
          method:'post',
          url:'http://localhost:8082/comment/addComment',
          headers:{
            token:localStorage.getItem('token')
          },
          data:{
            goodsId: this.goodsId,
            userId: this.userId,
            content:this.user_content,
            rate:this.rate,
          },
        }).then(res=>{
          //请求成功
          if(res.data.success){
            _this.$message.success("添加成功")
            _this.$router.go(0)
          }else{
            _this.$message.error("请先登录")
            _this.$router.push("/login")
          }
        }).catch(error=>{
          _this.$message.error("添加失败")
        })


      },

      //加入购物车方法
      addCart(){
        if(localStorage.getItem('token') === null){
          this.$message.error('请先登录！')
          return
        }
        //发送请求，把购物车所需的数据发送到后台
        this.$axios({
          method:'post',
          url:'http://localhost:8082/cart/addCart',
          headers:{
            token:localStorage.getItem('token')
          },
          data:{
            goodsId:this.goodsId,
            num:this.num,
            userId:this.userId,
          }
        })
          .then(res=>{
            if(res.data.state || res.data.success){
              this.$message({
                message:'添加成功',
                type:'success'
              })
            }else{
              this.$message.error('请先登录！')
            }

          })
          .catch(error=>{
            this.$message.error(error)
          })
      },


      // 初始化商品信息
      getGoodsInfo(goodsId){
        // this.$axios.get(`http://localhost:8082/goods/getGood/${goodsId}`).then(
        //   res => {
        //     this.goods = res.data.data.goods
        //
        //   },
        // )

        console.log('************'+localStorage.getItem('token'))
        this.$axios({
          method:'get',
          url:`http://localhost:8082/goods/getGood/${goodsId}`,
          headers:{
            token:localStorage.getItem('token')
          },
        }).then(res =>{
          this.goods = res.data.data.goods
        }).catch(error=>{

        })
      },

      //改变标签
      handleClick(tab, event) {
        console.log(tab, event);
      },

      //改变购买数量
      handleChange(value){
        this.num = value
      }
    }
  }
</script>

<style scoped>


  .block{
    float: right;
    display: flex;
    width: 300px;
    border-radius: 30px;
    box-shadow: 4px 2px 10px #ddd;
    padding: 10px;
    margin: 10px;
  }

  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    min-height: 36px;
    width: 90%;

    padding: 20px;

    margin-top: 50px;
    background: white;
    overflow: hidden;
    border-radius: 10px;

  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .my-img{
    width: auto;
    height: 300px;
  }

  .el-carousel__item h3 {
    color: #fff;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #fff;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #fff;
  }

  .goodsHeader{
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    margin: 30px auto;
    width: 1150px;
    height: auto;

    border: 5px solid #ededed;
    box-shadow: 0 0 40px #ddd;
    background-color: white;

    padding: 30px;
  }

  .goodsPrice{
    color: indianred;
  }

  .goodsTitle{
    font-size: 20px;
    text-align: center;

  }

  .goodsMiaoSha{
    width: 700px;
    height: 40px;
    margin-top: 20px;
    margin-left: 20px;
    text-align: center;
    padding-top: 20px;

    box-shadow: 0 0 40px #ddd;

    background: #fff;
    overflow: hidden;
    border-radius: 10px;

  }

  .MiaoShaClose {
    color: #409EFF;
  }

  .goodsBuy{
    padding-top: 30px;
    padding-left: 100px;

    background: #fff;
    overflow: hidden;

  }

  .goodInfo{
    padding-top: 30px;
    padding-left: 100px;

    background: #fff;
    overflow: hidden;

  }

  .comment-add{
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    background-color: white;

    padding: 50px;


  }

  .content-body{
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 40px #ddd;
    width: 100%;
    font-size: 16px;
    font-weight: 400;

  }






  .comment-all{
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    margin: 20px auto;
    width: auto;
    height: auto;

    border: 5px solid #ededed;
    box-shadow: 0 0 30px #ddd;
    background-color: white;

    padding: 50px;

    /*动画 配合comment-all:hover*/
    transition: box-shadow .8s steps(100);

  }

  .comment-all:hover{
    box-shadow: 0 0 10px #999999;
  }


  .comment-rate{
    padding: 10px;
  }

  .comment-time{
    padding: 10px;
    color: #999999;
    font-size: small;
  }

  .comment-avatar{
    display: flex;
  }

  .comment-title{
    font-weight: 900;
    margin-top: 20px;
    margin-left: 20px;
  }

  .comment-title-i{
    font-weight: 100;
    font-size: small;
  }

  .shortShow{
    margin: 10px;
    padding:10px;
    box-shadow: 0 0 20px #ddd;
    border-radius: 15px;
    transition: box-shadow .3s steps(100);
  }

  .shortShow:hover{
    margin: 10px;
    box-shadow: 0 0 30px #ddd;
    border-radius: 15px;

  }

  .shortShow li{
    padding:5px;
  }
</style>
