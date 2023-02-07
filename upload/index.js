const config = require('./config.js');
const configProd = require('./config-prod.js');
const path = require('path');
let Client = require('ssh2-sftp-client');
const shell = require('shelljs');
const fs = require('fs');
const dayjs = require("dayjs");

// 打包 npm run build
const compileDist = async flag => {
  if (shell.exec(`npm run ${flag}`).code === 0) {
    console.log('打包成功', new Date())
    return Promise.resolve()
  }
  return Promise.reject()
}
async function connectSSh(config) {
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

function writeLog(config, mode) {
  const content = `时间: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}, 环境: ${mode}, IP: ${config.ip}，路径: ${config.path}\r\n`
  fs.appendFile('./upload/log.txt', content, 'utf-8', (err, data) => {
    if(err) {
      console.log('日志记录异常', data)
    }
  })
}

async function runTask() {
  const commandArgs = process.argv.splice(2)
  const mode = commandArgs[0]
  if (mode === 'dev') {
    console.log('开发环境打包上传')
    await compileDist('build:dev') //打包完成
    await connectSSh(config) //提交上传
    writeLog(config, mode)
  } else if (mode === 'prod') {
    console.log('生产环境打包上传')
    await compileDist('build:prod') //打包完成
    await connectSSh(configProd) //提交上传
    writeLog(configProd, mode)
  }
}
runTask();
