<template>
  <div class="column-list article-list">
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
</template>

<script>
export default {
  data() {
    return {
      columnListData: null,
      columnListLoad:true,
      id: this.$route.query.id
    };
  },
  methods: {
    getData() {
      this.$axios("http://182.61.3.247/api/3/section/" + this.id).then(data => {
        this.columnListData = data.data;
      });
      this.columnListLoad = false
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
  created() {
    this.getData();
  }
};
</script>

<style>
.column-list{
    padding-top: 50px;
}
</style>