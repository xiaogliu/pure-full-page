document.addEventListener('DOMContentLoaded', function () {
  // 添加交互动画,不能使用箭头函数，要引用实例中的 this
  const addAnimation = function() {
    // i 表示每次滑动将要进入的页面的索引，可以通过 this.pages[i] 获取当前页面
    // 取得将要进入页面后便可以做进一步操作，比如，添加动画
    const i = -(this.currentPosition / this.viewHeight);

    // 为将要进入页面添加动画
    document.querySelector('.fade-in').classList.remove('fade-in');
    this.pages[i].querySelector('p').classList.add('fade-in');
  };

  // 创建全屏滚动实例，传入动画回调函数，并初始化
  new PureFullPage({
    definePages: addAnimation,
  });
});

window.addEventListener('load', function () {
  document.querySelector('p').classList.add('fade-in');
});
