async function fetchGoods() {
    const res = await fetch('/api/getGoods');
    const json = await res.json();
    return json;
}

async function renderGoods() {
    const arr = await fetchGoods();
    let htmlStr = '';
    arr.forEach(item => {
        htmlStr +=
        `
            <li class="list-item">
                <img src=${item.adaptionPic} />
                <div class="goods-info">
                    <p class="name">${item.name}</p>
                    <p class="desc">${item.describe}</p>
                    <span class="price">¥${item.price}</span>
                </div>
            </li>
        `
    });
    const oCont = document.querySelector('#cont');
    oCont.innerHTML = htmlStr;
}

async function registerSW() {
    window.addEventListener('load', () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('../sw.js')
            .then((registration) => {
                console.log(registration);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    });
}
/*
    如果页面一进来，用户没有联网，给用户一个通知
*/
if (Notification.permission === 'default') {
    Notification.requestPermission();
}
if (!navigator.onLine) {
    // 没网的
    new Notification('提示', {
        body: '你当前没有网络，你访问的是缓存'
    })
}
window.addEventListener('online', () => {
    new Notification('提示', {
        body: '你已经连上网络了，请刷新访问最新的数据'
    });
});
renderGoods();
registerSW();