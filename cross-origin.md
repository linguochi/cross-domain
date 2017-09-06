# 跨域

## 同源策略

> 只有当`协议`、`域名`、`端口`相同的时候才算是同一个域，否则在浏览器端均需要做跨域的处理。
> 跨域主要分为两种
> * 一种是`xhr`不能访问非同源的文档
> * 另一种是不同window（窗口）之间不能进行交互操作;
>  DOM、 Cookie、Localstorage等

![2017-09-06-11-12-01](http://oco8b7wkr.bkt.clouddn.com/2017-09-06-11-12-01.png)

· 协议不同，如http, https；

· 端口不同；

· 主域相同，子域不同；

· 主域不同；

· ip地址和域名之间也算是跨域，浏览器不会自动做ip域名的映射；

## 解决方案

1. 针对xhr的跨域
    1. CORS、
    1. JSONP
1. 针对window的跨域
    1. postMessage
    1. window.name
    1. location.hash

### CORS

![2017-09-06-14-35-31](http://oco8b7wkr.bkt.clouddn.com/2017-09-06-14-35-31.png)

· `CORS（Cross-Origin Resource Sharing）`跨域资源共享是一种通过前后端http头部配置来进行跨域的一种方式,主要是为克服 xhr 只能同源使用的限制；实现 CORS 通信的关键是让`服务器`来确定是否允许跨域访问。
对于`浏览器`来说，一旦发现AJAX请求跨源，就会`自动`添加一些附加的头信息，有时还会多出一次附加的请求(非简单请求时)。
对于浏览器端开发者来说，CORS 通信与同源的 xhr 通信没有差别。

> 浏览器将CORS请求分成两类：`简单请求（simple request）`和`非简单请求（not-so-simple request）`。

#### 简单请求和非简单请求

只要同时满足以下两大条件，就属于简单请求。

（1) 请求方法是以下三种方法之一：
- HEAD
- GET
- POST

（2）HTTP的头信息不超出以下几种字段：

- `Accept`
- `Accept-Language`
- `Content-Language`
- `Last-Event-ID`
- `Content-Type`：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

凡是`不同时满足`上面两个条件，就属于非简单请求。

#### 浏览器对简单请求的跨域处理

浏览器直接发出CORS请求，在http头信息之中，自动增加一个`Origin`字段，Origin字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口），供服务器判断是否同意本次请求。
如果Origin指定的源，在服务器`许可范围内`，服务器返回的响应，会多出几个头信息字段（这些字段`并非完全必须`）。

- `Access-Control-Allow-Origin`: http://api.bob.com
- `Access-Control-Allow-Credentials`: true
- `Access-Control-Expose-Headers`: FooBar
Content-Type: text/html; charset=utf-8。

（1）Access-Control-Allow-Origin
该字段是`必须`的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。

（2）Access-Control-Allow-Credentials
该字段`可选`。它的值是一个布尔值，表示`是否允许发送Cookie`。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。

（3）Access-Control-Expose-Headers
该字段`可选`。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。


#### 浏览器对非简单请求的处理

在发出这个非简单请求之前，浏览器会增加一次HTTP查询请求，称为"预检"请求（preflight）：

浏览器先询问服务器，当前网页所在的域名`是否在服务器的许可名单之中`，以及`可以使用哪些HTTP动词`和`头信息字段`。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。
当浏览器预检通过后，非简单请求的剩余处理和简单请求类似。

`兼容性`：如果不考虑pc端的IE，移动端的opera的话，CORS兼容性还是不错的，针对ie和opera可以做适当的降级处理；

#### CORS 的优缺点：

- 使用简单方便，更为安全
- 不仅支持GET，还支持其他请求方式
- CORS 是一种新型的跨域问题的解决方案，存在兼容问题，仅支持 IE 10 以上


### JSONP

`JSONP(JSON with Padding)` 其实是个历史遗留

xhr是受同源限制的，但是大部分具有`src`属性的`html标签`发起的资源请求却不受同源限制，从而可以利用`动态script标签`技术跨域请求：

1. 首先前端先`设置好回调函数`，并将其函数名作为`url 的参数`，后端以此参数来设计自己的回调接口。

1. 服务端接收到请求后，通过该参数获得回调函数名，并将数据放在参数中将其返回

1. 收到结果后因为是 script 标签，所以浏览器会当做是脚本进行运行，从而达到跨域获取数据的目的。

#### 优缺点：

1. 优点：

    它不像XMLHttpRequest 对象实现 Ajax 请求那样受到同源策略的限制
    兼容性很好，在古老的浏览器也能很好的运行
    不需要 XMLHttpRequest 或 ActiveX 的支持

1. 缺点：

    它只支持 `GET` 请求而不支持 POST 等其它类行的 HTTP 请求。
    它只支持跨域 HTTP 请求这种情况，不能解决不同域的两个页面或 iframe 之间进行数据通信的问题

### postMessage

HTML5为window对象新增了postMessage方法，可以使用它来向其它的window对象发送消息，无论这个window对象是属于同源或不同源。
![2017-09-06-15-00-38](http://oco8b7wkr.bkt.clouddn.com/2017-09-06-15-00-38.png)

#### 发送

```js
otherWindow.postMessage(message, targetOrigin, [transfer])
```

*otherWindow* : 要往哪个窗口发送消息
> 其他窗口的一个引用，比如iframe的contentWindow属性、执行window.open返回的窗口对象、或者是命名过或数值索引的window.frames.

`message` : 你要发送的信息（字符串和对象都可以）

`targetOrigin` : 指定这个otherWindow(目标窗口)的源

`transfer` 可选参数，具体啥意思还没做深入了解，也暂时都还没用到过。

#### 接收

```js
//  监听window 的 "message" 事件来获取到传递过来的值
window.addEventListener('message',receiveMessage,false);

function receiveMessage(event){
    // ...
}
```

接收到的`event`包含下面几个重要的属性：

* `data`

    传递过来的信息。

* `origin`

    发送消息的域名，包含了协议和端口（如`https://developer.mozilla.org:443`），通常情况下 默认端口会被省略，例如 `https://www.google.com` 意味着省略了端口443 , `http://www.google.com`省略了端口 80。

* `source`

    发送数据的window的引用，例如b域名收到a域名的消息，此时的source指的是a域名的window，你可以通过它来实现双向通讯。



### window.name

只要在一个window下，无论url怎么变化，只要设置好了window.name，那么后续就一直都不会改变，同理，在iframe中，即使url在变化，iframe中的window.name也是一个固定的值.

```js
window.name
//""

window.name='test';
// "test"

location.href='http://www.baidu.com';
//跳转到 to https://www.baidu.com/

window.name
//"test" 还是没有变
```

利用window.name的性质，我们可以在iframe中加载一个`跨域页面C`。

这个C页面载入之后，让它设置自己的`window.name`，
然后再让它进行当前页面的跳转，跳转到`与iframe外的页面(主页面)同域的页面B`，
此时`window.name`是不会改变的。

这样，`iframe内外`就属于`同一个域`了，且window.name还是跨域的页面C所设置的值。

### location.hash

> `location.hash` 是一个可读可写的字符串，该字符串是 URL 的锚部分（从 `#` 号开始的部分）

改变 `hash` 并不会导致页面刷新，可以利用 `hash` 在不同源间传递数据
在 iframe 页面中修改 父亲页面的 hash 值。由于在 IE 和 Chrome 下，两个不同域的页面是不允许 parent.location.hash 这样赋值的，所以对于这种情况，我们需要在父亲页面域名下添加另一个页面来实现跨域请求，具体如下：

假设 a.html 中 iframe 引入了 c.html, 数据需要在这两个页面之间传递，且 b.html 是一个与 a.html 同源的页面:

1. a.html 通过 iframe 将数据通过 hash 传给 c.html
1. c.html 通过 iframe 将数据通过 hash 传给 b.html
1. b.html 通过 parent.parent.location.hash 设置 a.html 的 hash 达到传递数据的目的

`优点`在于可以解决域名完全不同的跨域请求，并且可以实现双向通讯；

而`缺点`则包括以下几点：

    - 利用这种方法传递的数据量受到 url 大小的限制，传递数据类型有限
    - 由于数据直接暴露在 url 中则存在安全问题
    - 若浏览器不支持 onhashchange 事件，则需要通过轮询来获知 url 的变化，有些浏览器会在 hash 变化时产生历史记录，因此可能影响用户体验

### document.domain

> 在根域范围内，允许把domain属性的值设置为它的上一级域(主域必须相同)。例如，在 developer.mozilla.org 域内，可以把domain设置为 “mozilla.org” 但不能设置为 “mozilla.com” 或者”org”。

修改document.domain的方法只适用于不同子域的框架间的交互。


### Proxy

所谓代理，就是用后台技术实现代理服务器，前端访问代理服务器，代理服务器向实际服务器发起请求，拿到数据再返回给前端。

eg: `http-proxy-middleware`

### WebSocket

WebSocket 协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

## 参考链接

[关于跨域，你想知道的全在这里](https://zhuanlan.zhihu.com/p/25778815)

[说说跨域那些事](https://itoss.me/2016/12/31/%E8%AF%B4%E8%AF%B4%E8%B7%A8%E5%9F%9F%E9%82%A3%E4%BA%9B%E4%BA%8B%E5%84%BF/)

[前端跨域请求解决方案汇总](https://hijiangtao.github.io/2017/06/13/Cross-Origin-Resource-Sharing-Solutions/)