var pathname = window.location.pathname;
var hash = window.location.hash;

var skeletons = [
  { id: 'topbar', el: document.querySelector('#topbar') },
  { id: 'botbar', el: document.querySelector('#botbar') },
  { id: 'welcome', el: document.querySelector('#welcome') }
];
var pattern = [
  /\/(login|topic-detial|cate-list|product|category-commodity|pin)/i,
  /\/(home|topic|profile|manufacturer|category|search|cart|cart-format)/i,
  /^.*$/
];
function isMatched(reg, mode) {
  if ('hash' === mode) {
    return reg.test(hash.replace('#', ''));
  }
  if ('history' === mode) {
    return reg.test(pathname);
  }
};
function showSkeleton(id) {
  for (var o = 0; o < skeletons.length; o++) {
    var t = skeletons[o];
    if (id === t.id) {
      t.el.style = 'display:block;';
    } else {
      t.el.style = 'display:none;';
    }
  }
};
if (isMatched(pattern[0], 'history')) {
  showSkeleton('topbar');
} else if (isMatched(pattern[1], 'history')) {
  showSkeleton('botbar');
} else if (isMatched(pattern[2], 'history')) {
  showSkeleton('welcome');
} else {
  console.error('Url is invalid');
}


!(function(window) {
  'use strict';
  if (!window.loadCSS) {
    window.loadCSS = function () { };
  }

  function detectSupport() {
    var isSupport;
    try {
      isSupport = document.createElement('link').relList.support('preload');
    } catch (e) {
      isSupport = false;
    }
    return isSupport;
  }
  const support = detectSupport();
  relpreload = {
    bindMediaToggle(link) {
      const media = link.media || 'all';
      const setMedia = () => link.media = media;
      link.addEventListener('load', setMedia);
      setTimeout(() => {
        link.rel = 'stylesheet';
        link.media = 'only x';
      });
      setTimout(setMedia, 3000);
    },
    poly() {
      if (support) return;
      const links = document.getElementsByTagName('link');
      for (let i = 0; i < links.length; i++){
        const link = links[i];
        if (link.rel === 'preload' && link.getAttribute('as') === 'style' && !link.getAttribute('data-loadcss')) {
          link.setAttribute('data-loadcss', true);
          this.bindMediaToggle(link); 
        }
      }
    }
  };
  if (!support) {
    relpreload.poly();
    const tid = setInterval(() => relpreload.poly(), 500);
    window.addEventListener('load', () => {
      relpreload.poly();
      clearInterval(tid);
    })
  }

  var e = (loadCSS.relpreload = {});
  if (
    ((e.support = (function() {
      var e;
      try {
        e = window.document.createElement('link').relList.supports('preload');
      } catch (t) {
        e = !1;
      }
      return function() {
        return e;
      };
    })()),
    (e.bindMediaToggle = function(link) {
      function e() {
        link.media = a;
      }
      var a = link.media || 'all';
      link.addEventListener
        ? link.addEventListener('load', e)
        : link.attachEvent && link.attachEvent('onload', e),
        setTimeout(function() {
          (link.rel = 'stylesheet'), (link.media = 'only x');
        }),
        setTimeout(e, 3e3);
    }),
    (e.poly = function() {
      if (!e.support())
        for (
          var a = window.document.getElementsByTagName('link'), n = 0;
          n < a.length;
          n++
        ) {
          var o = a[n];
          'preload' !== o.rel ||
            'style' !== o.getAttribute('as') ||
            o.getAttribute('data-loadcss') ||
            (o.setAttribute('data-loadcss', !0), e.bindMediaToggle(o));
        }
    }),
    !e.support())
  ) {
    e.poly();
    var a = window.setInterval(e.poly, 500);
    window.addEventListener
      ? window.addEventListener('load', function() {
          e.poly(), window.clearInterval(a);
        })
      : window.attachEvent &&
        window.attachEvent('onload', function() {
          e.poly(), window.clearInterval(a);
        });
  }
  'undefined' != typeof exports
    ? (exports.loadCSS = loadCSS)
    : (window.loadCSS = loadCSS);
})('undefined' != typeof global ? global : this);