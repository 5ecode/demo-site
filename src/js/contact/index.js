'use strict';
/*----------------------------------------------------------------------
@送信許可
----------------------------------------------------------------------*/
(function () {
  const stage = document.getElementById('contactForm'),
    agreeTarget = document.getElementById('agreeCheck'),
    submitBtn = document.getElementById('submitBtn'),
    requiredTarget = stage.querySelectorAll(':required'),
    param = {
      pattern: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/,
      check: false,
      errorColor : '#f00'
    };

  const func = {
    init: () => {
      func.checkRequired();
      func.checkAgree();
    },

    checkRequired: () => {
      for (var i = 0; i < requiredTarget.length; i++) {
        requiredTarget[i].addEventListener('blur', (e) => {
          const target = e.target;

          if (e.target.value !== '') {
            target.style.borderColor = '';
            if (target.type === 'email') {
              func.checkMail(target);
            }
          } else {
            target.style.borderColor = param.errorColor;
          }
          func.checkTotal();
        });
      }
    }, //checkRequired

    checkMail: (target) => {
      if (param.pattern.test(target.value)) {
        target.style.borderColor = ''
      } else {
        target.style.borderColor = param.errorColor;
      }
    }, //checkMail

    checkAgree: () => {
      agreeTarget.addEventListener('change', () => {
        if (agreeTarget.checked === true) {
          param.check = true;
        } else {
          param.check = false;
        }
        func.checkTotal();
      });
    }, //checkAgree

    checkTotal: () => {
      if (stage.checkValidity() && param.check) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    } //checkTotal
  }
  return func.init();
})();