import web3 from './web3'
import ProjectList from '../compiled/ProjectList.json'
import address from '../address.json' // eth账户地址

// 智能合约(以太坊网络上被代码控制的一个账户, 没有账户的公钥和私钥), 智能合约账户称为内部账户，而普通用户账户称为外部账户

// 合约部署实际上是发起了 1 笔交易，交易的接收者为空，以太坊将接收者为空的交易默认为是合约实例创建请求, 这类交易中会携带当前部署合约的机器码ByteCode。部署成功的话会返回新建的合约账户，合约部署本身需要消耗 Gas，这个费用是发起者支付的

// 创建智能合约对象: new web3.eth.Contract(jsonInterface[, address][, options])
// jsonInterface: Object - 要实例化的合约的json接口
// address: String - 要调用的合约的地址
// options: Object - 合约的配置对象
//       - from: String - 交易发送方地址
//       - gasPrice: String - 用于交易的gas价格，单位：wei
//       - gas: Number - 交易可用的最大gas量，即gas limit
//       - data: String - 合约的字节码，部署合约时需要
// 
// 返回值: 包含所有方法和事件的合约实例

// 创建项目列表合约
const contract = new web3.eth.Contract(JSON.parse(ProjectList.interface), address)

export default contract
