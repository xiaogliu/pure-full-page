这个插件通过原生 JS 实现了全屏滚动，全部代码不到 100 行。

## 前面的话

现在已经有很多全屏滚动插件了，比如著名的 [fullPage](https://github.com/alvarotrigo/fullPage.js)，那问什么还要自己造轮子呢？

首先，现有轮子有以下问题：

* 首先，最大的问题是最流行的几个插件都依赖 jQuery，这意味着在使用 React 或者 Vue 的项目中使用是一件十分蛋疼的事：我只需要一个全屏滚动功能，却还需要把 jQuery 引入，有种杀鸡使用宰牛刀的感觉；
* 其次，现有的很多全屏滚动插件功能往往都十分丰富，这在前几年是优势，但现在（2018-4）可以看作是劣势：前端开发已经发生了很大变化，其中很重要的一个变化是 ES6 原生支持模块化开发，模块化开发最大的特点是一个模块最好只专注做好一件事，然后再拼成一个完整的系统，从这个角度看，大而全的插件有悖模块化开发的原则。

对比之下，通过原生语言造轮子有以下好处：

* 使用原生语言编写的插件，自身不会受依赖的插件的使用场景而影响自身的使用（现在依赖 jQuery 的插件非常不适合开发单页面应用），所以使用上更加灵活；
* 搭配模块化开发，使用原生语言开发的插件可以只专注一个功能，所以代码量可以很少（我编写的这个全屏滚动插件去掉注释和空行后，全部代码不到 100 行）；
* 最后，随着 JS/CSS/HTML 的发展以及浏览器不断迭代更新，现在使用原生语言编写插件的开发成本越来越低，那为什么不呢？

## 使用方法

### 1） 创建 html，结构如下

```html
<div id="pureFullPage">
  <div class="page"></div>
  <div class="page"></div>
  <div class="page"></div>
</div>
```

其中，id 为 `pureFullPage` 的 div 是所有滚动页面的容器，class 为 `page` 的 div 为具体页面的容器。

页面容器 id 必须为 `pureFullPage`，具体页面 class 必须包含 `page`，因为 css 会根据 `#pureFullPage` 和 `.page` 设置样式。

### 2）引入 pureFullPage 的 css 文件

在 html 文件头部添加下面代码

```html
<link rel="stylesheet" href="./css/pureFullPage.css">
```

### 3）引入 pureFullPage 的 js 文件

**这里需要注意**，因为本例采用了 ES6 语法，所以不需要在 html 文件中直接引入 `pureFullPage.js`，只需要引入入口文件（本例中是 `index.js`），在入口文件中通过 `import` 引入 `pureFullPage.js`。

* 在 html 中引入入口文件

```html
<!-- 本例中入口文件是 index.js -->
<script type="module" src="./js/index.js"></script>
```

这里要注意，chrome 现在原生支持 ES module 语法，但需要注明 `type="module"`

* 在 `index.js` 中引入 `pureFullPage.js` ，创建并初始化实例

```js
// 引入 pureFullPage.js
import PureFullPage from './components/pureFullPage.js';

// 创建实例时，把页面容器 id 作为参数传入
new PureFullPage('#pureFullPage')._init();
```

### 4）运行

不同于普通脚本，ES6 模块脚本遵循同源策略，所以不能在跨域请求时（如果没有设置 CORS header）或者本地文件系统使用，请在本地服务器中运行本例中的 demo。

## 了解更多

可查看这篇文章查看详细开发过程（待补充）

## TODO

1.  详细介绍文章；
2.  更多参数配置；
3.  浏览器兼容（不然 utils 没意义了）；
4.  npm package；
5.  手机支持（主要是触屏事件）;
6.  英文版说明。

## 参考资料

[纯 JS 全屏滚动 / 整屏翻页](https://blog.csdn.net/tangdou5682/article/details/52351404)
