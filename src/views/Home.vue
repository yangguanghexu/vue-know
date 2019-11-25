<template>
  <div class="home" style="padding-bottom:50px">
    <div class="tabs">
      <router-link class="tabs-item active" to="/">日报</router-link>
      <router-link class="tabs-item" to="history">历史内容</router-link>
    </div>
    <router-view/>
    <div class="loading" v-if="loading">
      <van-loading type="spinner" color="rgb(25, 137, 250)" />
    </div>
    <div v-if="dataList" class="article-list">
      <div
        class="article-item"
        @click="toArticle(item.id)"
        v-for="item in dataList.stories"
        :key="item.index"
      >
        <div class="article-img">
          <img :src="item.images[0]" />
        </div>
        <div class="article-main">
          <div class="article-title">{{item.title}}</div>
          <div class="article-detail">{{item.hint}}</div>
        </div>
      </div>
    </div>
    <div class="date-btn" @click="()=>this.popUp = true"><van-icon name="calender-o" /></div>
    <van-popup position="bottom" v-model="popUp">
      <van-datetime-picker
        @cancel="()=>this.popUp = false"
        @confirm="getFixedData"
        v-model="currentDate"
        type="date"
        :formatter="formatter"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>


<script>
export default {
  name: "home",
  data() {
    return {
      loading: true,
      dataList: null,
      popUp: false,
      currentDate: new Date(),
      minDate: new Date(2013, 4, 20),
      maxDate: new Date(),
      fixedDay: null
    };
  },
  watch: {
    currentDate() {
      this.fixedDay = this.formaDate(this.currentDate);
    }
  },
  methods: {
    // 初始化获取数据
    getData() {
      this.$axios(this.baseURL+"/api/4/news/latest")
        .then(data => {
          this.loading = false;
          this.dataList = data.data;
        })
        .catch(() => {
          this.loading = false;
          this.$toast("加载失败，请稍后重试。");
        });
    },
    // 跳转文章页
    toArticle(id) {
      this.$router.push({
        name: "article",
        query: {
          id: id
        }
      });
    },
    // 弹出日期面板格式化日期
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      } else if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
    // 获取指定日期数据
    getFixedData() {
      this.popUp = false;
      this.dataList = null;
      this.loading = true;
      this.$axios(
        this.baseURL+"/api/4/news/before/" + this.fixedDay
      )
        .then(data => {
          this.loading = false;
          this.dataList = data.data;
        })
        .catch(() => {
          this.loading = false;
          this.$toast("加载失败，请稍后重试。");
        });
    },
    // 格式化日期
    formaDate(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return `${year}${month}${day}`;
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="less" >
.loading {
  width: 100%;
  text-align: center;
  margin: 30px auto;
}
.tabs {
  width: 96%;
  height: 35px;
  line-height: 35px;
  margin: 8px auto;
  display: flex;
  border-radius: 5px;
  border: 1px solid rgb(25, 137, 250);
  box-sizing: border-box;
  padding: 0;
  .tabs-item {
    width: 50%;
    font-size: 16px;
    color: #1989fa;
    text-align: center;
  }
  .active {
    color: #ffffff;
    background-color: rgb(25, 137, 250);
  }
}

.article-list {
  width: 100%;
  margin: 0 auto;
  background-color: #ffffff;
  .article-item {
    width: 90%;
    min-height: 60px;
    margin: 10px auto;
    padding: 10px;
    border: 1px solid #f9f9f9;
    background-color: #ffffff;
    box-shadow: 0 0 5px #dcdcdc;
    border-radius: 5px;
    position: relative;
    .article-img {
      width: 60px;
      height: 60px;
      img {
        width: 100%;
      }
    }
    .article-main {
      margin-left: 70px;
      margin-right: 10px;
      position: absolute;
      top: 15px;
      .article-title {
        font-size: 14px;
        line-height: 1.3;
        text-align: left;
      }
      .article-detail {
        font-size: 12px;
        color: #777777;
        line-height: 1.5;
        text-align: left;
      }
    }
  }
}
.date-btn {
  width: 40px;
  height: 40px;
  line-height: 46px;
  position: fixed;
  bottom: 100px;
  right: 50px;
  color: #1989fa;
  border-radius: 50%;
  text-align: center;
  font-size: 28px;
  background-color: #fff;
  border: 2px solid #1989fa;
  &:active {
    background-color: rgb(233, 233, 233);
  }
}
</style>