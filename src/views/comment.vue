<template>
  <div style="padding-top:50px;">
    <van-nav-bar title="评论" fixed left-arrow @click-left="()=> this.$router.go(-1)" />
    <div v-if=" longComment &&longComment.comments.length>0 " class="long-list comment-list">
      <h3>{{longComment.comments.length}}条长评论</h3>
      <div v-for="item in longComment.comments" :key="item.index" class="comment-item">
        <div class="comment-img">
          <img :src="item.avatar" alt />
        </div>
        <div class="comment-content">
          <div class="comment-name">{{item.author}}</div>
          <div class="comment-main" v-html="item.content"></div>
          <div
            class="comment-reply"
            v-if="item.reply_to"
          >//{{item.reply_to.author}}:{{item.reply_to.content}}</div>
          <div class="comment-info">
            <div class="comment-date">{{item.time | timestampToTime}}</div>
            <div class="comment-praise">
              {{item.likes}}
              <van-icon size="16" name="good-job-o" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="shortComment && shortComment.comments.length>0" class="long-list comment-list">
      <h3>{{shortComment.comments.length}}条短评论</h3>
      <div v-for="item in shortComment.comments" :key="item.index" class="comment-item">
        <div class="comment-img">
          <img :src="item.avatar" alt />
        </div>
        <div class="comment-content">
          <div class="comment-name">{{item.author}}</div>
          <div class="comment-main" v-html="item.content"></div>
          <div
            class="comment-reply"
            v-if="item.reply_to"
          >//{{item.reply_to.author}}:{{item.reply_to.content}}</div>
          <div class="comment-info">
            <div class="comment-date">{{item.time | timestampToTime}}</div>
            <div class="comment-praise">
              {{item.likes}}
              <van-icon size="16" name="good-job-o" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.query.id,
      longComment: null,
      shortComment: null
    };
  },
  filters: {
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var Y, M, D, h, m, s;
      Y = date.getFullYear() + "-";
      M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      D = date.getDate() + " ";
      h = date.getHours() + ":";
      m = date.getMinutes() + ":";
      s = date.getSeconds();
      return Y + M + D + h + m + s;
    }
  },
  methods: {
    getLongComment() {
      this.$axios(
        this.baseURL+"/api/4/story/" + this.id + "/long-comments"
      ).then(data => {
        this.longComment = data.data;
      });
    },
    getShortComment() {
      this.$axios(
        this.baseURL+"/api/4/story/" + this.id + "/short-comments"
      ).then(data => {
        this.shortComment = data.data;
      });
    }
  },
  created() {
    this.getLongComment();
    this.getShortComment();
  }
};
</script>

<style lang="less">
.comment-list {
  width: 100%;
  margin: 0 auto;
  h3 {
    margin: 10px 0;
    text-align: left;
    text-indent: 1em;
    font-size: 12px;
    font-weight: normal;
  }
  .comment-item {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    border-bottom: 1px solid rgb(243, 243, 243);
    .comment-img {
      padding-right: 10px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
    .comment-content {
      width: 100%;
      text-align: left;
      color: rgb(73, 73, 73);
      .comment-name {
        font-size: 14px;
        line-height: 1.6;
      }
      .comment-main {
        font-size: 14px;
      }
      .comment-reply {
        font-size: 14px;
        color: rgb(138, 138, 138);
      }
      .comment-info {
        width: 100%;
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
        font-size: 12px;
        line-height: 16px;
        padding-right: 20px;
        box-sizing: border-box;
        color: rgb(202, 202, 202);
        i {
          vertical-align: sub;
          margin-left: 3px;
        }
      }
    }
  }
}
</style>