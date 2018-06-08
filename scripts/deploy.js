/* eslint-disable */
const fs = require('fs-extra')
const path = require('path')
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')

/**
 * web3模块
 * eth - Javascript 和以太坊区块链通信，部署、调用智能合约
 * utils - 工具函数
 * shh - 基于 whisper 协议的 P2P 通信和广播
 * bzz - 基于 swarm 协议的去中心化文件存储
 */

// 1. 拿到 bytecode
const contractPath = path.resolve(__dirname, '../compiled/ProjectList.json')
const { itface, bytecode } = require(contractPath)

console.log(contractPath)

// 2. 配置 provider
const provider = new HDWalletProvider(
  'mango april cycle fish lend exist camera list day increase load curve',
  'https://rinkeby.infura.io/EI2sp8heRbsKJHppQT89'
)

// 3. 初始化 web3 实例
const web3 = new Web3(provider)

;(async () => {
  // 4. 获取钱包里面的账户
  const accounts = await web3.eth.getAccounts()
  console.log('合约部署账户:', accounts[0])

  // 5. 创建合约实例并且部署
  console.time('合约部署耗时')
  const result = await new web3.eth.Contract(JSON.parse(itface))
      .deploy({ data: bytecode })
      .send({ from: accounts[0], gas: '5000000' })
  console.timeEnd('合约部署耗时')

  const contractAddress = result.options.address

  console.log('合约部署成功:', contractAddress)
  console.log('合约查看地址:', `https://rinkeby.etherscan.io/address/${contractAddress}`)

  // 6. 合约地址写入文件系统
  const addressFile = path.resolve(__dirname, '../address.json')
  fs.writeFileSync(addressFile, JSON.stringify(contractAddress))
  console.log('地址写入成功:', addressFile)

  process.exit()
})()
