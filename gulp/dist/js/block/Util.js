"use strict";

;

(function (window) {
  // 工具函数
  window.util = {
    initSlideH: function initSlideH(obj, state, src, linkState) {
      // 轮播
      var _self = this;

      var obj = $(obj);
      var targetObj = state == "base" ? obj.find('.focus-inner .pic') : obj.find('ul');
      var controlObj = state == "base" && obj.find('.focus-control a');
      var prevObj = state != "base" && obj.find('.prev');
      var nextObj = state != "base" && obj.find('.next');
      var config = state == "base" ? {
        control: controlObj,
        prevBtn: false,
        nextBtn: false
      } : {
        control: false,
        prevBtn: prevObj,
        nextBtn: nextObj
      };
      return new Slide({
        target: targetObj,
        prevBtn: config.prevBtn,
        nextBtn: config.nextBtn,
        control: config.control,
        effect: state,
        autoPlay: false,
        merge: false,
        animateTime: 600,
        link: linkState,
        onchange: function onchange() {
          _self.replaceSrc(this.target[this.curPage], src);

          if (obj.attr('id') == 'JfocusPlst' && obj.find('.icon-qj')) {
            var iconQj = obj.find('.icon-qj');

            if (this.curPage == 3) {
              iconQj.addClass('hide');
            } else {
              iconQj.removeClass('hide');
            }
          }
        }
      });
    },
    initSlideV: function initSlideV(obj) {
      // 上下文字滚动
      var targetObj = $(obj).find('a');

      if (targetObj.length <= 1) {
        return;
      }

      return new Slide({
        target: targetObj,
        control: false,
        direction: 'y',
        effect: 'slide',
        height: 40,
        autoPlay: true,
        merge: true,
        animateTime: 500
      });
    },
    initSlideChange: function initSlideChange(obj, btn) {
      // 换一换
      if (!obj) return;

      var _self = this;

      _self.replaceSrc($(obj).get(0), "#src");

      _self.replaceSrc($(obj).get(0), "src1");

      new Slide({
        target: $(obj).find('ul'),
        nextBtn: $(btn),
        effect: 'base',
        control: false,
        autoPlay: false,
        onchange: function onchange() {
          _self.replaceSrc(this.target[this.curPage], "src1");
        }
      });
    },
    replaceSrc: function replaceSrc(obj, srcName) {
      //替换图片
      if (!obj) return;
      var imgArr = typeof obj.find == 'function' ? obj.find('img') : obj.getElementsByTagName('img');

      for (var i = 0; i < imgArr.length; i++) {
        var oimg = imgArr[i];
        var lazySrc = oimg.getAttribute(srcName);

        if (lazySrc) {
          oimg.src = lazySrc;
          oimg.removeAttribute(srcName);
        }
      }
    },
    rpSrcMerge: function rpSrcMerge(obj, srcName) {
      // 替换带有merge的轮播图
      var imgs = $("img", obj);
      if (!imgs) return;

      for (var i = 0, len = imgs.length; i < len; i++) {
        var img = $(imgs).eq(i);

        if ($(img).attr(srcName)) {
          var picUrl = $(img).attr(srcName);
          $(img).attr("src", picUrl);
        }
      }
    },
    initLazy: function initLazy(id, src) {
      // 懒加载
      Lazy.init(Lazy.create({
        lazyId: id,
        trueSrc: src,
        offset: 100,
        delay: 100,
        delay_tot: 1000
      }));
    },
    tabCtrl: function tabCtrl(target, ctrl, cls, fn) {
      // hover选项卡切换（延迟效果+回调）
      var _self = this;

      var target = $(target);
      var ctrls = $(ctrl);

      if (ctrls.attr('rel') == 'all') {
        fn && fn(target);
      } else {
        fn && fn(target.eq(0));

        _self.replaceSrc(target.eq(0), 'src1');
      }

      var timmer;
      ctrls.each(function (index, el) {
        ctrls.eq(index).bind('mouseover', function () {
          var $self = $(this);
          timmer = setTimeout(function () {
            var rel = $self.attr('rel');
            $self.addClass('current').siblings().removeClass('current');
            rel == 'all' ? target.removeClass('hide') : target.eq(index).removeClass(cls).siblings().addClass(cls); // 车型模块平行进口车显示

            target.eq(index).siblings('.con-px') && target.eq(index).removeClass(cls).siblings('.con-px').removeClass(cls);

            _self.replaceSrc(target.eq(index), 'src1');

            fn && fn(target.eq(index));
          }, 150);
        }).bind('mouseout', function (event) {
          clearTimeout(timmer);
        });
      });
    },
    clickCtrl: function clickCtrl(obj, cls) {
      // 单个点击切换
      $(obj).bind('click', function (event) {
        $(obj).toggleClass(cls);
        event.stopPropagation();
      });
    },
    hoverCtrl: function hoverCtrl(obj, cls) {
      // 单个hover切换（延迟）
      var timmer;
      $(obj).bind('mouseover', function (event) {
        clearTimeout(timmer);
        timmer = setTimeout(function () {
          $(obj).addClass(cls);
        }, 100);
      }).bind('mouseout', function (event) {
        clearTimeout(timmer);
        timmer = setTimeout(function () {
          $(obj).removeClass(cls);
        }, 200);
      });
    },
    toggleHover: function toggleHover(target, cls, type) {
      //多个元素hover切换 type==1时，有鼠标移出切换
      var target = $(target);
      target.each(function (index, el) {
        target.eq(index).bind('mouseover', function () {
          $(this).addClass(cls).siblings().removeClass(cls);
        });

        if (type && type == 1) {
          target.eq(index).bind('mouseout', function () {
            $(this).removeClass(cls);
          });
        }
      });
    },
    toggleCtrl: function toggleCtrl(target, ctrl, cls, fn) {
      // 点击选项卡切换（回调）
      var target = $(target);
      var ctrls = $(ctrl);
      ctrls.each(function (index, el) {
        ctrls.eq(index).bind('click', function (event) {
          event.stopPropagation();
          target.eq(index).parent().toggleClass(cls).siblings().removeClass(cls);
          fn && fn(target.eq(index), $(this));
        });
      });
    },
    typeTab: function typeTab(target, ctrl) {
      // 根据rel判断的选项卡切换 (无序，带延迟效果)
      var ctrls = $(ctrl);
      var cons = $(target);
      var timmer;
      ctrls.each(function (index, el) {
        ctrls.eq(index).bind('mouseover', function () {
          var $self = $(this);
          timmer = setTimeout(function () {
            var ctrlRel = $self.attr("rel");
            $self.addClass('current').siblings().removeClass('current');

            if (ctrlRel == "all") {
              // 全部
              cons.removeClass('hide');
            } else {
              // 其他
              cons.each(function (index, el) {
                var consRel = cons.eq(index).attr("rel");
                consRel == ctrlRel ? cons.eq(index).removeClass('hide') : cons.eq(index).addClass('hide');
                consRel == "px" && cons.eq(index).removeClass('hide'); // 平行进口车一直显示
              });
            }
          }, 150);
        }).bind('mouseout', function (event) {
          clearTimeout(timmer);
        });
      });
    },
    placeHolder: function placeHolder(obj) {
      // placeHolder模拟
      var inputObj = $(obj).find('input');
      if (!inputObj) return;
      inputObj.each(function (index, el) {
        inputObj.eq(index).bind('click', function () {
          var str = $(this).attr("data-str");
          var val = $(this).attr("value");
          val == str && $(this).attr('value', '').addClass('on');
        }).bind('blur', function () {
          var str = $(this).attr("data-str");
          var val = $(this).val();
          val == '' && $(this).attr('value', str).removeClass('on');
        });
      });
    },
    checkPhone: function checkPhone(obj, errObj) {
      // 验证手机号
      var reg = /^0{0,1}1[0-9]{10}$/,
          val = $(obj).val();

      if (val == "" || val == "请输入手机号码") {
        //为空
        $(errObj).removeClass('vhide');
        return false;
      } else if (!reg.test(val)) {
        //错误号码
        $(errObj).removeClass('vhide');
        return false;
      } else {
        $(errObj).addClass('vhide');
        return true;
      }
    },
    checkName: function checkName(obj, errObj) {
      // 验证姓名
      var reg = /^[A-Za-z\u4E00-\u9FA5]{1,20}$/,
          val = $(obj).val();

      if (val == "" || val == "请填写您的称呼") {
        //为空
        $(errObj).removeClass('vhide');
        return false;
      } else if (!reg.test(val)) {
        //错误
        $(errObj).removeClass('vhide');
        return false;
      } else {
        $(errObj).addClass('vhide');
        return true;
      }
    },
    showMore: function showMore(obj) {
      //展开更多
      var obj = $(obj);
      var parentNode = obj.parent();
      obj.bind('click', function (event) {
        parentNode.hasClass('show') ? parentNode.removeClass('show') : parentNode.addClass('show');
        event.stopPropagation();
      });
    },
    setMaskH: function setMaskH(id) {
      // 设置蒙层背景高度
      var bgElem = document.getElementById(id);
      if (window.XMLHttpRequest) return;

      var _scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

      bgElem.style.height = _scrollHeight + "px";
    },
    checkTime: function checkTime(n) {
      // 时间格式化
      if (n > 0) {
        if (n <= 9) {
          n = "0" + n;
        }

        return String(n);
      } else {
        return "00";
      }
    },
    getTime: function getTime(expiry, obj) {
      // 倒计时
      var _self = this;

      if (expiry == "" || !obj) return;
      var now = new Date();
      var expiry = expiry;
      var a = now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
      var b = expiry;
      var startTime = new Date(a);
      var endTime = new Date(b);

      if (endTime <= now) {
        obj.innerHTML = "<i class='red'>0</i>天<i class='red'>0</i>时<i class='red'>0</i>分";
      } else {
        var _getTime = function _getTime(expiry) {
          return function () {
            _self.getTime(expiry, obj);
          };
        };

        var days = (endTime - now) / 1000 / 60 / 60 / 24;

        var daysRound = _self.checkTime(Math.floor(days));

        var hours = (endTime - now) / 1000 / 60 / 60 - 24 * daysRound;

        var hoursRound = _self.checkTime(Math.floor(hours));

        var minutes = (endTime - now) / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;

        var minutesRound = _self.checkTime(Math.floor(minutes));

        var seconds = (endTime - now) / 1000 - 24 * 60 * 60 * daysRound - 60 * 60 * hoursRound - 60 * minutesRound;

        var secondsRound = _self.checkTime(Math.round(seconds));

        obj.innerHTML = "离报名结束还有<i class='red'>" + daysRound + "</i>天<i class='red'>" + hoursRound + "</i>时<i class='red'>" + minutesRound + "</i>分";
        newtime = window.setTimeout(_getTime(expiry, obj), 1000);
      }
    },
    showPop: function showPop(popObj) {
      // 显示弹层
      $(popObj).removeClass('hide');
      util.setMaskH("JbgMark");
      $('#JbgMark').removeClass('hide');
      $('body,html').css('overflow', 'hidden');
    },
    hidePop: function hidePop(popObj) {
      // 隐藏弹层
      $(popObj).addClass('hide');
      $('#JbgMark').addClass('hide');
      $('body,html').css('overflow', '');
    },
    beautySel: function beautySel(obj) {
      // 下拉框美化初始化
      $(obj).find('.bselect-wrapper').each(function (index, el) {
        $(this).beautySelect();
      });
      $(obj).find('select').beautySelect();
    }
  };
})(window);