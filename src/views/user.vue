<template>
  <div class="user">
    {{userData}}
    <div class="user-collect">
      <div class="collect-list"></div>
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
  width: 95%;
  margin: 0 auto;
}
</style>