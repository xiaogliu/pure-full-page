/**
 * utils 为工具函数，对原生API做兼容性处理及提取公共方法
 */
const utils = {
  // 鼠标滚轮事件
  getWheelDelta(event) {
    if (event.wheelDelta) {
      // 第一次调用之后惰性载入
      this.getWheelDelta = event => event.wheelDelta;

      // 第一次调用使用
      return event.wheelDelta;
    } else {
      // 兼容火狐
      this.getWheelDelta = event => -event.detail;
      return -event.detail;
    }
  },
  // 防抖动函数，method 回调函数，context 上下文，event 传入的时间，delay 延迟函数
  debounce(method, context, event, delay) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
      method.call(context, event);
    }, delay);
  },
  // 截流函数，method 回调函数，context 上下文，delay 延迟函数，
  // immediate 传入 true 表示在 delay 开始时执行回调函数
  throttle(method, context, delay, immediate) {
    return function() {
      const args = arguments;
      const later = function() {
        method.tID = null;
        if (!immediate) {
          method.apply(context, args);
        }
      };
      const callNow = immediate && !method.tID;
      clearTimeout(method.tID);
      method.tID = setTimeout(later, delay);
      if (callNow) {
        method.apply(context, args);
      }
    };
  },
  // 删除 类名
  deleteClassName(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    }
  },
  // polyfill Object.assign
  polyfill() {
    if (typeof Object.assign != 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {
          if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
          }
          let to = Object(target);
          for (let index = 1; index < arguments.length; index++) {
            let nextSource = arguments[index];
            if (nextSource != null) {
              for (let nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        },
        writable: true,
        configurable: true,
      });
    }
  },
};
