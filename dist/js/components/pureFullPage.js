const Utils = {
  /**
   * 工具函数
   * 惰性载入函数降低了代码的可读性，如果不是频繁操作的项目，不引入惰性载入
   */
  // 删除 类名
  deleteClassName(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    }
  },
  // 将伪数组转化为数组
  transferToArray(obj) {
    return Array.prototype.slice.call(obj);
  },
  // 截流函数
  throttle(method, context, event, time) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
      method.call(context, event);
    }, time);
  },
  // 获取 viewport 尺寸
  getViewportDimension() {
    if (document.compatMode === 'BackCompat') {
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      };
    }
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  },
  /**
   * 兼容事件 begin
   */
  addHandler(element, type, handler) {
    if (element.addEventListener) {
      // 第一次调用初始化
      element.addEventListener(type, handler, false);

      // 第一次之后调用直接使用更改的函数，无返回值，不能使用箭头函数
      this.addHandler = function(element, type, handler) {
        element.addEventListener(type, handler, false);
      };
    } else if (element.attachEvent) {
      element.attachEvent(`on${type}`, handler);

      this.addHandler = function(element, type, handler) {
        element.attachEvent(`on${type}`, handler);
      };
    } else {
      element[`on${type}`] = handler;

      this.addHandler = function(element, type, handler) {
        element[`on${type}`] = handler;
      };
    }
  },
  removeHandler(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);

      this.removeHandler = function(element, type, handler) {
        element.removeEventListener(type, handler, false);
      };
    } else if (element.detachEvent) {
      element.detachEvent(`on${type}`, handler);

      this.removeHandler = function(element, type, handler) {
        element.detachEvent(`on${type}`, handler);
      };
    } else {
      element[`on${type}`] = null;
      this.removeHandler = function(element, type, handler) {
        element[`on${type}`] = null;
      };
    }
  },
  getEvent(event) {
    if (event) {
      // 第一次调用之后惰性载入
      this.getEvent = event => event;

      // 第一次调用使用
      return event;
    } else {
      this.getEvent = () => window.event;
      return window.event;
    }
  },
  // 鼠标滚轮事件
  getWheelDelta(event) {
    if (event.wheelDelta) {
      // 第一次调用之后惰性载入
      this.getWheelDelta = event => event.wheelDelta;

      // 第一次调用使用
      return event.wheelDelta;
    } else {
      this.getWheelDelta = event => -event.detail * 40;
      return -event.detail * 40;
    }
  },
};

/**
 * 全屏滚动逻辑
 */
class PureFullPage {
  constructor(el) {
    // 获取翻页容器
    this.main = document.querySelector(el);
    // 获取总页数，创建右侧点导航时用
    this.pagesNum = document.querySelectorAll('.page').length;
    // 初始化右侧点导航，以备后用
    this.navDots = [];
    // 获取当前视图高度
    this.viewHeight = Utils.getViewportDimension().height;
    // 当前位置，负值表示相对视图窗口顶部向下的偏移量
    this.currentPosition = 0;
    // 截流函数间隔时间，毫秒
    this.throttleTime = 150;
  }
  // 页面跳转
  turnPage(height) {
    this.main.style.top = height + 'px';
  }
  // 随页面滚动改变样式
  changeNavStyle(height) {
    this.navDots.forEach(el => {
      Utils.deleteClassName(el, 'active');
    });

    let i = -(height / this.viewHeight);
    this.navDots[i].classList.add('active');
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
        this.turnPage(this.currentPosition);

        // 更改样式
        this.navDots.forEach(el => {
          Utils.deleteClassName(el, 'active');
        });
        el.classList.add('active');
      });
    });
  }
  // 鼠标滚动逻辑（全屏滚动关键逻辑）
  scrollMouse(event) {
    event = Utils.getEvent(event);
    let delta = Utils.getWheelDelta(event);

    // 向下滚动，delta < 表示向下滚动，且只有页面底部还有内容时才能滚动
    if (
      delta < 0 &&
      this.main.offsetTop > -(this.viewHeight * (this.pagesNum - 1))
    ) {
      // 重新指定当前页面距视图顶部的距离 currentPosition，实现全屏滚动，currentPosition 为负值，越小表示超出顶部部分越多
      this.currentPosition = this.currentPosition - this.viewHeight;

      // 当 currentPosition =  -(this.viewHeight * (this.pagesNum - 1) 时，表示最后一个页面的顶部与视图顶部处在相同位置
      // 此时不允许继续向上滚动
      if (this.currentPosition < -(this.viewHeight * (this.pagesNum - 1))) {
        this.currentPosition = -(this.viewHeight * (this.pagesNum - 1));
      }

      this.turnPage(this.currentPosition);
      this.changeNavStyle(this.currentPosition);
    }

    // 向上滚动，delta > 0，且页面顶部还有内容时才能滚动
    if (delta > 0 && this.main.offsetTop < 0) {
      // 重新指定当前页面距视图顶部的距离 currentPosition，实现全屏滚动，currentPosition 为负值，越大表示超出顶部部分越少
      this.currentPosition = this.currentPosition + this.viewHeight;

      // 当 currentPosition = 0 时，表示第一个页面的顶部与视图顶部处在相同位置，此时不允许继续向上滚动
      if (this.currentPosition > 0) {
        this.currentPosition = 0;
      }

      this.turnPage(this.currentPosition);
      this.changeNavStyle(this.currentPosition);
    }
  }
  // 设置截流函数，注意绑定 this
  handleMouseWheel(event) {
    Utils.throttle(this.scrollMouse, this, event, this.throttleTime);
  }
  // 初始化函数
  init() {
    // 创建点式导航
    this.createNav();

    // 鼠标滚轮监听，注意绑定 this
    Utils.addHandler(document, 'mousewheel', this.handleMouseWheel.bind(this));
    Utils.addHandler(
      document,
      'DOMMouseScroll',
      this.handleMouseWheel.bind(this),
    );
  }
}
