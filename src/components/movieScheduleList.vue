<template>
  <div class="movie-schedule">
    <Table :columns="scheduleTableCols" :data="schedulesData"></Table>
  </div>
</template>

<style scoped>
.movie-schedule {
  margin-top: 10px;
}
</style>

<script>
export default {
  props: ['schedulesData'],

  data() {
    return {
      scheduleTableCols: [
        {
          title: '影片',
          key: 'title',
        },
        {
          title: '影厅',
          key: 'hall_id'
        },
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '票价',
          key: 'price'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  textDecoration: 'underline',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.$emit('deleteSchedule', params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ]
    }
  },
}
</script>
