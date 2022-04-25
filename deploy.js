const zip = require('zip-local');
const { NodeSSH } = require('node-ssh');
const rimraf = require('rimraf');
const ora = require('ora');
const chalk = require('chalk');

const sshConfig = {
  host: '212.129.255.129',
  port: 22,
  username: 'ubuntu',
  password: 'xvdv6l53dxJB8GoN',
};

let spinner;

const getTime = () => {
  const date = new Date();
  return `${date.getFullYear()}-${fill(date.getMonth() + 1)}${fill(date.getDate())}-${fill(
    date.getHours(),
  )}${fill(date.getMinutes())}`;
};
const fill = (s) => {
  return s.toString().padStart(2, '0');
};
const zipper = () => {
  spinner = ora(chalk.green('正在生成部署包▶▶▶▶'));
  spinner.start();
  zip.sync.zip('./dist').compress().save('./dist.zip');
  spinner.stop();
  console.log(chalk.green('已生成部署包,正在部署至前端目录✅'));
};

const publish = async () => {
  spinner = ora(chalk.green('正在发布到服务器...'));
  spinner.start();
  const ssh = new NodeSSH();
  await ssh.connect(sshConfig);
  await ssh.execCommand('sudo su');
  await ssh.putFile('./dist.zip', '/home/ubuntu/deploy/sites/quant-web-next/dist.zip');
  await ssh.execCommand(
    'cd /home/ubuntu/deploy/sites/quant-web-next/ && unzip -o ./dist.zip && rm -rf ./dist.zip',
  );
  await ssh.dispose();
  rimraf.sync('./dist');
  rimraf.sync('./dist.zip');
  spinner.stop();
  console.log(chalk.green(`✨  已发布到服务器✅,发布时间：${getTime()}`));
};

const run = () => {
  zipper();
  publish();
};

run(); // 发布
