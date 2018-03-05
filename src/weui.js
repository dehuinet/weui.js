/*
 * Tencent is pleased to support the open source community by making WeUI.js available.
 * 
 * Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
 * 
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * 
 *       http://opensource.org/licenses/MIT
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

import dialog from './dialog/dialog';
import alert from './alert/alert';
import confirm from './confirm/confirm';
import toast from './toast/toast';
import loading from './loading/loading';
import actionSheet from './actionSheet/actionSheet';
import topTips from './topTips/topTips';
import searchBar from './searchBar/searchBar';
import tab from './tab/tab';
import form from './form/form';
import uploader from './uploader/uploader';
import { picker, datePicker } from './picker/picker';
import gallery from './gallery/gallery';
import slider from './slider/slider';

export default {
    dialog,
    alert,
    confirm,
    toast,
    loading,
    actionSheet,
    topTips,
    searchBar,
    tab,
    form,
    uploader,
    picker,
    datePicker,
    gallery,
    slider,
};

//单独添加的侧滑栏组建
(function() {
    var $win = $(window);
    var scrollPos;
    var OffCanvas = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, OffCanvas.DEFAULTS, options);
        this.active = null;
        // this.bindEvents();
    };
    var UI = $.AMUI || {};
    var doc = window.document;

    UI.support = {};

    UI.support.transition = (function() {
        var transitionEnd = (function() {
            var element = doc.body || doc.documentElement;
            var transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
            };

            for (var name in transEndEventNames) {
                if (element.style[name] !== undefined) {
                    return transEndEventNames[name];
                }
            }
        })();

        return transitionEnd && { end: transitionEnd };
    })();
    OffCanvas.DEFAULTS = {
        duration: 300,
        effect: 'overlay' // {push|overlay}, push is too expensive
    };

    OffCanvas.prototype.open = function() {
        var _this = this;
        var $element = this.$element;

        if (!$element.length || $element.hasClass('weui-active')) {
            return;
        }

        var effect = this.options.effect;
        var $html = $('html');
        var $body = $('body');
        var $bar = $element.find('.weui-offcanvas-bar').first();
        var dir = $bar.hasClass('weui-offcanvas-bar-flip') ? -1 : 1;

        $bar.addClass('weui-offcanvas-bar-' + effect);

        scrollPos = { x: window.scrollX, y: window.scrollY };

        $element.addClass('weui-active');

        $body.css({
            width: window.innerWidth,
            height: $win.height()
        }).addClass('weui-offcanvas-page');

        if (effect !== 'overlay') {
            $body.css({
                'margin-left': $bar.outerWidth() * dir
            }).width(); // force redraw
        }

        $html.css('margin-top', scrollPos.y * -1);

        setTimeout(function() {
            $bar.addClass('weui-offcanvas-bar-active').width();
        }, 0);

        $element.trigger('open.offcanvas');

        this.active = 1;

        // Close OffCanvas when none content area clicked
        $element.on('click.offcanvas', function(e) {
            var $target = $(e.target);

            if ($target.hasClass('weui-offcanvas-bar')) {
                return;
            }

            if ($target.parents('.weui-offcanvas-bar').first().length) {
                return;
            }
            e.stopImmediatePropagation();

            _this.close();
        });

        $html.on('keydown.offcanvas', function(e) {
            (e.keyCode === 27) && _this.close();
        });
    };
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false;
        var $el = this;

        $(this).one(UI.support.transition.end, function() {
            called = true;
        });

        var callback = function() {
            if (!called) {
                $($el).trigger(UI.support.transition.end);
            }
            $el.transitionEndTimmer = undefined;
        };
        this.transitionEndTimmer = setTimeout(callback, duration);
        return this;
    };

    OffCanvas.prototype.close = function() {
        var _this = this;
        var $html = $('html');
        var $body = $('body');
        var $element = this.$element;
        var $bar = $element.find('.weui-offcanvas-bar').first();

        if (!$element.length || !this.active || !$element.hasClass('weui-active')) {
            return;
        }

        $element.trigger('close.offcanvas');

        function complete() {
            $body
                .removeClass('weui-offcanvas-page')
                .css({
                    width: '',
                    height: '',
                    'margin-left': '',
                    'margin-right': ''
                });
            $element.removeClass('weui-active');
            $bar.removeClass('weui-offcanvas-bar-active');
            $html.css('margin-top', '');
            window.scrollTo(scrollPos.x, scrollPos.y);
            $element.trigger('closed.offcanvas');
            _this.active = 0;
        }

        if (UI.support.transition) {
            setTimeout(function() {
                $bar.removeClass('weui-offcanvas-bar-active');
            }, 0);

            $body.css('margin-left', '').one(UI.support.transition.end, function() {
                complete();
            }).emulateTransitionEnd(this.options.duration);
        } else {
            complete();
        }

        $element.off('click.offcanvas');
        $html.off('.offcanvas');
    };


    function Plugin(option, relatedElement) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this);
            var data = $this.data('offcanvas');
            var options = $.extend({}, typeof option == 'object' && option);

            if (!data) {
                $this.data('offcanvas', (data = new OffCanvas(this, options)));
                (!option || typeof option == 'object') && data.open(relatedElement);
            }

            if (typeof option == 'string') {
                data[option] && data[option].apply(data, args);
            }
        });
    }

    $.fn.offCanvas = Plugin;
})();