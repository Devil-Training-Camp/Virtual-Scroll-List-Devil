<template>
  <HorizontalScroller :data="data" :rowHeight="rowHeight" :buffer="buffer" :item-key="itemKey">
    <Item slot-scope="{item}" :item="item" />
  </HorizontalScroller>
</template>

<script>
import axios from 'axios'
import HorizontalScroller from '../../plugins/HorizontalScroller.vue'
import Item from './Item.vue'

export default {
  data() {
    return {
      data: [],
      rowHeight: 200,
      buffer: 8,
      itemKey: 'id'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await axios.get('http://localhost:9527/list?page=1&pageSize=1000')
      if(res.status === 200) {
        this.data = res.data
      }
    }
  },
  components: {
    HorizontalScroller,
    Item
  }
}
</script>
