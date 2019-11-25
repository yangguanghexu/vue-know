<template>
  <div class="login">
    <div class="login-tab">
      <a @click="tab = 0" :class="{active:tab == 0}">登录</a>
      <a @click="tab = 1" :class="{active:tab == 1}">注册</a>
    </div>
    <transition name="van-slide-left">
      <div v-show="tab == 0" class="login-main">
        <van-cell-group>
          <van-field
            v-model="username"
            :error-message="errUserName"
            required
            clearable
            label="用户名"
            placeholder="请输入用户名"
          />
          <van-field
            v-model="password"
            :error-message="errUserPassWord"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
            clearable
          />
          <van-field v-model="captcha" required clearable center label="验证码" placeholder="请输入验证码">
            <div
              v-if="captchaImg"
              slot="right-icon"
              v-html="captchaImg.result"
              @click="this.getCaptcha"
            ></div>
          </van-field>
        </van-cell-group>
        <van-button
          @click="goLogin"
          class="login-btn"
          size="large"
          color="linear-gradient(to right, #4bb0ff, #6149f6)"
        >登陆</van-button>
      </div>
    </transition>
    <transition name="van-slide-right">
      <div v-show="tab == 1" class="registration">
        <van-cell-group>
          <van-field v-model="newUserName" required clearable label="用户名" placeholder="请输入用户名" />
          <van-field v-model="newPassWord" type="password"  label="密码" placeholder="请输入密码" required clearable />
          <van-field
            v-model="newPassWordS"
            type="password"
            label="密码"
            placeholder="请重复密码"
            required
          />
        </van-cell-group>
        <van-button
          class="login-btn"
          size="large"
          color="linear-gradient(to right, #4bb0ff, #6149f6)"
          @click="goRegistered"
        >注册</van-button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 0,
      username: null,
      password: null,
      newUserName: null,
      newPassWord: null,
      newPassWordS: null,
      errUserName: null,
      errUserPassWord: null,
      captcha: null,
      captchaImg: null
    };
  },
  watch: {
    username() {
      if (this.username != "") {
        this.errUserName = "";
      }
    },
    password() {
      if (this.username != "") {
        this.errUserPassWord = "";
      }
    }
  },
  methods: {
    goLogin() {
      if (this.username == null || this.username == "") {
        this.errUserName = "请输入用户名";
      } else if (this.password == null || this.password == "") {
        this.errUserPassWord = "请输入密码";
      } else {
        this.$axios
          .post( this.baseURL+"/login", {
            user: this.username,
            password: this.password,
            captcha: this.captcha
          })
          .then(data => {
            if (data.data.code == "200") {
              localStorage.setItem("token", data.data.token);
              this.$router.push('/user')
            } else if (data.data.msg == "验证码不正确") {
              this.$notify({ type: "danger", message: "验证码不正确" });
              this.captcha = ""
              this.getCaptcha()
            } else {
              this.$notify({ type: "danger", message: "帐号或密码不正确" });
              this.captcha = ""
              this.getCaptcha()
            }
          })
          .catch(function(error) {
            this.$notify({ type: "danger", message: error });
          });
      }
    },
    goRegistered() {
      if (
        this.newUserName == null ||
        this.newUserName == "" ||
        this.newUserName.length < 8
      ) {
        this.$notify({ type: "danger", message: "请输入用户名" });
      } else if (
        this.newPassWord !== this.newPassWordS ||
        this.newPassWordS.length < 8
      ) {
        this.$notify({ type: "danger", message: "两次密码输入不一致" });
      } else {
        this.$axios
          .post(this.baseURL+"/registered", {
            user: this.newUserName,
            password: this.newPassWord
          })
          .then(data => {
            window.console.log(data);
          });
      }
    },
    getCaptcha() {
      window.console.log(this.baseURL)
      this.$axios(this.baseURL+'/getCaptcha').then(data => {
        this.captchaImg = data.data;
      });
    }
  },
  created() {
    this.getCaptcha();
  }
};
</script>
<style lang='less' >
* {
  box-sizing: border-box;
}
.login {
  width: 95%;
  height: 55vh;
  margin: 25vh auto 0;
  border-radius: 5px;
  position: relative;
  border: 1px solid #f9f9f9;
  background-color: #ffffff;
  box-shadow: 0 0 5px #dcdcdc;
  overflow: hidden;
  .login-tab {
    width: 100%;
    display: flex;
    justify-content: space-around;
    a {
      width: 25%;
      height: 50px;
      display: block;
      font-size: 22px;
      line-height: 50px;
      text-align: center;
      transition: all 0.2s 0.1s;
      &.active {
        color: #1989fa;
        border-bottom: 2px solid #1989fa;
      }
    }
  }
  .login-main,
  .registration {
    width: 100%;
    position: absolute;
    padding: 50px 2.5%;
    margin: 0 auto;
    .login-btn {
      margin-top: 30px;
    }
  }
}
</style>