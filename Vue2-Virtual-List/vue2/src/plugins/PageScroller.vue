<template>
  <!-- 下拉加载 -->
  <div id="wrapper" ref="wrapperRef" @scroll.passive="handleScroll">
    <div :style="blankFillStyle">
      <div v-for="(item, index) in visibleData" :key="index">
        <slot :item="item" />
      </div>
      <div v-if="isRequest" class="loading">
        {{ loadingText }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RecycleScroller',
  data() {
    return {
      list: [], // 列表数据
      page: 1,
      maxCount: 0, // 视口可显示数据条数
      startIndex: 0, // 记录滚动后顶部item的index
      isRequest: false, // 网络较慢时显示文案优化交互
      currentScrollTop: 0 // 滚动条位置
    }
  },
  props: {
    rowHeight: { // 行高
      type: Number,
      default: 50
    },
    buffer: Number,
    itemKey: String,
    pageSize: { // 每次请求数据条数
      type: Number,
      default: 20
    },
    getData: Function,
    loadingText: {
      default: '加载数据中...'
    }
  },
  mounted() {
    this.getDataFn()
    this.calMaxCount()
  },
  activited() { // 路由切换定位列表滚动位置
    this.$nextTick(() => {
      this.$refs.wrapperRef.scrollTop = this.currentScrollTop
    })
  },
  computed: {
    endIndex() { // 记录滚动后底部item的index
      let endIndex = this.maxCount + this.buffer + this.startIndex // 底部缓冲一屏数据
      if(!this.list[endIndex]){
        endIndex = this.list.length
      }
      return endIndex
    },
    startIndexCom() {
      let startIndex = 0
      if(this.startIndex <= this.maxCount) {
        startIndex = 0
      } else {
        startIndex = this.startIndex - this.buffer
      }
      return startIndex
    },
    visibleData() { // 视口数据
      return this.list.slice(this.startIndexCom, this.endIndex)
    },
    blankFillStyle() {
      return {
        paddingTop: this.startIndexCom * this.rowHeight + 'px',
        paddingBottom: (this.list.length - this.endIndex) * this.rowHeight + 'px'
      }
    }
  },
  methods: {
    async getDataFn() { // 生成数据
      this.isRequest = true
      const res = await this.getData(this.page, this.pageSize)
      if(res.length !== 0) {
        this.list.push(...res)
        this.page ++
      }
      this.isRequest = false
    },
    calMaxCount() { // 计算视口可显示数据条数
      this.maxCount = Math.ceil(this.$refs.wrapperRef.clientHeight / this.rowHeight)
    },
    handleScroll() { // 滚动事件
      // 使用requestAnimationFrame请求动画帧实现节流效果
      let requestAnimationFrame = window.requestAnimationFrame
      let fps = 30
      let interval = 1000 / fps
      let then = Date.now()
      requestAnimationFrame(() => {
        let now = Date.now()
        this.setDataStartIndex()
        if(now - then >= interval) {
          then = now
          requestAnimationFrame(arguments.callee)
        }
      })
    },
    setDataStartIndex() { // 设置startIndex
      if(this.isRequest) return
      const { scrollTop } = this.$refs.wrapperRef
      this.currentScrollTop = scrollTop
      this.startIndex = Math.floor(scrollTop / this.rowHeight)
      if(this.startIndex + this.maxCount > this.list.length - 1) {
        this.getDataFn()
      }
    }
  }
}
</script>

<style scoped>
#wrapper{
  height: 100%;
  overflow: auto;
}
.loading{
  text-align: center;
}
</style>