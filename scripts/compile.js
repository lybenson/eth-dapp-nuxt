const fs = require('fs-extra')
const path = require('path')
const solc = require('solc')

// 1. 删除已编译文件
const compiledDir = path.resolve(__dirname, '../compiled')
fs.removeSync(compiledDir)
fs.ensureDirSync(compiledDir)

// 2. 搜索所有未编译的合约文件
const contractFiles = fs.readdirSync(path.resolve(__dirname, '../contracts'));

contractFiles.forEach(contractFile => {
  // 2.1 编译
  const contractPath = path.resolve(__dirname, '../contracts', contractFile)
  const contractSource = fs.readFileSync(contractPath, 'utf8')
  const result = solc.compile(contractSource, 1)
  console.log(`file compiled: ${contractFile}`)

  // 2.2 错误检查
   if (Array.isArray(result.errors) && result.errors.length) {
      throw new Error(result.errors[0]);
   }

  // 2.3 保存到磁盘
  Object.keys(result.contracts).forEach(name => {
    const contractName = name.replace(/^:/, '')
    const filePath = path.resolve(__dirname, '../compiled', `${contractName}.json`)
    fs.outputJsonSync(filePath, result.contracts[name]);
    console.log(`save compiled contract ${contractName} to ${filePath}`)
  })
})
