<template>
  <div style="padding-bottom:50px">
    <div class="tabs">
      <router-link class="tabs-item" to="/">每日日报</router-link>
      <router-link class="tabs-item active" to="history">历史内容</router-link>
    </div>
    <div class="loading" v-if="firstLoad">
      <van-loading type="spinner" color="rgb(25, 137, 250)" />
    </div>
    <div v-if="historyList[0]">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in historyList" :key="item.date">
          <van-divider contentPosition="left">{{item.date | capitalize}}</van-divider>
          <div class="article-list">
            <div
              class="article-item"
              v-for="(data,index) in item.stories"
              :key="index"
              @click="toArticle(data.id)"
            >
              <div class="article-img">
                <img :src="data.images[0]" />
              </div>
              <div class="article-main">
                <div class="article-title van-multi-ellipsis--l2">{{data.title}}</div>
                <div class="article-detail">{{data.hint}}</div>
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 进入页面时的加载图标
      firstLoad: true,
      // 下拉加载时的图标
      loading: false,
      finished: false,
      historyList: [],
      thisDate: null,
      befortDay: null
    };
  },
  filters: {
    capitalize: function(value) {
      var date =
        value.slice(0, 4) +
        "年" +
        value.slice(4, 6) +
        "月" +
        value.slice(6, 8) +
        "日";
      return date;
    }
  },
  watch: {
    thisDate() {
      this.befortDay = this.formaDate(this.thisDate);
    }
  },
  methods: {
    getData() {
      this.$axios(this.baseURL + "/api/4/news/before/" + this.befortDay)
        .then(data => {
          this.firstLoad = false;
          this.historyList.push(data.data);
        })
        .catch(() => {
          this.firstLoad = false;
          this.$toast("加载失败，请稍后重试。");
        });
    },
    toArticle(id) {
      this.$router.push({
        name: "article",
        query: {
          id: id
        }
      });
    },
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
    },
    onLoad() {
      var beforeDay = new Date(
        this.thisDate.getFullYear(),
        this.thisDate.getMonth(),
        this.thisDate.getDate() - 1
      );
      this.thisDate = beforeDay;
      this.befortDay = this.formaDate(beforeDay);
      setTimeout(() => {
        // 加载状态结束
        this.loading = false;
        this.getData();
      }, 1000);
    }
  },
  created() {
    this.thisDate = new Date();
    this.befortDay = this.formaDate(this.thisDate);
    this.getData();
  }
};
</script>
<style scoped>
.van-cell {
  padding-top: 0;
  padding-bottom: 0;
}
.van-cell:not(:last-child)::after,
.van-cell:not(:last-child)::after {
  border: none;
}
</style>