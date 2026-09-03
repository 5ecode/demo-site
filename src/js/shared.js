"use strict";
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
    window.addEventListener("resize", function () {
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
  const target = document.getElementById("Header"),
    trigger = target.querySelector('[data-menu="trigger"]'),
    logo = target.querySelector("[data-header-logo]"),
    board = document.getElementById("menuBoard"),
    menuElms = target.querySelectorAll('[data-menu="board"]'),
    focusTargetElms = target.querySelectorAll("[data-menu]"),
    param = {
      activeClass: "is-active",
      fixedClass: "is-fixed",
      modalBody: "u-isModalBody",
    };

  const func = {
    init: () => {
      func.setTabIndex(false);
      func.triggerEvent();
      var responsive = new ResizeManager(func.resize);
      responsive.resize();
    }, //init

    // [setTabIndex プロパティ切替]
    setTabIndex: (active) => {
      menuElms.forEach((item) => {
        if (active) {
          logo.tabIndex = -1;
          if (item.getAttribute("href") !== "#") {
            item.tabIndex = 0;
          }
        } else {
          item.tabIndex = -1;
          logo.tabIndex = 0;
        }
      });
    },

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
    triggerEvent: () => {
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
      document.getElementsByTagName("html")[0].classList.add(param.fixedClass);
      func.setTabIndex(true);
      func.focus(true);
    }, //menuOpen

    // [menuClose メニューを閉じる]
    menuClose: () => {
      target.classList.remove(param.activeClass);
      setTimeout(() => {
        func.adjustScreen(false);
        document
          .getElementsByTagName("html")[0]
          .classList.remove(param.fixedClass);
      }, 80);
      func.setTabIndex(false);
      func.focus(false);
    }, //menuClose

    focus: (status) => {
      //メニューボードを開いたときはフォーカスを循環
      document.addEventListener("keydown", (e) => {
        if (status) {
          const activeEl = document.activeElement;
          const firstEl = focusTargetElms[0];
          const lastEl = focusTargetElms[focusTargetElms.length - 1];

          //タブキーが押されたか
          const tabKey = 9 === e.keyCode;
          //シフトキーが押されたか
          const shiftKey = e.shiftKey;
          //Escapeキーが押されたか
          const escKey = 27 === e.keyCode;

          //最後の要素でタブキーが押された場合、最初の要素にフォーカスを当てる
          if (!shiftKey && tabKey && lastEl === activeEl) {
            e.preventDefault();
            firstEl.focus();
          }
          //最初の要素でタブキー+シフトキーが押された場合、最後の要素にフォーカスを当てる
          if (shiftKey && tabKey && firstEl === activeEl) {
            e.preventDefault();
            lastEl.focus();
          }

          // Escapeキーで閉じる
          if (escKey) {
            func.menuClose();
            firstEl.focus();
          }
        }
      });
    },

    // [resize リサイズ]
    resize: () => {
      func.menuClose();
    }, //resize
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
      threshold: 0,
    },
    param = {
      showclass: "is-show",
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
  };
  return func.init();
})();
