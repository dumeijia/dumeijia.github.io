const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
app.use(express.static('public'));


// 获取接口数据，随机返回10条数据
app.get('/api/getGoods', async (req, res) => {
    console.log('接受请求');
    try {
        const data = await getData();
        const goods = random(data.list);
        res.send(goods);
    } catch (e) {
        console.log(e);
        res.end('404');
    }
});

app.listen(8888, () => {
    console.log('服务器启动成功了，访问地址http://localhost:8888');
});

function getData() {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'data.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function random(goods) {
    return goods.sort(() => Math.random() - 0.5).slice(0, 10);
}