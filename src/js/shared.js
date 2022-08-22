'use strict';
/*----------------------------------------------------------------------
@ResizeManager : リサイズ
----------------------------------------------------------------------*/
class ResizeManager {
  constructor(action, time) {
    this.action = action;
    this.time = time ? 100 : time;
  }

  resize() {
    let timer,
      lastInnerWidth = window.innerWidth,
      _this = this;
    window.addEventListener('resize', function () {
      if (lastInnerWidth != window.innerWidth) {
        if (timer) return;
        timer = setTimeout(function () {
          timer = 0;
          _this.action();
        }, _this.time);
        lastInnerWidth = window.innerWidth;
      }
    });
  }
}

/*----------------------------------------------------------------------
@gNavToggle : グローバルメニュー
----------------------------------------------------------------------*/
const gNavToggle = (() => {
  const target = document.getElementById('Header'),
  trigger = document.getElementById('menuTrigger'),
  board = document.getElementById('menuBoard'),
  param = {
    activeClass: 'is-active',
    fixedClass : 'is-fixed',
    modalBody : 'u-isModalBody'
  };

  const func = {
    init: () => {
      func.triggerEvent();
      var responsive = new ResizeManager(func.resize);
      responsive.resize();
    }, //init

    adjustScreen: (fixed) => {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      if (fixed) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        trigger.style.marginRight = `${scrollbarWidth}px`;
      } else {
        document.body.style = "";
        trigger.style.marginRight = "";
      }
    }, //adjustScreen

    // [triggerEvent トリガーイベント]
    triggerEvent : () => {
      document.body.onclick = (e) => {
        param.state = target.classList.contains(param.activeClass);
        if (e.target === trigger) {
          if (param.state) {
            func.menuClose();
          } else {
            func.menuOpen();
          }
        } else if (e.target != board) {
          if (param.state) {
            func.menuClose();
          }
        }
      };
    }, //triggerEvent

    // [menuOpen メニューを開く]
    menuOpen: () => {
      func.adjustScreen(true);
      target.classList.add(param.activeClass);
      document.getElementsByTagName('html')[0].classList.add(param.fixedClass);
    }, //menuOpen


    // [menuClose メニューを閉じる]
    menuClose : () => {
      target.classList.remove(param.activeClass);
      setTimeout(() => {
        func.adjustScreen(false);
        document.getElementsByTagName('html')[0].classList.remove(param.fixedClass);
      },80)
    }, //menuClose

    // [resize リサイズ]
    resize : () => {
      func.menuClose();
    } //resize
  };
  return func.init();
})();

/*----------------------------------------------------------------------
@scrollAnimation : スクロールアニメーション
----------------------------------------------------------------------*/
const scrollAnimation = (() => {
  const targets = document.querySelectorAll(".u-appear"),
        options = {
          root: null,
          rootMargin: "-30% 0px",
          threshold: 0
        },
        param = {
          showclass: 'is-show'
        };
  const func = {
    init: function () {
      const observer = new IntersectionObserver(func.callback, options);
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        observer.observe(target);
      }
    }, //init

    // [callback コールバック]
    callback: function (entries, object) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        let cont = entry.target;
        cont.classList.add(param.showclass);
        object.unobserve(cont);
      });
    }, //callback
  }
  return func.init();
})();