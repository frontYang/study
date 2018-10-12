<template>
  <div class="ui-layout">
    <div v-for="(item, index) in colNum" :key="index" :class="'ui-col-' + colNum / 2"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: 'ui-layout',
      msg: 'aaa'
    }
  }
}
</script>

<style lang="less" scoped>

</style>


