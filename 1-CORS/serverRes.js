var express = require('express');
var app = express();

var responsePort = 3001; // 响应请求的页面跑在3001端口


var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');


    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};
app.use(allowCrossDomain);


// 可以改变‘/’为其他的路径，改完之后serverReq.js里面的请求路径也需要改变
app.get('/', (req, res) => {

    /**
     * 服务端不加这条则会报警
     * XMLHttpRequest cannot load http://localhost:3001/. 
     * No 'Access-Control-Allow-Origin' header is present on the requested resource. 
     * Origin 'http://localhost:3000' is therefore not allowed access
     */

    res.send("Hello world from CROS.😡"); // 空格部分为表情，可能在编辑器不会显示
});

app.delete('/', (req, res) => {
    res.send(200);
})

app.listen(responsePort, function () {
    console.log('cros_responser is listening on port ' + responsePort);
});