<template>
  <!-- 不定高 -->
  <div id="wrapper" ref="wrapperRef" @scroll.passive="handleScroll">
    <div class="scroll-bar" ref="scrollBarRef"></div>
    <div class="scroll-list" :style="scrollListStyle">
      <div v-for="item in visibleData" :item-index="item.id" :key="item[itemKey]" ref="itemRef">
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
      positions: [],
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
  },
  updated() {
    // 渲染后才能获取到dom数据
    this.$nextTick(() => {
      let nodes = this.$refs.itemRef
      if(!nodes || !nodes.length) return
      nodes.forEach(node => {
        let { height } = node.getBoundingClientRect()
        let itemIndex = node.getAttribute('item-index') - 1
        let oldHeight = this.positions[itemIndex].height
        let val = oldHeight - height
        if(val) {
          this.positions[itemIndex].height = height
          this.positions[itemIndex].bottom = this.positions[itemIndex].bottom - val
          for(let i = itemIndex + 1; i < this.positions.length; i ++) {
            this.positions[i].top = this.positions[i-1].bottom
            this.positions[i].bottom = this.positions[i].top + this.positions[i].height
          }
        }
      })
      this.$refs.scrollBarRef.style.height = this.positions[this.positions.length - 1].bottom + 'px'
    })
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
      if(this.startIndex <= this.maxCount) {
        startIndex = 0
      } else {
        startIndex = this.startIndex - this.buffer
      }
      return startIndex
    },
    visibleData() {
      return this.list.slice(this.startIndexCom, this.endIndex)
    },
    scrollListStyle() {
      let pos = this.positions[this.startIndexCom]
      return {
        transform: `translate3d(0, ${pos?.top}px, 0)`
      }
    }
  },
  watch: {
    data: function(newVal) {
      this.list = Object.freeze(newVal)
      this.cacheItemPos() // 缓存当前项的位置，滚动时获取真实dom更新
    }
  },
  methods: {
    calMaxCount() {
      this.maxCount = Math.ceil(this.$refs.wrapperRef.clientHeight / this.rowHeight)
      // console.log('maxCount', this.maxCount);
    },
    // todo 区别
    cacheItemPos() {
      let rowHeight = this.rowHeight
      this.positions = this.list.map((item, index) => {
        return {
          top: index * rowHeight,
          bottom: (index + 1) * rowHeight,
          height: rowHeight,
        }
      })
    },
    handleScroll() {
      // 使用requestAnimationFrame请求动画帧实现节流效果
      let requestAnimationFrame = window.requestAnimationFrame
      let fps = 30
      let interval = 1000 / fps
      let then = Date.now()
      requestAnimationFrame(() => {
        let now = Date.now()
        // todo 区别
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
      this.startIndex = this.getStartIndex(scrollTop)
    },
    // todo 区别 二分查找获取起始索引
    getStartIndex(value) {
      let start = 0, end = this.positions.length - 1, temp = null
      while(start <= end) {
        let middle = parseInt((start + end) / 2)
        let middleValue = this.positions[middle].bottom
        if(middleValue == value) {
          return middle + 1
        } else if (middleValue > value) {
          if(temp == null || temp > middle) {
            temp = middle
          } 
          end = middle - 1
        } else {
          start = middle + 1
        }
      }
      return temp
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