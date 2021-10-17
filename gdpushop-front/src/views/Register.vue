<template>
  <div>
    <myHeader></myHeader>


    <div class="register">

      <h1 class="register_label">注册用户</h1>


      <div class="leftBackground">
        <span></span>
      </div>

      <el-row class="register_box">
        <el-col :span="19">
          <div class="grid-content left">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

              <el-form-item label="用户名：" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名" ></el-input>
              </el-form-item>

              <el-form-item label="密码：" prop="password">
                <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
              </el-form-item>

              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>

              <el-form-item label="电话：" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
              </el-form-item>

              <el-form-item label="昵称：" prop="name">
                <el-input v-model="form.name" placeholder="(选填)"></el-input>
              </el-form-item>

              <el-form-item label="性别：" prop="gender">
                <el-radio-group v-model="form.sex">
                  <el-radio label="0">男</el-radio>
                  <el-radio label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>


              <el-form-item class="btn">
                <el-button type="primary" @click="toSubmit()">注册</el-button>
                <el-button @click="$router.go(-1)">取消</el-button>
              </el-form-item>

            </el-form>
          </div>
        </el-col>

        <el-col :span="5">
          <div class="grid-content img" >
          </div>
        </el-col>

      </el-row>
    </div>
  </div>
</template>
<script>
  import myHeader from '@/components/myHeader.vue';
  export default {
    name: "register",
    components:{
      myHeader
    },
    data() {
      return {
        form: {
          name:'',
          username:'',
          password:"",
          email:"",
          avatar:"",
          sex:"",
          phone:"",
        },
        rules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ],
          phone:[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { min: 11, max: 11, message: '手机号码长度不符合规定', trigger: 'blur' }
          ],

        }

      }
    },
    computed:{
    },
    mounted(){
    },
    methods: {
      //注册
      toSubmit(){
        this.$message(this.form.username)
        this.$axios({
          method:'post',
          url:'http://localhost:8082/user/addUser',
          data:{
              name:this.form.name,
              username:this.form.username,
              password:this.form.password,
              email:this.form.email,
              avatar:this.form.avatar,
              sex:this.form.sex,
              phone:this.form.phone,
          }
        }).then(response=> {
          if(response.data.success){
            this.$message({
              message: '注册成功，2秒后跳转到登录页面',
              type: 'success'
            })
            setTimeout(()=>{
              this.$router.push("/login")
            },1500)
          }
        })
        .catch(error => {
          this.$message.error('注册失败');
        });


      }


    },
  };
</script>

<style>
  .register{
    width: 800px;
    height: 500px;
    background-color: #fff;
    border-radius: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);

    padding-left: 50px;
    padding-right: 50px;
  }

  .register_label{
    font-size: 22px;
    margin: 10px 15px;
    text-align: center;
  }

</style>
