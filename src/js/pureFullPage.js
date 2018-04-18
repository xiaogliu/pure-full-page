/**
 * 全屏滚动逻辑
 */
class PureFullPage {
  constructor(options) {
    // 默认配置
    const defaultOptions = {
      container: '#pureFullPage',
      isShowNav: true,
      definePages: () => {},
    };
    Utils.polyfill();
    // 合并自定义配置
    this.options = Object.assign(defaultOptions, options);
    // 获取翻页容器
    this.main = document.querySelector(this.options.container);
    // 获取总页数，创建右侧点导航时用
    this.pagesNum = document.querySelectorAll('.page').length;
    // 初始化右侧点导航，以备后用
    this.navDots = [];
    // 获取当前视图高度
    this.viewHeight = document.documentElement.clientHeight;
    // 当前位置，负值表示相对视图窗口顶部向下的偏移量
    this.currentPosition = 0;
    // 截流/截流函数间隔时间，毫秒
    this.DELAY = 50;
    // 手机坐标
    this.startX = undefined;
    this.startY = undefined;
  }
  // 获取手机角度
  getAngle(angX, angY) {
    return Math.atan2(angY, angX) * 180 / Math.PI;
  }
  // 根据起点终点返回方向 1向上 2向下
  getDirection(startX, startY, endX, endY) {
    let angX = endX - startX;
    let angY = endY - startY;
    let result = 0;

    //如果滑动距离太短
    if (Math.abs(angX) < 2 && Math.abs(angY) < 2) {
      return result;
    }

    let angle = this.getAngle(angX, angY);

    if (angle >= -135 && angle <= -45) {
      result = 1;
    } else if (angle > 45 && angle < 135) {
      result = 2;
    }

    return result;
  }
  // window resize 时重新获取位置
  getNewPosition() {
    this.viewHeight = document.documentElement.clientHeight;
    let activeNavIndex;
    this.navDots.forEach((e, i) => {
      if (e.classList.contains('active')) {
        activeNavIndex = i;
      }
    });
    this.currentPosition = -(activeNavIndex * this.viewHeight);
    this.turnPage(this.currentPosition);
  }
  handleWindowResize(event) {
    Utils.throttle(this.getNewPosition, this, event, this.DELAY);
  }
  // 页面跳转
  turnPage(height) {
    this.main.style.top = height + 'px';
  }
  // 随页面滚动改变样式
  changeNavStyle(height) {
    if (this.options.isShowNav) {
      this.navDots.forEach(el => {
        Utils.deleteClassName(el, 'active');
      });

      let i = -(height / this.viewHeight);
      this.navDots[i].classList.add('active');
    }
  }
  // 创建右侧点式导航
  createNav() {
    const nav = document.createElement('div');
    nav.className = 'nav';
    this.main.appendChild(nav);

    // 有几页，显示几个点
    for (let i = 0; i < this.pagesNum; i++) {
      nav.innerHTML += '<p class="nav-dot"><span></span></p>';
    }

    const navDots = document.querySelectorAll('.nav-dot');
    this.navDots = Array.prototype.slice.call(navDots);

    // 添加初始样式
    this.navDots[0].classList.add('active');

    // 添加点式导航击事件
    this.navDots.forEach((el, i) => {
      Utils.addHandler(el, 'click', () => {
        // 页面跳转
        this.currentPosition = -(i * this.viewHeight);
        // 处理用户自定义函数
        this.options.definePages(this.currentPosition);
        this.turnPage(this.currentPosition);

        // 更改样式
        this.navDots.forEach(el => {
          Utils.deleteClassName(el, 'active');
        });
        el.classList.add('active');
      });
    });
  }
  goUp() {
    // 重新指定当前页面距视图顶部的距离 currentPosition，实现全屏滚动，currentPosition 为负值，越大表示超出顶部部分越少
    this.currentPosition = this.currentPosition + this.viewHeight;

    // 当 currentPosition = 0 时，表示第一个页面的顶部与视图顶部处在相同位置，此时不允许继续向上滚动
    if (this.currentPosition > 0) {
      this.currentPosition = 0;
    }

    this.turnPage(this.currentPosition);
    this.changeNavStyle(this.currentPosition);
    // 处理用户自定义函数
    this.options.definePages(this.currentPosition);
  }
  goDown() {
    // 重新指定当前页面距视图顶部的距离 currentPosition，实现全屏滚动，currentPosition 为负值，越小表示超出顶部部分越多
    this.currentPosition = this.currentPosition - this.viewHeight;

    // 当 currentPosition =  -(this.viewHeight * (this.pagesNum - 1) 时，表示最后一个页面的顶部与视图顶部处在相同位置
    // 此时不允许继续向上滚动
    if (this.currentPosition < -(this.viewHeight * (this.pagesNum - 1))) {
      this.currentPosition = -(this.viewHeight * (this.pagesNum - 1));
    }

    this.turnPage(this.currentPosition);
    this.changeNavStyle(this.currentPosition);

    // 处理用户自定义函数
    this.options.definePages(this.currentPosition);
  }
  // 鼠标滚动逻辑（全屏滚动关键逻辑）
  scrollMouse(event) {
    let delta = Utils.getWheelDelta(event);

    // 向下滚动，delta < 表示向下滚动，且只有页面底部还有内容时才能滚动
    if (
      delta < 0 &&
      this.main.offsetTop > -(this.viewHeight * (this.pagesNum - 1))
    ) {
      this.goDown();
    }

    // 向上滚动，delta > 0，且页面顶部还有内容时才能滚动
    if (delta > 0 && this.main.offsetTop < 0) {
      this.goUp();
    }
  }
  // 初始化函数
  init() {
    // 创建点式导航
    if (this.options.isShowNav) {
      this.createNav();
    }
    // 设置间隔函数
    let handleMouseWheel = Utils.debounce(
      this.scrollMouse,
      this,
      this.DELAY,
      true,
    );

    // 鼠标滚轮监听，火狐鼠标滚动事件不同其他
    if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
      Utils.addHandler(document, 'mousewheel', handleMouseWheel);
    } else {
      Utils.addHandler(document, 'DOMMouseScroll', handleMouseWheel);
    }

    // 手指接触屏幕
    Utils.addHandler(document, 'touchstart', e => {
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
    });
    //手指离开屏幕
    Utils.addHandler(document, 'touchend', e => {
      let endX, endY;
      endX = e.changedTouches[0].pageX;
      endY = e.changedTouches[0].pageY;
      let direction = this.getDirection(this.startX, this.startY, endX, endY);
      switch (direction) {
        case 1:
          // 手指向上滑动，对应页面向下滚动
          this.goDown();
          break;
        case 2:
          // 手指向下滑动，对应页面向上滚动
          // 重新指定当前页面距视图顶部的距离 currentPosition，实现全屏滚动，currentPosition 为负值，越大表示超出顶部部分越少
          this.goUp();
          break;
        default:
      }
    });

    // 窗口尺寸变化时重置位置
    Utils.addHandler(window, 'resize', this.handleWindowResize.bind(this));
  }
}
