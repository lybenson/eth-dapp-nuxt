import Web3 from 'web3'
const HDWalletProvider = require('truffle-hdwallet-provider')

let web3

// 浏览器环境且已经安装了 Metamask
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
} else { // 服务器环境
  const provider = new HDWalletProvider(
    'govern slogan fever satisfy pill fat already planet they pretty scheme badge',
    'https://rinkeby.infura.io/EI2sp8heRbsKJHppQT89'
  )
  
  web3 = new Web3(provider)

  // web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/EI2sp8heRbsKJHppQT89'))
}

export default web3
