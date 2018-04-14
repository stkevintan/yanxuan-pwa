/**
 * @file entry
 * @author stkevintan(stkevintan@zju.edu.cn)
 */

import Vue from 'vue';
import Meta from 'vue-meta';

import { createRouter } from '@/.lavas/router';
import { createStore } from '@/.lavas/store';
import AppComponent from './App.vue';

Vue.use(Meta);
import VueLazyload from 'vue-lazyload';

// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/img/error.png',
  loading: '/static/img/loading.gif',
  attempt: 1,
  filter: {
    cdn(listener, options) {
      const el = listener.el;
      const url = listener.src.replace(
        'https://gbzhu.cn/mimg/',
        'https://ols1thqnl.qnssl.com/'
      );
      listener.src = url;
    },
    delQuery(listener) {
      listener.src = listener.src.replace(/\?.*$/, '');
    },
    qiniu(listener, options) {
      if (!/qnssl/.test(listener.src)) return;
      // imageMogr2/auto-orient/thumbnail/200x/format/png/blur/1x0/quality/75|imageslim
      const el = listener.el;
      url += '?imageMogr2';
      url += '/auto-orient';
      if (el.width) {
        url += `/thumbnail/${el.width}x`;
      }
      url += '/format/png';
      url += '/blur/1x0';
      url += '/quality/75|imageslim';
      listener.src = url;
    },
    local(listener, options) {
      if (/qnssl/.test(listener.src)) return;
      const el = listener.el;
      // console.log(url);
      url += '?quality=80';
      if (el.width) url += `&thumbnail=${el.width}x0`;
      listener.src = url;
    }
  }
});

Vue.config.productionTip = false;

export function createApp() {
  let router = createRouter();
  let store = createStore();
  let App = Vue.extend({
    router,
    store,
    ...AppComponent
  });
  return { App, router, store };
}

if (module.hot) {
  module.hot.accept();
}
