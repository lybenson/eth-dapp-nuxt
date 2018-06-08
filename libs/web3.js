import Web3 from 'web3'

let web3

// 浏览器环境且已经安装了 Metamask
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
} else { // 服务器环境
  web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/CqCd0QgCozHBEk19ub2M'))
}

export default web3
