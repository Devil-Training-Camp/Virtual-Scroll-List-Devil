<template>
  <PageScroller :rowHeight="rowHeight" :buffer="buffer" :item-key="itemKey" :pageSize="pageSize" :getData="getData">
    <Item slot-scope="{item}" :item="item" />
  </PageScroller>
</template>

<script>
import axios from 'axios'
import PageScroller from '../../plugins/PageScroller.vue'
import Item from './Item.vue'

export default {
  data() {
    return {
      data: [],
      rowHeight: 50,
      buffer: 8,
      itemKey: 'id',
      pageSize: 20
    }
  },
  methods: {
    async getData(page, pageSize) {
      const res = await axios.get(`http://localhost:9527/list?page=${page}&pageSize=${pageSize}`)
      if(res.status === 200) {
        return res.data
      }
    }
  },
  components: {
    PageScroller,
    Item
  }
}
</script>
