<template>
  <StaticScroller :data="data" :rowHeight="rowHeight" :buffer="buffer" :item-key="itemKey">
    <Item slot-scope="{item}" :item="item" />
  </StaticScroller>
</template>

<script>
import axios from 'axios'
import StaticScroller from '../../plugins/StaticScroller.vue'
import Item from './Item.vue'

export default {
  data() {
    return {
      data: [],
      rowHeight: 50,
      buffer: 8,
      itemKey: 'id'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await axios.get('http://localhost:9527/list?page=1&pageSize=10000')
      if(res.status === 200) {
        this.data = res.data
      }
    }
  },
  components: {
    StaticScroller,
    Item
  }
}
</script>
