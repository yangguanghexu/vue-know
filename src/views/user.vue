<template>
  <div>{{userData}}</div>
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
      this.$axios.post("http://182.61.3.247:8888/userData").then(data => {
        this.userData = data.data;
      });
    }
  },
  created(){
      this.getUserData()
  }
};
</script>

<style>
</style>