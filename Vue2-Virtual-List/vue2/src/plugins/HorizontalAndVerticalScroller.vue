<template>
  <!-- 双向滚动 -->
  <div id="wrapper" ref="wrapperRef" @scroll.passive="handleScroll">
    <div class="scroll-bar" ref="scrollBarRef"></div>
    <div class="scroll-list" :style="colScrollListStyle">
      <div v-for="(row, index) in colVisibleData" :row-index="row.id" :key="index" ref="rowRef" class="row-wrapper" :style="itemScrollListStyle(index)">
        <div v-for="rowData in itemVisibleData(row.rowsData, index)" :key="rowData.level" :item-index="rowData.level" class="row" ref="itemRef">
            <div>{{ rowData.level }}</div>
            <div>{{ rowData.username }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      list: [],
      rowHeight: 50, // 预估行高，
      itemWidth: 100, // 预估元素宽度
      rowPositions: [], // 存储行位置信息
      itemPositions: [], // 存储元素位置信息
      itemMap: new Map(), // 存储元素位置信息
      colStartIndex: 0, // 列初始index
      colMaxCount: 0, // 列展示最大数量
      itemStartIndex: [], // 行初始index
      itemMaxCount: 0, // 行展示最大数量
      buffer: 3 // 缓存数量
    }
  },
  mounted() {
    this.getData()
    this.calMaxCount()
  },
  updated() {
    this.$nextTick(() => {
      let nodes = this.$refs.rowRef
      let itemNodes = this.$refs.itemRef
      let list = this.list
      if(!nodes || !nodes.length) return
      nodes.forEach(node => {
        let colIndex = node.getAttribute('row-index') - 1
        let oldHeight = this.rowPositions[colIndex].height
        let height = list[colIndex].rowHeight
        node.style.height = height + 'px'
        let val = oldHeight - height
        if(val) {
          this.rowPositions[colIndex].height = height
          this.rowPositions[colIndex].bottom = this.rowPositions[colIndex].bottom - val
          for(let i = colIndex + 1; i < this.rowPositions.length; i ++) {
            this.rowPositions[i].top = this.rowPositions[i-1].bottom
            this.rowPositions[i].bottom = this.rowPositions[i].top + this.rowPositions[i].height
          }
        }
      })
      if(!itemNodes ||!itemNodes.length) return
      itemNodes.forEach(item => {
        let itemIndex = item.getAttribute('item-index')
        let oldWidth = this.itemMap.get(itemIndex).width
        let width = this.itemMap.get(itemIndex).realWidth
        item.style.width = width + 'px'
        let val = oldWidth - width
        if(val) {
          let itemPos = this.itemMap.get(itemIndex)
          itemPos.width = width
          itemPos.right = itemPos.right - val
          this.itemMap.set(itemIndex, itemPos)
          let indexArr = itemIndex.split('-').map(item => Number(item))
          for(let i = indexArr[1] + 1; i <= this.list[indexArr[0] - 1].rowsData.length; i ++) {
            let itemPos1 = this.itemMap.get(indexArr[0] + '-' + i)
            let itemPos2 = this.itemMap.get(indexArr[0] + '-' + (i - 1))
            itemPos1.left = itemPos2.right
            itemPos1.right = itemPos1.left + itemPos1.width
            this.itemMap.set(indexArr[0] + '-' + i, itemPos1)
          }
        }
      })
      // 将元素位置信息map转为数组
      this.transItemInfo()
      this.$refs.scrollBarRef.style.height = this.rowPositions[this.rowPositions.length - 1].bottom + 'px'
      this.$refs.scrollBarRef.style.width = this.getMaxWidth() + 'px'
    })
  },
  computed: {
    colEndIndex() {
      let index = this.colStartIndex + this.colMaxCount + this.buffer
      if(!this.list[index]) {
        index = this.list.length
      }
      return index
    },
    itemEndIndex() {
      return function(val) {
        let index = this.itemStartIndex[val] + this.itemMaxCount + this.buffer
        if(!this.list[val].rowsData[index]) {
          index = this.list[val].rowsData.length
        }
        return index
      }
    },
    colStartIndexCom() {
      let index = this.colStartIndex - this.buffer
      return index < 0 ? 0 : index
    },
    itemStartIndexCom() {
      return function(val) {
        let index = this.itemStartIndex[val] - this.buffer
        return index < 0 ? 0 : index
      }
    },
    colVisibleData() {
      return this.list.slice(this.colStartIndexCom, this.colEndIndex)
    },
    itemVisibleData() {
      return function(data, index) {
        let res = data.slice(this.itemStartIndexCom(index), this.itemEndIndex(index))
        return res
      }
    },
    colScrollListStyle() {
      let pos = this.rowPositions[this.colStartIndexCom]
      return {
        // 滚动条宽度为最长行的宽度，需每次计算
        transform: `translate3d(0, ${pos?.top}px, 0)`
      }
    },
    itemScrollListStyle() {
      return function(index) {
        if(this.itemPositions.length === 0) return
        let pos = this.itemPositions[index][this.itemStartIndexCom(index)]
        return {
          transform: `translate3d(${pos?.left || 0}px, 0, 0)`
        }
      }
    }
  },
  methods: {
    async getData() {
      const res = await axios.get('http://localhost:9527/lists')
      if(res.status === 200) {
        this.list = res.data
        this.cacheColPos()
        this.initItemStartIndex()
      }
    },
    calMaxCount() {
      this.colMaxCount = Math.ceil(this.$refs.wrapperRef.clientHeight / this.rowHeight)
      this.itemMaxCount = Math.ceil(this.$refs.wrapperRef.clientWidth / this.itemWidth)
    },
    // 存储位置信息
    cacheColPos() {
      let rowHeight = this.rowHeight, itemWidth = this.itemWidth
      this.list.forEach((item, index) => {
        this.rowPositions.push({
          top: index * rowHeight,
          bottom: (index + 1) * rowHeight,
          height: rowHeight
        })
        item.rowsData.forEach((row, rowIndex) => {
          this.itemMap.set(row.level, {
            realWidth: row.width,
            left: rowIndex * itemWidth,
            right: (rowIndex + 1) * itemWidth,
            width: itemWidth
          })
        })
      })
    },
    // 初始化行初始index
    initItemStartIndex() {
      this.itemStartIndex.length = this.list.length
      this.itemStartIndex.fill(0)
    },
    handleScroll() {
      // 使用requestAnimationFrame请求动画帧实现节流效果
      let requestAnimationFrame = window.requestAnimationFrame
      let fps = 30
      let interval = 1000 / fps
      let then = Date.now()
      requestAnimationFrame(() => {
        let now = Date.now()
        this.setColStartIndex()
        if(now - then >= interval) {
          then = now
          requestAnimationFrame(arguments.callee)
        }
      })
    },
    setColStartIndex() {
      const { scrollTop, scrollLeft } = this.$refs.wrapperRef
      this.colStartIndex = this.getColStartIndex(scrollTop, this.rowPositions, 'bottom')
      // 设置行开始index
      this.setItemStartIndex(scrollLeft)
    },
    getColStartIndex(value, data, key) {
      let start = 0, end = data.length - 1, temp = null
      while(start <= end) {
        let middle = parseInt((start + end) / 2)
        let middleValue = data[middle][key]
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
    },
    setItemStartIndex(value) {
      if(value === 0) return
      for(let i = 0, len = this.itemStartIndex.length; i < len; i ++) {
        this.itemStartIndex[i] = this.getColStartIndex(value, this.itemPositions[i], 'right')
      }
      this.itemStartIndex = [...this.itemStartIndex]
    },
    // 转换位置信息
    transItemInfo() {
      let itemMap = this.itemMap
      let keys = [...itemMap.keys()]
      keys.forEach(key => {
        let index1 = Number(key.split('-')[0] - 1), index2 = Number(key.split('-')[1] - 1)
        if(!this.itemPositions[index1]){
          this.itemPositions[index1] = []
        }
        this.itemPositions[index1][index2] = itemMap.get(key)
      })
    },
    // 获取最大行宽
    getMaxWidth() {
      let itemPositions = this.itemPositions
      let max = 0
      itemPositions.forEach(item => {
        let right = item[item.length - 1].right
        if(right > max) max = right
      })
      return max
    }
  }
}
</script>

<style scoped>
#wrapper{
  position: relative;
  width: 1200px;
  height: 800px;
  border: 1px solid #000;
  overflow: auto;
}
.scroll-list{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.row-wrapper{
  position: relative;
  display: flex;
  flex-direction: row;
}
.row{
  display: flex;
  flex-direction: column;
  flex-shrink:0;
  border: 1px solid transparent;
  border-right-color: #ccc;
  border-bottom-color: #ccc;
  box-sizing: border-box;
}
</style>