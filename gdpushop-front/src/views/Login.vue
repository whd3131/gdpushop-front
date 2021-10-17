<template>
  <div>
    <myHeader></myHeader>


    <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/schoolLogo.png" alt="avatar" />
      </div>



      <!-- 登录表单 -->
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="60px"
          class="login_form"
        >
          <div class="login_title">
            <h3>登录广药商城</h3>
          </div>


          <el-form-item label="账号" prop="username" >
            <el-input ref="usernameInput" v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              prefix-icon="iconfont icon-3702mima"
            ></el-input>
          </el-form-item>

          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>

        </el-form>



      </div>



    </div>
  </div>

  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  export default {
    name: "Login",
    components:{
      myHeader
    },
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        // 表单验证
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ]
        },

      }
    },
    mounted() {
      // 因为$refs取得标签是在页面渲染之后才可使用的，这里就需要在页面挂载处调用
      this.focusForm()
    },

    methods: {
      //返回主页
      goBack() {
        this.$router.push({path:"/"})
      },


      //在创建时聚焦用户名输入框
      focusForm(){
        this.$refs.usernameInput.focus()
      },

      // 登录方法
      login() {
         // 发送请求给后台
          this.$axios({
            method:'post',
            url:'http://localhost:8082/user/login',
            data:{
              username:this.loginForm.username,
              password:this.loginForm.password,
            }
          })
        .then(res=>{
          if(res.data.success){
            this.$message({
              message:'登录成功',
              type:'success'
            })

            localStorage.setItem('token',res.data.data.token)

            setTimeout(()=>{
              this.$router.push({path:"/"})
            },500)
            console.log(res.data.data.token)
          }else{
            this.$message.error("用户名或密码错误！")
          }

        })
        .catch(error=>{
          this.$message.error(error)
        })
      },

      // 重置表单
      resetLoginForm(){
        this.loginForm.username = ''
        this.loginForm.password = ''
      }
    },

  }
</script>

<style lang="less" scoped>
  /* // lang="less" 支持less格式
  // scoped vue的指令，只在当前组件生效 */
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 360px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    background-color: #fff;

    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom: 40px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: center;
  }
  .info {
    font-size: 13px;
    margin: 10px 15px;
  }

  .login_title{
    text-align: center;
    font-size: 18px;
    padding: 15px 20px;
    font-family: 微软雅黑,serif;
  }
</style>
