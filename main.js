import App from './App';
import _ from 'lodash';
import dayjs from 'dayjs';
import dictRequest from 'common/dict.js';

/**
 * 用于初始化字典，返回Promise实例
 * @param  {...any} type 字典类型列表
 */
const dictInit = (...type) => {
  const allPromise = type.map((item) => {
    return new Promise((resolve) => {
		dictRequest(item).then((value) => {
		    resolve(value);
		}).catch((error)=>console.debug(error));
    });
  });
  return Promise.all(allPromise);
};

Vue.prototype._ = _;
Vue.prototype.dayjs = dayjs;
Vue.prototype.dictInit = dictInit;

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false;
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif