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
    }
    // 兼容火狐
    this.getWheelDelta = event => -event.detail;
    return -event.detail;
  },
  // 截流函数，method 回调函数，context 上下文，delay 延迟函数，
  // 返回的是一个函数
  throttle(method, context, delay) {
    let wait = false;
    return function(...args) {
      if (!wait) {
        method.apply(context, args);
        wait = true;
        setTimeout(() => {
          wait = false;
        }, delay);
      }
    };
  },
  // 删除 类名
  deleteClassName(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    }
  },
  // debounce function also can resolve magic mouse continuous trigger
  // from underscore library
  debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
      const last = new Date().getTime() - timestamp;
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout)
            context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = new Date().getTime();
      const callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    };
  },
  // polyfill Object.assign
  polyfill() {
    if (typeof Object.assign !== 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target) {
          if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
          }
          const to = Object(target);
          for (let index = 1; index < arguments.length; index++) {
            const nextSource = arguments[index];
            if (nextSource != null) {
              for (const nextKey in nextSource) {
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
