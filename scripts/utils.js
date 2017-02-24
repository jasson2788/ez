var UTILS = {
    escape: function (unsafe) {
        return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    },
    convertJSONToString: function (json) {
        if (this.isDefined(json))
            return JSON.stringify(json).replace(/"/g, '&#34;').replace(/'/g, '&#45;');
    },
    convertStringToJSON: function (string) {
        if (this.isDefined(string))
            return JSON.parse(string.replace(/&#34;/g, '"').replace(/&#45;/g, '\''));
    },
    isDefined: function (param) {
        try {
            return typeof param !== 'undefined' && param !== null;
        } catch (Exception) {
            return false;
        }
    },
    isOriginNull: function () {
        return location.href.indexOf('file://') === -1;
    },
    isNotNull: function (param) {
        return this.isDefined(param) && param !== "";
    },
    isTouch: function () {
        return !!('ontouchstart' in window);
    },
    isIOS: function () {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
    iosVersion: function () {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
        return [];
    },
    isIE: function () {
        return navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1;
    },
    isAndroid: function () {
        return /(android)/i.test(navigator.userAgent);
    },
    isMobile: function () {
        return  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    click: function () {
        return this.isTouch() ? "tap" : "click";
    },
    onclick: function () {
        return this.isTouch() ? "ontouchend" : "onclick";
    },
    uuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    fixMobile: function () {
        //-- Fixes ios safari bounce effect but still keep the scrolling ability
        if (this.isIOS())
            iNoBounce.enable();
        //-- Fixes android that do not correctly scroll on input focus if not body element
        if (this.isAndroid()) {
            window.addEventListener("resize", function () {
                if (document.activeElement.tagName === "INPUT") {
                    window.setTimeout(function () {
                        document.activeElement.scrollIntoViewIfNeeded();
                    }, 0);
                }
            });
        }
        if (this.isIOS()) {
            $("input[type='search'], input[type='text']").on('touchend', function () {
                $(this).focus();
            });
        }

        //-- Fixes mobile keyboard open resize
        if (this.isMobile()) {
            $('body').addClass('mobile');
            var is_keyboard = false, initial_screen_size = window.innerHeight;
            window.addEventListener("resize", function () {
                is_keyboard = (window.innerHeight < initial_screen_size);
                if (is_keyboard)
                    $('body').removeClass('resize_ok');
                else
                    $('body').addClass('resize_ok');
            }, false);
        }
    },
    fix: function () {
        //-- Fixes autocomplete
        $("input[type='text']").attr('autocomplete', 'off');
    },
    loadScript: function (obj) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', obj.script);
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    obj.callback();
                }
            };
        } else {
            script.onload = function () {
                obj.callback();
            };
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    getHash: function (link) {
        if (link.indexOf('#') === -1 || link.length === 0)
            return "";
        var pager = document.createElement("a");
        pager.href = link;
        if (pager.hash.indexOf('?') === -1)
            return pager.hash.substring(1, pager.hash.length);
        else
            return  pager.hash.substring(1, pager.hash.indexOf('?'));
    },
    getParamsFromUrl: function () {
        var match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) {
                    return decodeURIComponent(s.replace(pl, " "));
                },
                query = window.location.href.substr(window.location.href.indexOf('?') + 1, window.location.href.length), urlParams = {};
        if (window.location.href.indexOf('?') === -1)
            return undefined;
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    },
    isNumber: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    random: function () {
        return Math.floor(Math.random() * 2);
    },
    randomMinMax: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    call: function (callback) {
        if (this.isDefined(callback) && typeof callback === 'function')
            callback();
    },
    wait: function (params) {
        setTimeout(params.callback, params.timeout);
    },
    hasElements: function (array) {
        return this.isDefined(array) && array instanceof Array && array.length > 0;
    },
    //========================================================================================================================================================
    //* returns x and y from mouse or touch event
    getXY: function (e) {
        var r = e;
        if (UTILS.isTouch())
            r = e.touches[0] || e.changedTouches[0];
        return {x: r.pageX, y: r.pageY};
    },
    getClientXY: function (e) {
        var r = e;
        if (UTILS.isTouch())
            r = e.touches[0] || e.changedTouches[0];
        return {x: r.clientX, y: r.clientY};
    },
    getOffsetXY: function (e) {
        var r = e;
        if (UTILS.isTouch())
            r = e.touches[0] || e.changedTouches[0];
        return {x: r.offsetX, y: r.offsetY};
    },
    events: function () {
        return {start: UTILS.isTouch() === true ? 'touchstart' : 'mousedown', end: UTILS.isTouch() === true ? 'touchend' : 'mouseup', move: UTILS.isTouch() === true ? 'touchmove' : 'mousemove'};
    },
    ifIE: function (v) {
        return RegExp('msie' + (!isNaN(v) ? ('\\s' + v) : ''), 'i').test(navigator.userAgent);
    },
    getTransform: function () {
        if (navigator.userAgent.indexOf("Safari") !== -1)
            return "WebkitTransform";
        else if(ifIE(10) || ifIE(9)) 
            return "msTransform";
        else 
            return "transform";

    }
};

