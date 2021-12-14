/**
 * 全屏滚动逻辑
 */
class PureFullPage {
  constructor(options) {
    // 默认配置
    const defaultOptions = {
      isShowNav: true,
      definePages: () => {},
    };
    utils.polyfill();
    // 合并自定义配置
    this.options = Object.assign(defaultOptions, options);
    // 将用户自定义函数绑定到实例 this
    this.options.definePages = this.options.definePages.bind(this);
    // 获取翻页容器
    this.container = document.querySelector('#pureFullPage');
    // 获取总页数，创建右侧点导航时用
    this.pages = document.querySelectorAll('.page');
    this.pagesNum = this.pages.length;
    // 初始化右侧点导航，以备后用
    this.navDots = [];
    // 获取当前视图高度
    this.viewHeight = document.documentElement.clientHeight;
    // 当前位置，负值表示相对视图窗口顶部向下的偏移量
    this.currentPosition = 0;
    // 检测滑动方向，只需要检测纵坐标
    this.startY = undefined;

    /**
     * 初始化
     */
    this.init();
  }
  // window resize 时重新获取位置
  getNewPosition() {
    this.viewHeight = document.documentElement.clientHeight;
    this.container.style.height = `${this.viewHeight}px`;
    let activeNavIndex;
    this.navDots.forEach((e, i) => {
      if (e.classList.contains('active')) {
        activeNavIndex = i;
      }
    });
    this.currentPosition = -(activeNavIndex * this.viewHeight);
    this.turnPage(this.currentPosition);
  }
  // 页面跳转
  turnPage(height) {
    this.container.style.top = `${height}px`;
  }
  // 随页面滚动改变样式
  changeNavStyle(height) {
    if (this.options.isShowNav) {
      this.navDots.forEach(el => {
        utils.deleteClassName(el, 'active');
      });

      const i = -(height / this.viewHeight);
      this.navDots[i].classList.add('active');
    }
  }
  // 创建右侧点式导航
  createNav() {
    const nav = document.createElement('div');
    nav.className = 'nav';
    this.container.appendChild(nav);

    // 有几页，显示几个点
    for (let i = 0; i < this.pagesNum; i++) {
      nav.innerHTML += '<p class="nav-dot"><span></span></p>';
    }

    const navDots = document.querySelectorAll('.nav-dot');
    this.navDots = Array.prototype.slice.call(navDots);

    // 添加初始样式
    this.navDots[0].classList.add('active');

    // 添加点式导航点击事件
    this.navDots.forEach((el, i) => {
      el.addEventListener('click', () => {
        // 页面跳转
        this.currentPosition = -(i * this.viewHeight);
        // 处理用户自定义函数
        this.options.definePages();
        this.turnPage(this.currentPosition);

        // 更改样式
        this.navDots.forEach(el => {
          utils.deleteClassName(el, 'active');
        });
        el.classList.add('active');
      });
    });
  }
  goUp() {
    // 只有页面顶部还有页面时页面向上滚动
    if (-this.container.offsetTop >= this.viewHeight) {
      // 重新指定当前页面距视图顶部的距离 currentPosition，实现全屏滚动，currentPosition 为负值，越大表示超出顶部部分越少
      this.currentPosition = this.currentPosition + this.viewHeight;

      this.turnPage(this.currentPosition);
      this.changeNavStyle(this.currentPosition);
      // 处理用户自定义函数
      this.options.definePages();
    }
  }
  goDown() {
    // 只有页面底部还有页面时页面向下滚动
    if (-this.container.offsetTop <= this.viewHeight * (this.pagesNum - 2)) {
      // 重新指定当前页面距视图顶部的距离 currentPosition，实现全屏滚动，currentPosition 为负值，越小表示超出顶部部分越多
      this.currentPosition = this.currentPosition - this.viewHeight;

      this.turnPage(this.currentPosition);
      this.changeNavStyle(this.currentPosition);

      // 处理用户自定义函数
      this.options.definePages();
    }
  }
  // 鼠标滚动逻辑（全屏滚动关键逻辑）
  scrollMouse(event) {
    const delta = utils.getWheelDelta(event);
    // delta < 0，鼠标往前滚动，页面向下滚动
    if (delta < 0) {
      this.goDown();
    } else {
      this.goUp();
    }
  }
  // 触屏事件
  touchEnd(event) {
    const endY = event.changedTouches[0].pageY;
    if (endY - this.startY < 0) {
      // 手指向上滑动，对应页面向下滚动
      this.goDown();
    } else {
      // 手指向下滑动，对应页面向上滚动
      this.goUp();
    }
  }
  // 初始化函数
  init() {
    this.container.style.height = `${this.viewHeight}px`;
    // 创建点式导航
    if (this.options.isShowNav) {
      this.createNav();
    }

    // 鼠标滚轮监听，火狐鼠标滚动事件不同其他
    const handleMouseWheel = utils.debounce(this.scrollMouse.bind(this), 40, true);
    if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
      document.addEventListener('mousewheel', handleMouseWheel);
    } else {
      document.addEventListener('DOMMouseScroll', handleMouseWheel);
    }

    // 手机触屏屏幕
    document.addEventListener('touchstart', event => {
      this.startY = event.touches[0].pageY;
    });
    const handleTouchEnd = utils.throttle(this.touchEnd, this, 500);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', event => {
      event.preventDefault();
    });

    // 窗口尺寸变化时重置位置
    const handleNewPosition = utils.debounce(this.getNewPosition.bind(this), 200);
    window.addEventListener('resize', handleNewPosition);
  }
}
