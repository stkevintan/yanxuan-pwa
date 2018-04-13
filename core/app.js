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
    resize(listener, options) {
      const el = listener.el;
      let url = listener.src.replace(/\?.*$/, '');
      // console.log(url);
      url += '?quality=80';
      if (el.width || el.height) url += `&thumbnail=${el.width}x0`;
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
