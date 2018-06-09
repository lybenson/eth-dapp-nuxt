<template>
  <section class="container">
    <h1>eth账户</h1>
    <div v-for="(x, index) in accounts" :key="index">
      ETH账户: {{x.account}}
      余额: {{weiToEth(x.balance)}} eth
    </div>

    <h1>项目列表</h1>
    <!-- <div v-for="(project, index) in projects" :key="index">
      {{project}}
    </div> -->
    <el-table :data="projects" border>
      <el-table-column label="项目地址" prop="address" align="center"></el-table-column>
      <el-table-column label="项目描述" prop="description" align="center"></el-table-column>
      <el-table-column label="募资上限" prop="goal" align="center"></el-table-column>
      <el-table-column label="最小投资金额" prop="minInvest" align="center"></el-table-column>
      <el-table-column label="最大投资金额" prop="maxInvest" align="center"></el-table-column>
      <el-table-column label="参投人数" prop="investorCount" align="center"></el-table-column>
      <el-table-column label="已募资金额" prop="balance" align="center"></el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary">立即投资</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import web3 from '../libs/web3'
import ProjectList from '../libs/projectList'
import Project from '../libs/project'

export default {
  async asyncData () {
    const accounts = await web3.eth.getAccounts()
    const balances = await Promise.all(accounts.map(x => web3.eth.getBalance(x)))

    // 获取项目的地址列表
    const addressList = await ProjectList.methods.getProjects().call()

    // 获取项目详情
    const summaryList = await Promise.all(
      addressList.map(address =>
        Project(address)
          .methods.getSummary()
          .call()
      )
    )

    // 组合项目信息
    const projects = addressList.map((address, i) => {
      const [description, minInvest, maxInvest, goal, balance, investorCount, paymentCount, owner] = Object.values(
        summaryList[i]
      )
      return {
        address,
        description,
        minInvest: web3.utils.fromWei(minInvest, 'ether'),
        maxInvest: web3.utils.fromWei(maxInvest, 'ether'),
        goal: web3.utils.fromWei(goal, 'ether'),
        balance: web3.utils.fromWei(balance, 'ether'),
        progress: Math.ceil(balance / goal * 100),
        investorCount,
        paymentCount,
        owner,
      }
    }).reverse()
    // try {
    //   const projects = await ProjectList.methods.getProjects().call()
    //   console.log(projects)
    // } catch (error) {
    //   console.log(error)
    // }

    return {
      accounts: accounts.map((x, i) => ({ account: x, balance: balances[i] })),
      projects 
    }
  },
  components: {
  },
  data () {
    return {
      balance: 0
    }
  },
  methods: {
    weiToEth (wei) {
      return web3.utils.fromWei(wei, 'ether')
    }
  } 
}
</script>

<style lang="stylus" scoped>
.container
  font-size 20px
</style>
