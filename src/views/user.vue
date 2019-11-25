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
      this.$axios.post(this.baseURL+"/userData").then(data => {
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