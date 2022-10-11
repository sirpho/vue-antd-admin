const config = require('./config.js');
const configProd = require('./config-prod.js');
const path = require('path');
let Client = require('ssh2-sftp-client');
const shell = require('shelljs')
// 打包 npm run build
const compileDist = async flag => {
  if (shell.exec(`npm run ${flag}`).code === 0) {
    console.log('打包成功', new Date())
    return Promise.resolve()
  }
  return Promise.reject()
}
async function connectSSh() {
  let sftp = new Client();
  sftp
    .connect({
      host: config.ip, // 服务器 IP
      port: config.port,
      username: config.username,
      password: Buffer.from(config.password, 'base64').toString('utf-8'),
    })
    .then(() => {
      console.log('先执行删除服务器文件', new Date());
      return sftp.rmdir(config.rmpath, true);
    })
    .then(() => {
      // 上传文件
      console.log('开始上传', new Date());
      return sftp.uploadDir(path.resolve(__dirname, '../dist'), config.path);
    })
    .then(() => {
      console.log('上传完成', new Date());
      sftp.end();
    })
    .catch(err => {
      console.log(err, '失败', new Date());
      sftp.end();
    });
}
async function runTask() {
  const commandArgs = process.argv.splice(2)
  const mode = commandArgs[0]
  console.log(mode)
  if (mode === 'dev') {
    await compileDist('build:dev') //打包完成
    await connectSSh(config) //提交上传
  } else if (mode === 'prod') {
    await compileDist('build:prod') //打包完成
    await connectSSh(configProd) //提交上传
  }
}
runTask();
