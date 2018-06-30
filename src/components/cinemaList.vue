<template>
  <div>
    <Table :columns="cinemasTableCols" :data="cinemasData"></Table>
  </div>
</template>

<style scoped>

</style>

<script>
export default {
  props: ['cinemasData'],

  data() {
    return {
     cinemasTableCols: [
        {
          title: '影院名',
          key: 'cinema_name',
        },
        {
          title: '地点',
          key: 'cinema_location'
        },
        {
          title: '影院拥有者',
          key: 'owner'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: `schedule-manage`,
                      params: {
                        cinema_id: this.cinemasData[params.index].cinema_id
                      }
                    })
                  }
                }
              }, '进入排片')
            ])
          }
        }
      ],
    }
  }
}
</script>
