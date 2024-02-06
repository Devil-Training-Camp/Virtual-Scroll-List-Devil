<template>
  <div class="scroll-item">
    <img :src="item.avatar" alt="">
    <span>{{ item.id }}</span>——<span>{{ item.username }}</span>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  }
}
</script>

<style scoped>
.scroll-item{
  display: flex;
  align-items: center;
  min-height: 40px;
  max-height: 60px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
img{
  width: 60px;
}
</style>