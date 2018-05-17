/**
 * @file lavas config
 * @author stkevintan(stkevintan@zju.edu.cn)
 */

'use strict';

const path = require('path');
const BUILD_PATH = path.resolve(__dirname, 'dist');
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  build: {
    ssr: false,
    path: BUILD_PATH,
    publicPath: '/',
    ssrCopy: isDev
      ? []
      : [
        {
          src: 'server.prod.js'
        },
        {
          src: 'package.json'
        }
      ]
  },
  router: {
    mode: 'history',
    base: '/',
    pageTransition: {
      type: 'fade',
      transitionClass: 'fade'
    },
    routes: [
      {
        // set default router
        pattern: /\/(home|home\/recommend|pin\/commodity)$/,
        alias: '/'
      },
      {
        pattern: /\/home\/other/,
        chunkname: 'home-other'
      },
      {
        pattern: /\/topic/,
        chunkname: 'topic'
      },
      {
        pattern: /\/category/,
        chunkname: 'category'
      },
      {
        pattern: /\/format/,
        chunkname: 'format'
      },
      {
        pattern: /\/manufacturer/,
        chunkname: 'manufacturer'
      },
      {
        pattern: /\/pin/,
        chunkname: 'pin'
      },
      {
        pattern: /\/product/,
        chunkname: 'product'
      },
      {
        pattern: /\/cart/,
        chunkname: 'cart'
      },
      {
        pattern: /\/cart-format/,
        chunkname: 'cartFormat'
      },
      {
        pattern: /\/category-commodity/,
        chunkname: 'categoryCommodity'
      },
      {
        pattern: /\/comment/,
        chunkname: 'comment'
      },
      {
        pattern: /\/item-recommend/,
        chunkname: 'itemRecommend'
      },
      {
        pattern: /\/login/,
        chunkname: 'login'
      },
      {
        pattern: /\/manufacturer-list/,
        chunkname: 'manufacturerList'
      },
      {
        pattern: /\/new-item/,
        chunkname: 'newItem'
      },
      {
        pattern: /\/profile/,
        chunkname: 'profile'
      },
      {
        pattern: /\/search/,
        chunkname: 'search'
      },
      {
        pattern: /\/topic-detail/,
        chunkname: 'topicDetail'
      }
    ]
  },
  serviceWorker: {
    swSrc: path.join(__dirname, 'core/service-worker.js'),
    swDest: path.join(BUILD_PATH, 'service-worker.js'),
    // swPath: '/custom_path/', // specify custom serveice worker file's path, default is publicPath
    globDirectory: BUILD_PATH,
    globPatterns: ['**/*.{html,js,css,eot,svg,ttf,woff}'],
    globIgnores: ['sw-register.js', '**/*.map'],
    // appshellUrl: '/appshell',
    dontCacheBustUrlsMatching: /\.\w{8}\./
  },
  skeleton: {
    routes: [
      {
        path: /\/(login|topic-detial|cate-list|product|category-commodity|pin)/,
        componentPath: 'core/skeleton/topbar.vue'
      },
      {
        path: /\/(home|topic|profile|manufacturer|category|search|cart|cart-format)/,
        componentPath: 'core/skeleton/botbar.vue'
      },
      {
        path: '*',
        componentPath: 'core/skeleton/welcome.vue'
      }
    ]
  }
};
