<template>
  <div id="app">
    <el-tabs v-model="activeName">
      <el-tab-pane label="元素固定高度" name="static">
        <div class="wrapper" v-if="activeName === 'static'">
          <StaticScrollerPage />
        </div>
      </el-tab-pane>
      <el-tab-pane label="元素不定高度" name="dynamic">
        <div class="wrapper" v-if="activeName === 'dynamic'">
          <DynamicScrollerPage />
        </div>
      </el-tab-pane>
      <el-tab-pane label="下拉加载" name="page">
        <div class="wrapper" v-if="activeName === 'page'">
          <PageScrollerPage />
        </div>
      </el-tab-pane>
      <el-tab-pane label="横向滚动" name="horizontal">
        <div class="horizontal-wrapper" v-if="activeName === 'horizontal'">
          <HorizontalScrollerPage />
        </div>
      </el-tab-pane>
      <el-tab-pane label="横纵向滚动" name="horizontalAndVertical">
        <div class="horizontal-vertical-wrapper" v-if="activeName === 'horizontalAndVertical'">
          <HorizontalAndVerticalScroller />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StaticScrollerPage from './pages/StaticScrollerPage/index.vue'
import DynamicScrollerPage from './pages/DynamicScrollerPage/index.vue'
import PageScrollerPage from './pages/PageScrollerPage/index.vue'
import HorizontalScrollerPage from './pages/HorizontalScrollerPage/index.vue'
import HorizontalAndVerticalScroller from './plugins/HorizontalAndVerticalScroller.vue'

export default {
  name: 'App',
  data() {
    return {
      // activeName: 'horizontalAndVertical'
      activeName: 'static'
    }
  },
  components: {
    StaticScrollerPage,
    DynamicScrollerPage,
    PageScrollerPage,
    HorizontalScrollerPage,
    HorizontalAndVerticalScroller
  }
}
</script>

<style scoped>
.wrapper{
  width: 500px;
  height: 800px;
  border: 1px solid #000;
}
.horizontal-wrapper{
  width: 800px;
  height: 300px;
  border: 1px solid #000;
}
</style>