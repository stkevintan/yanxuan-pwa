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

function canUseWebP() {
  var elem = document.createElement('canvas');

  if (!!(elem.getContext && elem.getContext('2d'))) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
  } else {
    // very old browser like IE 8, canvas not supported
    return false;
  }
}
const useWebp = canUseWebP();
// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://ols1thqnl.qnssl.com/error.png',
  loading: 'https://ols1thqnl.qnssl.com/loading.svg',
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
      let url = listener.src;
      url += '?imageMogr2';
      url += '/auto-orient';
      if (el.width) {
        url += `/thumbnail/${el.width}x`;
      }
      url += `/format/${useWebp ? 'webp' : 'png'}`;
      url += '/blur/1x0';
      url += '/quality/75|imageslim';
      listener.src = url;
    },
    local(listener, options) {
      if (/qnssl/.test(listener.src)) return;
      const el = listener.el;
      let url = listener.src;
      url += '?quality=75';
      if (el.width) url += `&thumbnail=${el.width}x0`;
      url += `&format=${useWebp? 'webp': 'png'}`
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
