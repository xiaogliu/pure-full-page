![license](https://img.shields.io/packagist/l/doctrine/orm.svg)
![issues/PRs](https://img.shields.io/badge/issues%2FPRs-welcome-brightgreen.svg)
![GitHub release](https://img.shields.io/github/release/xiaogliu/pure_full_page.svg)

Full-screen scrolling plugin written in native JS: compatible with IE 10+, mobile phone touch screen, Mac touch pad optimization, customizable page animation, gzip file <2.15KB.

[DEMO](https://xiaogliu.github.io/pure-full-page/index.html); download [file](https://github.com/xiaogliu/pure-full-page/releases); [中文文档](https://github.com/xiaogliu/pure-full-page/blob/master/readme-zh_CN.md)

## Why I write it

There are already many full-screen scrolling plugins, such as the famous [fullPage](https://github.com/alvarotrigo/fullPage.js), Why do I write another one?

The existing plug-ins have the following problems:

- First of all, the biggest problem is that the most popular plugins all rely on jQuery, which means that it is a very painful thing to use in projects that use React or Vue: I only need a full-screen scrolling plugin, but I also need to import jQuery. That's ridiculous!
- Secondly, many existing full-screen scrolling plugins have too much features, which was an advantage in the past few years, but now (2018-4) I think it's a disadvantage: front-end development has undergone great changes, of which the most important one change is that ES6 natively supports modular development. The biggest feature of modular development is that a module is best to focus on only one feature, and use many small modules build a complete system. From this perspective, a large and feature-rich plugin is contradictory the principle of modular development.

In contrast, this plugin in native JS has the following benefits:

- Plugins written in native languages will not be affected by the usage scenarios of dependent plugins (plugins that depend on jQuery are not suitable for use in single-page applications (react/vue)), so they are more flexible in use;
- With modular development, plugins developed in native languages can focus on only one function, so the amount of code can be small, which is convenient for development and maintenance;
- Finally, with the updating of JS/CSS/HTML and browsers, the cost of writing plugins in native languages is getting lower and lower, so why not?

## Instructions

### 1) Create `html` with the following structure

```html
<div id="pureFullPage">
  <div class="page"></div>
  <div class="page"></div>
  <div class="page"></div>
</div>
```

The div with id `pureFullPage` is the container for all scrolling pages, and the div with class `page` is the container for specific pages.

The page container id must be `pureFullPage`, and the specific page class must contain `page`, because css will set the style according to `#pureFullPage` and `.page`.

### 2) Import pureFullPage's JS and CSS files

The JS and CSS compressed files of pureFullPage are in the `dist` directory, and the source files are in the `src` directory.

- import by path

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    ...
    <link rel="stylesheet" href="youtpath/pureFullPage.min.css" />
  </head>
  <body>
    ...
    <script src="youtpath/pureFullPage.min.js"></script>
  </body>
</html>
```

- import by ES6 modular

1. install npm package：

```bash
npm install pure-full-page
```

2. import js and css file

Note: The css file needs to be imported separately.

```js
// css imported separately
import "pure-full-page/lib/pureFullPage.min.css";
import PureFullPage from "pure-full-page";
```

> But in fact, most of the code in the css file is to define the style of navigation (rotation point on the right). If you have the need for custom navigation, you can copy `src/css/pureFullPage.scss` to your own project, and then rewrite your own navigation style instead of customizing the style by overwriting. If this is the case, you do not need to `import 'pure-full-page/lib/pureFullPage.min.css';`.

- Other instructions

At first, the page background was defined in `pureFullPage.min.css`, but considering that the background is often customized during use, in order to reduce redundant code, the background is not set in the CSS of the plugin, so if you need you should write by yourself.

### 3) Create a new pureFullPage instance and initialize

```js
// Create a new pureFullPage instance and initialize
new PureFullPage();
```

### 4) Custom parameters

When instantiating pureFullPage, an object is accepted as a parameter, which can control whether to display the right navigation (It often does not need the right navigation on mobile) and custom page animation. The sample code is as follows:

```js
new PureFullPage({
  isShowNav: true,
  definePages: addAnimation,
});
```

| param name    | type     | default value | definition                                                                                                                                                                                                       |
| ------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isShowNav`   | boolean  | `true`        | controls whether to display the right navigation                                                                                                                                                                 |
| `definePages` | function | `() => {}`    | This function will be triggered every time the page scrolls. It is mainly used to **get the page element to be entered**, and get the page element, you can perform related operations, generally add animation. |


> If you need to customize the function of `definePages`, when define it that **its definition cannot be used arrow function**, because the custom function `this` is bound to the instance itself during the implementation of `pureFullPage`, which is convenient to get the entered page, see the following sample code for adding animation to the page that under `pureFullPage`:

```js
// do not use arrow function
let addAnimation = function() {
  // i represents the index of the page that will be entered every time you slide, you can get the current page element through this.pages[i]
  let i = -(this.currentPosition / this.viewHeight);

  // Add animation to the page to be entered
  document.querySelector(".fade-in").classList.remove("fade-in");
  this.pages[i].querySelector("p").classList.add("fade-in");
};
```

> The complete code for adding animations is in the directory of `demo/add_animation/`

## Read more

Please check [Develop full scroll page by ES6](https://xiaogliu.github.io/2018/04/28/develop-full-page-scroll-by-es6/) to know the details of developing this plugin (**Chinese**)。

## License

MIT

## re-develop

If you want to develop full scroll page plugin based on this project, the following info maybe help:

- Project structure

  .  
   |-- demo &nbsp;  
   | &nbsp;&nbsp;&nbsp; |-- add_animation &nbsp;&nbsp; # demo with animation  
   | &nbsp;&nbsp;&nbsp; |-- simple &nbsp;&nbsp; # simplest demo  
   |-- dist &nbsp;&nbsp; # compressed prod code  
   |-- lib &nbsp;&nbsp; # code used by npm package, CommonJS specification 
   |-- src &nbsp;&nbsp; # source code

- develop

1) clone this project to your computer

```bash
git clone git@github.com:xiaogliu/pure-full-page.git
```

2) Install dependencies

```bash
npm install
```

3) Managed by gulp during development

```bash
# The process of sending monitors the changes of files in the src directory, and updates the files under dist if there are changes
npm run watch

# Manually generate the files under the new dist
npm run build
```

4) Develop you code in `./src` file 

Will auto compile file to `./dist`(used without NPM/ES6 modular) and `./lib` (used in NPM/ES6 modular)
 