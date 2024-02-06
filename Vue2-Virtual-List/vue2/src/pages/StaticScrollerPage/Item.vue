<template>
  <div class="scroll-item">
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
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
</style>