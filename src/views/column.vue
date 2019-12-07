<template>
  <div class="column">
    <div class="loading" v-if="columnLoad">
      <van-loading type="spinner" color="rgb(25, 137, 250)" />
    </div>
    <div v-if="columnList" class="article-list">
      <div
        class="article-item"
        @click="toArticle(item.id)"
        v-for="item in columnList"
        :key="item.index"
      >
        <div class="article-img">
          <img :src="item.thumbnail" />
        </div>
        <div class="article-main">
          <div class="column-title">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columnList: null,
      columnLoad: true,
      offsetTop: 0
    };
  },
  methods: {
    getData() {
      this.$axios.get(this.baseURL +"/api/3/sections").then(data => {
        this.columnList = data.data.data;
      });
      this.columnLoad = false;
    },
    toArticle(id) {
      this.$router.push({
        name: "columnList",
        query: {
          id: id
        }
      });
    }
  },
  created() {
    this.getData();
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

<style lang='less'>
.column {
  padding-bottom: 50px;
  .column-title {
    line-height: 50px;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>