<template>
  <div class="home" style="padding-bottom:50px">
    <div class="tabs">
      <a :class="{'active':listItem==0}" class="tabs-item" @click="listActive(0)">每日日报</a>
      <a :class="{'active':listItem==1}" class="tabs-item" @click="listActive(1)">历史内容</a>
    </div>

    <div class="list-main">
      <!-- <transition name="van-slide-left"> -->
        <div v-show="listItem == 0" class="list-item">
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
          <div class="date-btn" @click="()=>this.popUp = true">
            <van-icon name="calender-o" />
          </div>
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
      <!-- </transition>
      <transition name="van-slide-right"> -->
        <div v-show="listItem == 1" class="list-item">
          <div class="loading" v-if="firstLoad">
            <van-loading type="spinner" color="rgb(25, 137, 250)" />
          </div>
          <div v-if="historyList[0]">
            <van-list
              v-model="historyLoading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
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
      <!-- </transition> -->
    </div>
  </div>
</template>


<script>
export default {
  name: "home",
  data() {
    return {
      // 显示列表 0：最新内容 1：历史列表
      listItem: 0,
      // 最新列表
      // 加载图标
      loading: true,
      // 单日内容
      dataList: null,
      // 日期弹出层
      popUp: false,
      // 最新日期
      currentDate: new Date(),
      // 限制最早日期
      minDate: new Date(2013, 4, 20),
      // 限制可选最远日期为当日
      maxDate: new Date(),
      // 选定加载数据的日期
      fixedDay: null,

      // 历史列表
      // 进入页面时的加载图标
      firstLoad: true,
      // 下拉加载时的图标
      historyLoading: false,
      // 下拉加载是否完成
      finished: false,
      // 历史列表内容
      historyList: [],
      // 当天时间
      thisDate: null,
      // 下拉加载前一天的时间
      befortDay: null,
      // 距离顶部距离
      offsetTop: 0
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
    currentDate() {
      this.fixedDay = this.formaDate(this.currentDate);
    },
    thisDate() {
      this.befortDay = this.formaDate(this.thisDate);
    }
  },
  methods: {
    // 列表切换
    listActive(val) {
      window.console.log(val);
      if (val == 0) {
        this.offsetTop = document.documentElement.scrollTop;
        this.listItem = 0;
      } else {
        this.listItem = 1;
        setTimeout(() => {
          document.documentElement.scrollTop = this.offsetTop;
        }, 100);
      }
    },
    // 最新内容初始化获取数据
    getData() {
      this.$axios
        .get(this.baseURL + "/api/4/news/latest")
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
      this.$axios
        .get(this.baseURL + "/api/4/news/before/" + this.fixedDay)
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
    },
    // 获取历史列表内容
    getHistoryData() {
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
    // 历史列表下拉加载内容
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
        this.historyLoading = false;
        this.getHistoryData();
      }, 1000);
    }
  },
  created() {
    this.thisDate = new Date();
    this.befortDay = this.formaDate(this.thisDate);
    this.getData();
    setTimeout(() => {
      this.getHistoryData();
      this.onLoad();
    }, 1000);
  },
  activated() {
    // keep-alive组件 页面进入的时候设置滚动高度
    document.documentElement.scrollTop = this.offsetTop;
  },
  beforeRouteLeave(to, from, next) {
    // 组件离开的时候，获取页面滚动高度
    window.console.log(document.documentElement.scrollTop);
    this.offsetTop = document.documentElement.scrollTop;
    next();
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
  position: sticky;
  top: 10px;
  z-index: 999;
  background: #fff;
  .tabs-item {
    width: 50%;
    font-size: 16px;
    color: #1989fa;
    text-align: center;
    cursor: pointer;
  }
  .active {
    color: #ffffff;
    background-color: rgb(25, 137, 250);
  }
}

.list-item{
  width: 100%;
  // position: absolute; 
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
.van-divider {
  margin: 0 !important;
}
</style>