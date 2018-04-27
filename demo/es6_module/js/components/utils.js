/**
 * Utils 为工具函数，对原生API做兼容性处理及提取公共方法
 */

export default {
  // 添加事件
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
      // 兼容火狐
      this.getWheelDelta = event => -event.detail;
      return -event.detail;
    }
  },
  // 截流函数
  throttle(method, context, event, delay) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
      method.call(context, event);
    }, delay);
  },
  // 间隔函数
  debounce(method, context, delay, immediate) {
    return function() {
      let args = arguments;
      let later = function() {
        method.tID = null;
        if (!immediate) {
          method.apply(context, args);
        }
      };
      let callNow = immediate && !method.tID;
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
