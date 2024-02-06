<template>
  <div class="scroll-item">
    <span>{{ item.id }}</span><span>{{ item.username }}</span>
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
  flex-direction: column;
  height: 100px;
  width: 200px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
}
</style>