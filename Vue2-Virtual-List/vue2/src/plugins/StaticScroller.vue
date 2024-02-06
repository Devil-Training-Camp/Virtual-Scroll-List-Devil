<template>
  <!--定高 -->
  <div id="wrapper" ref="wrapperRef" @scroll.passive="handleScroll">
    <div class="scroll-bar" ref="scrollBarRef"></div>
    <div class="scroll-list" :style="scrollListStyle">
      <div v-for="item in visibleData" :key="item[itemKey]">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      startIndex: 0,
      maxCount: 0,
      currentScrollTop: 0
    }
  },
  props: {
    data: Array,
    rowHeight: Number,
    buffer: Number,
    itemKey: String
  },
  mounted() {
    this.calMaxCount()
    console.log('this.maxCount',this.maxCount)
  },
  activited() {
    this.$nextTick(() => {
      this.$refs.wrapperRef.scrollTop = this.currentScrollTop
    })
  },
  computed: {
    endIndex() {
      let endIndex = this.startIndex + this.maxCount + this.buffer
      if(!this.list[endIndex]) {
        endIndex = this.list.length
      }
      return endIndex
    },
    startIndexCom() {
      let startIndex = 0
      // 如果当前的this.startIndex小于等于最大允许的索引数this.maxCount：
      if(this.startIndex <= this.maxCount) {
        startIndex = 0
        // 将起始索引设为0，意味着从数据列表的开始位置开始加载数据。
      } else {
        // 减去缓冲值this.buffer来计算新的起始索引，这意味着实际显示的数据将比当前滚动位置稍微靠前一些。
        startIndex = this.startIndex - this.buffer
      }
      return startIndex
    },
    visibleData() {
      return this.list.slice(this.startIndexCom, this.endIndex)
    },
    scrollListStyle() {
      return {
        transform: `translate3d(0, ${this.startIndexCom * this.rowHeight}px, 0)`
      }
    }
  },
  watch: {
    data: function(newVal) {
      this.list = Object.freeze(newVal)
      this.setScrollBarHeight()
    }
  },
  methods: {
    calMaxCount() {
      console.log('this.$refs.wrapperRef.clientHeight',this.$refs.wrapperRef.clientHeight)
      console.log('this.rowHeight',this.rowHeight)
      this.maxCount = Math.ceil(this.$refs.wrapperRef.clientHeight / this.rowHeight)
    },
    setScrollBarHeight() {
      this.$refs.scrollBarRef.style.height = this.list.length * this.rowHeight + 'px'
    },
    handleScroll() {
      // 在 handleScroll() 中，使用了 requestAnimationFrame 实现节流效果，每次动画帧都会调用 setDataStartIndex() 更新滚动相关变量，并可能引发可视数据列表 (visibleData) 和滚动列表样式 (scrollListStyle) 的更新。
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
    setDataStartIndex() {
      const { scrollTop } = this.$refs.wrapperRef
      this.currentScrollTop = scrollTop
      this.startIndex = Math.floor(scrollTop / this.rowHeight)
    }
  }
}
</script>

<style scoped>
#wrapper{
  position: relative;
  height: 100%;
  overflow: auto;
}
.scroll-list{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>