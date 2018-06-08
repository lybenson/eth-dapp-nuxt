<template>
  <section class="container">
    <div>
      Eth
    </div>
  </section>
</template>

<script>
import web3 from '../libs/web3'
import ProjectList from '../libs/projectList'
import Project from '../libs/project'

export default {
  async asyncData () {
    const addressList = await ProjectList
  },
  components: {
  }
}
</script>

<style lang="stylus" scoped>

</style>
