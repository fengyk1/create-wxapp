#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
/* const inquirer = require("inquirer"); */
const chalk = require("chalk");
const download = require("download-git-repo");
const ora = require("ora");
const symbols = require("log-symbols");
const { program } = require("commander");

// 判断文件夹是否存在，不存在则创建文件夹
function createDir(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (createDir(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

// 创建文件
function createFile(filePath, fileContent) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileContent, { flag: "a" }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

const tsTemplate = `// {{page}}.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})`;

const jsonTemplate = `{
  "usingComponents": {}
}`

const wxmlTemplate = `<!--{{page}}.wxml-->
<text>{{page}}.wxml</text>
`
const scssTemplate = `/* {{page}}.wxss */`


// 下载模板
program
  .version(require("../package").version, "-v, --version")
  .command("init <name>")
  .action((name) => {
    const lqProcess = ora("正在下载模板...");
    lqProcess.start();
    download(
      "direct:https://github.com/fengyk1/wxapp.git",
      name,
      { clone: true },
      (err) => {
        if (err) {
          lqProcess.fail();
          console.log(symbols.error, chalk.red(err));
        } else {
          lqProcess.succeed();
          const fileName = `${name}/package.json`;
          if (fs.existsSync(fileName)) {
            const packageJson = JSON.parse(fs.readFileSync(fileName).toString());
            const newPackageJson = Object.assign(packageJson,{name})
            fs.writeFileSync(fileName, JSON.stringify(newPackageJson,null,2));
          }
          console.log(symbols.success, chalk.green("下载完成"));
        }
      }
    );
  });

program.command("create <filePath>").action((filePath) => {
  const dirPath = `${path.resolve(".")}/src`;
  if (createDir(`${dirPath}/${filePath}`)) {
    Promise.all([
      createFile(
        `${dirPath}/${filePath}/index.ts`,
        tsTemplate
      ),
      createFile(
        `${dirPath}/${filePath}/index.json`,
        jsonTemplate
      ),
      createFile(
        `${dirPath}/${filePath}/index.wxml`,
        wxmlTemplate
      ),
      createFile(
        `${dirPath}/${filePath}/index.scss`,
        scssTemplate
      ),
    ]).then(() => {
      console.log(chalk.green("创建成功"));
    });
  }
});
program.parse(process.argv);
