/**
 * 工具函数
 * 惰性载入函数降低了代码的可读性，如果不是频繁操作的项目，不引入惰性载入
 */
export default {
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
