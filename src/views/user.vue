<template>
  <div  v-if="userData" class="user">
    <div v-for="(item, index) in userData.data" @click="toArticle(item.collectId)" :key="index" class="user-collect">
      <div class="collect-title">{{item.collectTitle}}</div>
      <div class="collect-img">
        <img :src="item.collectImg" alt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: null
    };
  },
  methods: {
    getUserData() {
      this.$axios.post(this.userURL + "/userData").then(data => {
        this.userData = data.data;
      }).catch(err =>{
        window.console.log(err)
      });
    },
    // 跳转文章页
    toArticle(id) {
      window.console.log(id)
      this.$router.push({
        name: "article",
        query: {
          id: id
        }
      });
    }
  },
  created() {
    this.getUserData();
  }
};
</script>
<style lang="less" scoped>
.user {
  width: 100%;
  margin: 10px auto;
  padding-bottom: 50px;
  box-sizing: border-box;
  .user-collect {
    width: 100%;
    padding: 0 5%;
    height: 100px;
    display: flex;
    border-bottom: 1px solid #ececec;
    box-sizing: border-box;
    margin: 15px auto;
    .collect-title {
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      font-size: 16px;
    }
    .collect-img {
      width: 100px;
      height: 80px;
      margin-left: 10px;
    }
    img {
      width: 100%;
      border-radius: 5px;
    }
  }
}
</style>