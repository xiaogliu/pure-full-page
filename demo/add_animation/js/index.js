/**
 * 添加交互动画
 */
let addAnimation = function(currentPosition) {
  let pages = document.querySelectorAll('.page');
  pages = Array.prototype.slice.call(pages);
  const viewHeight = document.documentElement.clientHeight;
  // i 表示当前页面的索引
  let i = -(currentPosition / viewHeight);

  /**
   * TODO：每次进入当前页面都会执行下面代码，
   * 修改下面代码，可自定义页面动画
   * 下面示例给每个页面的 p 元素添加了淡入动画
   */
  document.querySelector('.fade-in').classList.remove('fade-in');
  pages[i].querySelector('p').classList.add('fade-in');
};

// 创建全屏滚动实例，传入动画回调函数，并初始化
new PureFullPage({
  definePages: addAnimation,
}).init();
