<template>
  <div>
    <div class="loading" v-if="columnListData == null">
      <van-loading type="spinner" color="rgb(25, 137, 250)" />
    </div>
    <div v-if="columnListData" class="column-list article-list">
      <van-nav-bar
        fixed
        :title="columnListData.name+'•专栏'"
        left-text="返回"
        left-arrow
        @click-left="()=>this.$router.go(-1)"
      />

      <div class="loading" v-if="columnListLoad">
        <van-loading type="spinner" color="rgb(25, 137, 250)" />
      </div>
      <div
        class="article-item"
        @click="toArticle(item.id)"
        v-for="item in columnListData.stories"
        :key="item.index"
      >
        <div class="article-img">
          <img :src="item.images[0]" />
        </div>
        <div class="article-main">
          <div class="article-title">{{item.title}}</div>
          <div class="article-detail">{{item.display_date}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columnListData: null,
      columnListLoad: true,
      id: this.$route.query.id
    };
  },
  methods: {
    getData() {
      this.$axios(this.baseURL + "/api/3/section/" + this.id).then(data => {
        this.columnListData = data.data;
      });
      this.columnListLoad = false;
    },
    // 跳转文章页
    toArticle(id) {
      this.$router.push({
        name: "article",
        query: {
          id: id
        }
      });
    }
  },
  activated() {
    if (!this.$route.meta.isBack) {
      this.columnListData = null;
      this.id = this.$route.query.id;
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      this.getData();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
  },
  beforeRouteEnter(to, from, next) {
    window.console.log(from.name);
    if (from.name == "article") {
      to.meta.isBack = true;
    }
    next();
  }
};
</script>

<style>
.column-list {
  padding-top: 50px;
}
</style>