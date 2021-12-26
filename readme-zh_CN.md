![license](https://img.shields.io/packagist/l/doctrine/orm.svg)
![issues/PRs](https://img.shields.io/badge/issues%2FPRs-welcome-brightgreen.svg)
![GitHub release](https://img.shields.io/github/release/xiaogliu/pure_full_page.svg)

原生 JS 编写的全屏滚动插件：兼容 IE 10+、手机触屏，Mac 触摸板优化，可自定义页面动画，gzip 文件 < 2.15KB。

查看 [DEMO](https://xiaogliu.github.io/pure-full-page/index.html)；下载 [文件](https://github.com/xiaogliu/pure-full-page/releases)；[English doc](https://github.com/xiaogliu/pure-full-page/blob/master/readme.md)

## 前面的话

现在已经有很多全屏滚动插件了，比如著名的 [fullPage](https://github.com/alvarotrigo/fullPage.js)，那为什么还要自己造轮子呢？

首先，现有轮子有以下问题：

* 首先，最大的问题是最流行的几个插件都依赖 jQuery，这意味着在使用 React 或者 Vue 的项目中使用是一件十分蛋疼的事：我只需要一个全屏滚动功能，却还需要把 jQuery 引入，有种杀鸡使用宰牛刀的感觉；
* 其次，现有的很多全屏滚动插件功能往往都十分丰富，这在前几年是优势，但现在（2018-4）可以看作是劣势：前端开发已经发生了很大变化，其中很重要的一个变化是 ES6 原生支持模块化开发，模块化开发最大的特点是一个模块最好只专注做好一件事，然后再拼成一个完整的系统，从这个角度看，大而全的插件有悖模块化开发的原则。

对比之下，通过原生语言造轮子有以下好处：

* 使用原生语言编写的插件，自身不会受依赖的插件的使用场景而影响自身的使用（依赖 jQuery 的插件不适合在单页面应用（react/vue）中使用），所以使用上更加灵活；
* 搭配模块化开发，使用原生语言开发的插件可以只专注一个功能，所以代码量可以很少，方便开发和维护；
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

### 2）引入 pureFullPage 的 JS 和 CSS 文件

pureFullPage 的 JS 和 CSS 压缩后的文件在 `dist` 目录下，源文件在 `src` 目录下。

* 传统引入方式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    ...
    <link rel="stylesheet" href="youtpath/pureFullPage.min.css">
</head>
<body>
    ...
    <script src="youtpath/pureFullPage.min.js"></script>
</body>
</html>
```

* ES6 模块化引入

1）安装 npm package：

```bash
npm install pure-full-page
```

2）引入 js 和 css 文件

需要注意的是 css 文件需要单独引入。

```js
// css 文件需单独引入
import 'pure-full-page/lib/pureFullPage.min.css';
import PureFullPage from 'pure-full-page';
```

> 但实际上，css 文件中大部分代码是定义导航（右侧轮播点）样式，如果你有自定义导航的需求，完全可以自己复制 `src/css/pureFullPage.scss` 到自己项目中，然后重写自己的导航样式，而不是通过覆盖的方式自定义样式。如果这样的话，就不需要 `import 'pure-full-page/lib/pureFullPage.min.css';` 了

* 其他说明

最开始在 `pureFullPage.min.css` 中定义了页面背景，但考虑到在使用过程中往往都会自定义背景，为了减少冗余代码，没在插件的 css 中设置背景，所以使用过程中记得自己设置。

### 3）新建 pureFullPage 实例并初始化

```js
// 创建实例并初始化
new PureFullPage();
```

### 4）自定义参数

实例化 pureFullPage 时接受一个对象作为参数，可以控制是否显示右侧导航（移动端往往不需要右侧导航）及自定义页面动画，示例代码如下：

```js
// 创建实例并初始化
new PureFullPage({
  isShowNav: true,
  definePages: addAnimation,
});
```

其中：

* `isShowNav` 控制是否显示右侧导航，Boolean 类型，默认为 `true`，设为 `false` 则不显示；

* `definePages` 是 Function 类型，默认为空函数（什么都不操作）。这个函数会在页面每次滚动时触发，主要用来**获取将要进入的页面元素**，拿到页面元素，就可以进行相关操作了，一般是添加动画。

`definePages` 需要特别说明下，若需要自定义，则**定义时不能使用箭头函数**，因为自定义函数内部 `this` 在 `pureFullPage` 实现时绑定到了实例本身，方便获取将要进入的页面元素，见下面为将要进入的页面添加动画的示例代码：

```js
// 不能使用箭头函数，要引用实例中的 this
let addAnimation = function() {
  // i 表示每次滑动将要进入的页面的索引，可以通过 this.pages[i] 获取当前页面元素
  // 取得将要进入的页面元素后便可以做进一步操作
  let i = -(this.currentPosition / this.viewHeight);

  // 为将要进入页面添加动画
  document.querySelector('.fade-in').classList.remove('fade-in');
  this.pages[i].querySelector('p').classList.add('fade-in');
};
```

> 添加动画的完整代码在 `demo/add_animation/` 目录下

## 了解更多

可查看 [用 ES6 写全屏滚动插件](https://xiaogliu.github.io/2018/04/28/develop-full-page-scroll-by-es6/) 了解详细开发过程。

## License

MIT

## 再开发

如果你想基于该项目进行二次开发，可以了解下下面内容：

* 目录

  .  
   |-- demo &nbsp;  
   | &nbsp;&nbsp;&nbsp; |-- add_animation &nbsp;&nbsp; # 带动画的 demo  
   | &nbsp;&nbsp;&nbsp; |-- simple &nbsp;&nbsp; # 最简 demo  
   |-- dist &nbsp;&nbsp; # 压缩后的生产代码  
   |-- lib &nbsp;&nbsp; # npm package 使用的源代码，遵循 CommonJS 规范  
   |-- src &nbsp;&nbsp; # 源代码

* 开发

1）clone 本仓库到本地

```bash
git clone git@github.com:xiaogliu/pure-full-page.git
```

2）安装依赖

```bash
npm install
```

3）开发过程中通过 gulp 进行管理

```bash
# 开发过程监听 `src` 目录下文件的变化，有变化更新 dist 下面的文件
npm run watch

# 手动生成新的 dist 下面的文件
npm run build
```

4) 在 `./src` 文件夹下进行开发 

会自动编译到 `./dist` (直接引入 js 文件，不使用 NPM/ES6 modular) 和 `./lib` (使用 NPM/ES6 modular)
