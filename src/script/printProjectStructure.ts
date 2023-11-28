const fs = require('fs');
const path = require('path');

const rootDir = 'C:/Users/Zoe/Documents/GitHub/thef2e2023-real-time-invoice-Issuance';

function walkDir(dir, level = 0) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    let fullPath = path.join(dir, file);
    let stat = fs.lstatSync(fullPath);
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.vscode'
    && file !== '.angular' && file !== '.git') { // 忽略 node_modules
      console.log(' '.repeat(level * 2) + '|-- ' + file); // 打印資料夾名
      walkDir(fullPath, level + 1);
    } else {
      console.log(' '.repeat(level * 2) + '|-- ' + file); // 打印檔案名
    }
  });
}

walkDir(rootDir);
