<template>
  <section class="container">
    <h1>eth账户</h1>
    <div v-for="(x, index) in accounts" :key="index">
      ETH账户: {{x.account}}
      余额: {{weiToEth(x.balance)}} eth
    </div>

    <nuxt-link :to="'/project/create'"><el-button>创建项目</el-button></nuxt-link>

    <h1>项目列表</h1>
    <el-table :data="projects" border>
      <el-table-column label="项目地址" prop="address" align="center"></el-table-column>
      <el-table-column label="项目名称" prop="description" align="center"></el-table-column>
      <el-table-column label="募资上限" prop="goal" align="center"></el-table-column>
      <el-table-column label="最小投资金额" prop="minInvest" align="center"></el-table-column>
      <el-table-column label="最大投资金额" prop="maxInvest" align="center"></el-table-column>
      <el-table-column label="参投人数" prop="investorCount" align="center"></el-table-column>
      <el-table-column label="已募资金额" prop="balance" align="center"></el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="invest(scope.row)">立即投资</el-button>
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
    },
    async invest (project) {
      console.log(project)
      let { value } = await this.$prompt('请输入投资金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false
      })

      if (value <= 0) {
        this.$message.error('投资金额必须大于0')
        return
      }
      if (value < project.minInvest) {
        this.$message.error('投资金额必须大于最小投资金额')
        return
      }
      if (value > project.maxInvest) {
        this.$message.error('投资金额必须小于最大投资金额')
        return
      }

      try {
        // 获取账户
        const accounts = await web3.eth.getAccounts()
        const owner = accounts[0]

        // 发起转账
        const contract = Project(project.address)
        const result = await contract.methods
          .contribute()
          .send({ from: owner, value: web3.utils.toWei(value, 'ether'), gas: '5000000' })

        this.$message.error('投资成功')
        setTimeout(() => {
          location.reload();
        }, 1000)
      } catch (error) {
        console.log(error)
        this.$message.error('投资失败')
      }
    }
  } 
}
</script>

<style lang="stylus" scoped>
.container
  font-size 20px
</style>
