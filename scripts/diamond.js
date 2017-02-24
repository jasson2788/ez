/* global iNoBounce, _app, UTILS */

var DIAMOND = (function () {
    var _modules = {};
    var _controllers = {};

    var _app = (function () {
        var _variables = {};

        var _methods = {
            //=============================================================================================================================
            // initialize all modules that will be needed
            initModules: function (params) {
                if (!(params.modules_list instanceof Array) || params.modules_list.length === 0)
                    return;
                _variables.modules = [];
                for (var i in params.modules_list) {
                    var module = params.modules[params.modules_list[i]];
                    if (typeof module === 'function') {
                        _variables.modules[params.modules_list[i]] = new module();
                        _variables.modules[params.modules_list[i]].DIAMOND_APP = params.app;
                    }
                }
            },
            //=============================================================================================================================
            // initialize the current page based on the hash or the parameter
            initCurrentPage: function (params) {
                var hash = this.getCurrentHash();
                _variables.page = params.app.ifPageExists(hash) ? hash : params.app.default_page();
            },
            //=============================================================================================================================
            // initialize the browsing history of the app
            initBrowsingHistory: function (params) {
                if (UTILS.isDefined(params.app.module('history')))
                    params.app.module('history').init({
                        'back_steps': _variables.back_steps,
                        'next_steps': _variables.next_steps,
                        'pages': _variables.pages,
                        'page': params.page
                    });
            },
            //=============================================================================================================================
            // initialize the browsing history of the app
            initLoading: function (params) {
                if (UTILS.isDefined(params.app.module('loading')))
                    params.app.module('loading').init();
            },
            //=============================================================================================================================
            // initialize the inputs module
            initInputs: function (params) {
                if (UTILS.isDefined(params.app.module('inputs')))
                    params.app.module('inputs').init();
            },
            //=============================================================================================================================
            // initialize the controller
            initController: function (params) {
                var context = params.app;
                if (typeof params.controllers[params.controller] !== 'undefined') {
                    if (!UTILS.isDefined(_variables.controllers))
                        _variables.controllers = {};
                    document.getElementById(context.page()).style.display = 'block';
                    _variables.controllers[params.controller] = new params.controllers[params.controller];
                    _variables.controllers[params.controller].construct(context);
                    _variables.currentController = params.controller;
                }
            },
            //=============================================================================================================================
            // initialize the events of the app
            initEvents: function (params) {
                if (UTILS.isDefined(params.app.module('click')))
                    params.app.module('click').init(params);
            },
            //=============================================================================================================================
            // initialize all variables
            initVariables: function (params) {
                _variables.pages = params.pages;
                _variables.back_steps = params.back_steps;
                _variables.next_steps = params.next_steps;
                _variables.default_page = params.default_page;
            },
            //=============================================================================================================================
            // initialize templates if defined
            initTemplates: function (params) {
                if (!UTILS.isDefined(params) || !UTILS.isDefined(params.templates) || !UTILS.isDefined(params.app.module('templates')))
                    return;
                params.app.module('templates').init(params.templates);
            },
            //=============================================================================================================================
            // initialize scrollbar if defined
            initScrollbar: function (params) {
                if (!UTILS.isDefined(params.app.module('scrollbar')))
                    return;
                params.app.module('scrollbar').init();
            },
            //=============================================================================================================================
            // returns current hash
            getCurrentHash: function () {
                return UTILS.getHash(window.location.href);
            }
        };

        return {
            init: function (params, modules, controllers) {
                _methods.initVariables(params);
                _methods.initCurrentPage({app: this});
                _methods.initModules({modules_list: params.modules, app: this, modules: modules});
                _methods.initBrowsingHistory({page: this.page(), app: this});
                _methods.initController({controller: params.controller, app: this, controllers: controllers});
                _methods.initEvents({app: this, click: params.click});
                _methods.initTemplates({templates: params.templates, app: this});
                _methods.initScrollbar({app: this});
                _methods.initLoading({app: this});
                _methods.initInputs({app: this});

                UTILS.fixMobile();
                UTILS.fix();
            },
            //=============================================================================================================================
            // gets module
            module: function (module) {
                if (typeof _variables.modules[module] !== 'undefined')
                    return _variables.modules[module];
            },
            //=============================================================================================================================
            // goes back
            back: function (params) {
                if (UTILS.isDefined(params) && UTILS.isDefined(params.state))
                    _variables.state = params.state;
                var num = UTILS.isDefined(params) && UTILS.isDefined(params.num) ? params.num : -1;
                this.module('history').pop(num);
            },
            //=============================================================================================================================
            // gets or sets current state
            state: function (state) {
                if (UTILS.isDefined(state))
                    _variables.state = state;
                return _variables.state;
            },
            //=============================================================================================================================
            // gets controller
            get: function (controller) {
                return _variables.controllers[controller];
            },
            //=============================================================================================================================
            // gets current controller
            current: function () {
                return _variables.controllers[_variables.currentController];
            },
            //=============================================================================================================================
            // gets default page
            default_page: function () {
                return _variables.default_page;
            },
            //=============================================================================================================================
            // gets or sets current page
            page: function (page) {
                if (UTILS.isDefined(page))
                    _variables.page = page;
                return _variables.page;
            },
            //=============================================================================================================================
            // returns if app has page
            ifPageExists: function (page) {
                if (page === 'conversation')
                    return window.innerWidth < 920;
                return typeof _variables.pages[page] !== 'undefined';
            },
            //=============================================================================================================================
            // subscibes window to an event
            subscribe: function (event, callback) {
                $(window).on(event, callback);
            },
            //=============================================================================================================================
            // unsubscibes window from an event
            unsubscibe: function (event) {
                $(window).off(event);
            }
        };
    })();

    return {
        core: {
            app: function (params) {
                if (UTILS.isDefined(params)) {
                    $(window).on('load', function () {
                        _app.init(params, _modules, _controllers);
                    });
                } else
                    return _app;
            }
        },
        module: {
            create: function (module) {
                if (!UTILS.isDefined(module) || !UTILS.isNotNull(module.name))
                    throw new Error("Please specify a name");
                if (module.name in _modules)
                    throw new Error("This module already exists");
                _modules[module.name] = module.module;
            }
        },
        controller: {
            create: function (controller) {
                if (!UTILS.isDefined(controller) || !UTILS.isNotNull(controller.name))
                    throw new Error("Please specify a name");
                if (controller.name in _controllers)
                    throw new Error("This controller already exists");
                _controllers[controller.name] = controller.controller;
            }
        }
    };
})();
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: "history",
    module: function () {
        var _variables = {};
        var _methods = {
            //=============================================================================================================================
            // executes if exists the function associated with the back button in history
            back: function (app) {
                var hash = "";
                for (var i = 0; i < Math.abs(_variables.pop); i++)
                    hash = _variables.hashes.pop();
                var back = _variables.back_steps[hash];
                if (typeof back === 'function')
                    back(app);
            },
            //=============================================================================================================================
            // executes if exists the function associated with the next button in history
            next: function (app) {
                var params = UTILS.getParamsFromUrl(), hash = undefined;
                if (typeof params !== 'undefined') {
                    for (var prop in params) {
                        if (typeof _variables.next_steps["*?" + prop + "=" + params[prop]] !== 'undefined') {
                            hash = "*?" + prop + "=" + params[prop];
                            break;
                        }
                    }
                    _variables.hash = hash;
                } else
                    _variables.hash = UTILS.getHash(window.location.href);
                _variables.hashes.push(_variables.hash);
                var next = _variables.next_steps[_variables.hash];
                if (typeof next === 'function')
                    next(app, false);
            },
            //=============================================================================================================================
            // initialize the pop state event
            initPopState: function (params) {
                $(window).on('popstate', function (e) {
                    if (UTILS.isDefined(e.originalEvent.state)) {
                        if (_variables.id >= e.originalEvent.state.id)
                            _methods.back(params.app);
                        else
                            _methods.next(params.app);
                        _variables.id = e.originalEvent.state.id;
                    } else {
                        var hash = UTILS.getHash(window.location.href);
                        if (params.app.ifPageExists(hash) === true) {
                            params.app.module('transitions').changePage({to: hash, type: 'back'});
                            _variables.hashes.push(hash);
                        } else {
                            if (params.app.page() === params.app.default_page()) {
                                params.app.module('history').reset();
                                params.app.module('history').push(params.app.default_page());
                            } else
                                params.app.module('transitions').changePage({to: params.app.default_page()});
                        }
                        _variables.id++;
                    }
                });
            },
            //=============================================================================================================================
            // pushes the previous pages in the history
            initPreviousPages: function (params) {
                history.replaceState({id: _variables.cpt++}, null, "index.html#other");
                for (var i in params.pages[params.page])
                    params.context.push(params.pages[params.page][i]);
                params.context.push(params.page);
            },
            //=============================================================================================================================
            // initializes the variables
            initVariables: function (params) {
                var back_steps = UTILS.isDefined(_variables.back_steps) ? _variables.back_steps : UTILS.isDefined(params) ? UTILS.isDefined(params.back_steps) ? params.back_steps : null : null;
                var next_steps = UTILS.isDefined(_variables.next_steps) ? _variables.next_steps : UTILS.isDefined(params) ? UTILS.isDefined(params.next_steps) ? params.next_steps : null : null;
                _variables = {hashes: [], cpt: 0, i: 0, hash: "", pop: -1, back_steps: back_steps, next_steps: next_steps};
            }
        };

        return {
            //=============================================================================================================================
            // pushes a new entry to the browsing history
            push: function (hash_or_param) {
                if (hash_or_param.substr(0, 2) === '*?') {
                    _variables.id = _variables.cpt++;
                    history.pushState({id: _variables.id}, null, "#" + UTILS.getHash(window.location.href) + hash_or_param.substr(1, hash_or_param.length));
                    _variables.hashes.push(hash_or_param);
                } else if (_variables.hash !== hash_or_param) {
                    _variables.id = _variables.cpt++;
                    history.pushState({id: _variables.id}, null, "#" + hash_or_param);
                    _variables.hashes.push(hash_or_param);
                }
            },
            //=============================================================================================================================
            // pops an item from the browsing history
            pop: function (num) {
                _variables.pop = num || -1;
                history.go(_variables.pop);
            },
            //=============================================================================================================================
            // initalizes the brosing history
            init: function (obj) {
                _methods.initVariables({back_steps: obj.back_steps, next_steps: obj.next_steps});
                _methods.initPopState({app: this.DIAMOND_APP});
                _methods.initPreviousPages({context: this, pages: obj.pages, page: obj.page});
            },
            //=============================================================================================================================
            // resets the browsing history
            reset: function () {
                _methods.initVariables();
                history.replaceState({id: _variables.cpt++}, null, "index.html#other");
            }
        };
    }
});
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: "animation",
    module: function () {
        var _ANIMATION_END = "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd";
        var _SPEED = ".3";
        var _change_opacity_speed = function (params) {
            if (!UTILS.isDefined(params.speed) || _SPEED === params.speed)
                return;

            _SPEED = params.speed;
            document.getElementById('styles-opacity').innerHTML =
                    params.type === 'in' ? ".animateFadein {-webkit-animation: fadein " + _SPEED + "s linear; animation: fadein " + _SPEED + "s linear;}" :
                    params.type === 'out' ? ".animateFadeout {-webkit-animation: fadeout " + _SPEED + "s linear; animation: fadeout " + _SPEED + "s linear;}" : "";
        };

        return {
            //=============================================================================================================================
            // adds an animation to an an element
            // @obj element, @callbackbefore callback before the animation, @callbackend callback after the animation has ended
            addAnimation: function (obj) {
                if (typeof obj.callbackbefore === 'function')
                    obj.callbackbefore($(obj.obj));
                $(obj.obj).addClass(obj.class).on(_ANIMATION_END, function () {
                    $(obj.obj).removeClass(obj.class).off(_ANIMATION_END);
                    if (typeof obj.callbackend === 'function')
                        obj.callbackend($(obj.obj));
                });
            },
            //=============================================================================================================================
            // adds a css transform property to an element
            addTransform: function (params) {
                $(params.element).css('-webkit-transform', params.prop).css('transform', params.prop).css('ms-transform', params.prop);
            },
            //=============================================================================================================================
            // restarts the animation on an element
            restartAnimation: function (obj) {
                var elm = document.getElementById(obj);
                var newone = elm.cloneNode(true);
                elm.parentNode.replaceChild(newone, elm);
            },
            //=============================================================================================================================
            // fades in an element and calls a callback at the end of the animation
            fadeIn: function (params) {
                _change_opacity_speed({speed: params.speed, type: 'in'});
                this.addAnimation({obj: params.element, class: "animateFadein", callbackbefore: function (element) {
                        element.css('opacity', 0).css('visibility', 'visible').show();
                    }, callbackend: function (element) {
                        element.css('opacity', 1);
                        if (typeof params.callbackend === 'function')
                            params.callbackend();
                    }
                });
            },
            //=============================================================================================================================
            // fades out an element and calls a callback at the end of the animation
            fadeOut: function (params) {
                _change_opacity_speed({speed: params.speed, type: 'out'});
                this.addAnimation({obj: params.element, class: "animateFadeOut",
                    callbackend: function (element) {
                        element.css('opacity', 0).hide();
                        if (typeof params.callbackend === 'function')
                            params.callbackend();
                    }
                });
            }
        };
    }
});
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: 'inputs',
    module: function () {
        var _yesno = {element: null, dragged: false, x: 0};
        return {
            init: function () {
                var events = UTILS.events(), context = this;
                function __addAnim(params) {
                    if (params.type === 'on' || params.type === 'off') {
                        var type = params.type === 'off' ? 'on' : 'off', child = $(params.element).hasClass('diamond-onoff-circle') ? params.element : $(params.element).find('.diamond-onoff-circle');
                        params.context.DIAMOND_APP.module('animation').addAnimation({
                            obj: child,
                            class: 'diamond-' + type,
                            callbackend: function (element) {
                                if (type === 'on') {
                                    $(params.element).removeClass('off').addClass('on').data('value', 'on');
                                    context.DIAMOND_APP.module('animation').addTransform({element: child, prop: 'translate3d(30px,0px,0px)'});
                                } else if (type === 'off') {
                                    $(params.element).removeClass('on').addClass('off').data('value', 'off');
                                    context.DIAMOND_APP.module('animation').addTransform({element: child, prop: 'translate3d(0px,0px,0px)'});
                                }
                            }
                        });
                    }
                }

                function __x(e) {
                    var val = UTILS.getClientXY(e).x - _yesno.x;
                    return val < 0 ? 0 : val > 30 ? 30 : val;
                }

                function __ifClickable(e) {
                    var element = e.target;
                    if (e.type === events.start && element.className.indexOf('diamond-onoff-circle') !== -1) {
                        _yesno = {element: element, dragged: true, x: UTILS.getClientXY(e).x};
                    } else if (e.type === events.move && UTILS.isDefined(_yesno.element)) {
                        context.DIAMOND_APP.module('animation').addTransform({element: _yesno.element, prop: 'translate3d(' + __x(e) + 'px,0px,0px)'});
                    } else if (e.type === events.end) {
                        if (__x(e) < 15)
                            __addAnim({context: context, element: element, type: 'on'});
                        else
                            __addAnim({context: context, element: element, type: 'off'});
                        _yesno = {element: null, dragged: false, x: 0};
                    } else if (e.type === events.start && element.className.indexOf('diamond-onoff') !== -1) {
                        __addAnim({context: context, element: element, type: $(element).data('value')});
                    }
                }

                document.getElementById('clickable-body').addEventListener(events.start, __ifClickable);
                document.getElementById('clickable-body').addEventListener(events.move, __ifClickable);
                document.getElementById('clickable-body').addEventListener(events.end, __ifClickable);
            }
        };
    }
});
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: 'click',
    module: function () {
        var _target = {element: null, pressed: false};
        return {
            //=============================================================================================================================
            // initialize this module
            init: function (params) {
                var events = UTILS.events();
                function __compare(obj1, obj2) {
                    var max = UTILS.isTouch() ? 10 : 1;
                    return (~~obj1.x === ~~obj2.x || Math.abs(~~obj1.x - ~~obj2.x) < max) && (~~obj1.y === ~~obj2.y || Math.abs(~~obj1.y - ~~obj2.y) < max);
                }
                function __ifClickable(e) {
                    var element = e.target, max = 3;
                    for (var i = 0; i < max; i++) {
                        if (element.className.indexOf('clickable') !== -1) {
                            if (e.type === events.start)
                                _target = {element: element, pressed: true, xy: UTILS.getClientXY(e)};
                            else if (e.type === events.end) {
                                if (_target.pressed === true && _target.element === element && __compare(UTILS.getClientXY(e), _target.xy))
                                    params.click(element, params.app);
                            }
                            break;
                        }
                        element = element.parentElement;
                    }
                    if (e.type === events.end)
                        _target = {element: null, pressed: false};
                }

                document.getElementById('clickable-body').addEventListener(events.start, __ifClickable);
                document.getElementById('clickable-body').addEventListener(events.end, __ifClickable);
            }
        };
    }
});
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: "loading",
    module: function () {
        var _variables = {
            prevLoading: {1: null, 2: null}
        };
        var _methods = {
            interval: function () {
                return setInterval(function () {
                    var triangles = [1, 2, 3, 4, 5];
                    if (UTILS.isDefined(_variables.prevLoading["1"]))
                        delete triangles[_variables.prevLoading["1"]];
                    if (UTILS.isDefined(_variables.prevLoading["2"]))
                        delete triangles[_variables.prevLoading["2"]];
                    triangles.sort(function () {
                        return 0.5 - Math.random();
                    });
                    var props = {1: 'border-bottom-color', 2: 'border-top-color', 3: 'border-bottom-color', 4: 'border-right-color', 5: 'border-top-color'};
                    var color1 = $(_variables.id + " .matches-triangle" + triangles[0]).css(props[triangles[0]]), color2 = $(_variables.id + " .matches-triangle" + triangles[1]).css(props[triangles[1]]);
                    $(_variables.id + " .matches-triangle" + triangles[0]).css(props[triangles[0]], color2);
                    $(_variables.id + " .matches-triangle" + triangles[1]).css(props[triangles[1]], color1);

                    _variables.prevLoading["1"] = triangles[0];
                    _variables.prevLoading["2"] = triangles[1];
                }, 500);
            }
        };

        return {
            //=============================================================================================================================
            // starts loading animation on an element
            startLoading: function (params) {
                $(params.id).show().find('.matches-triangle-text').text(params.text);
                _variables.running = true;
                _variables.id = params.id;
                _loading = _methods.interval();
            },
            //=============================================================================================================================
            // stops loading animation 
            stopLoading: function (params) {
                if (UTILS.isDefined(params) && params.hide === true)
                    $(params.id).hide();
                clearInterval(_loading);
                _variables.running = false;
            },
            //=============================================================================================================================
            // initialize this module
            init: function () {
                $(window).on('blur', function () {
                    if (_variables.running === true)
                        clearInterval(_loading);
                }).on('focus', function () {
                    if (_variables.running === true)
                        _loading = _methods.interval();
                });
            }
        };
    }
});
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: "scrollbar",
    module: function () {
        var _scroll = null;
        var _width = null;
        var _getWidth = function (child) {
            if (!UTILS.isDefined(_width))
                _width = (child.prop('offsetWidth') - child.prop('clientWidth')) + "px";
            return _width;
        };

        return {
            init: function () {
                if (UTILS.isTouch())
                    return;

                $('.scrollbar').on('mousedown', function (e) {
                    var top = $(this).css('top');
                    _scroll = {scrollbar: $(this), parent: $(this).parent(), child: $(this).prev(), y: UTILS.getXY(e).y, scrollbar_top: Number(top.substring(0, top.length - 2))};
                });

                $(document).on('mousemove', function (e) {
                    if (UTILS.isDefined(_scroll)) {
                        var h_parent = $(_scroll.parent).height(), h_child = $(_scroll.child).prop('scrollHeight'), scroll = $(_scroll.scrollbar).height(), top_scrollbar = _scroll.scrollbar_top + UTILS.getXY(e).y - _scroll.y, add = h_child / (h_parent), child_top = 0;
                        top_scrollbar = top_scrollbar < 0 ? 0 : top_scrollbar > h_parent - scroll ? h_parent - scroll : top_scrollbar;
                        child_top = ~~(top_scrollbar * add) > h_child - h_parent ? h_child - h_parent : ~~(top_scrollbar * add);

                        $(_scroll.scrollbar).css('top', top_scrollbar + 'px');
                        $(_scroll.child).scrollTop(child_top);
                    }
                }).on('mouseup', function (e) {
                    if (UTILS.isDefined(_scroll)) {
                        if ($(_scroll.parent).has(e.target).length === 0)
                            $(_scroll.scrollbar).hide();
                        _scroll = null;
                    }
                });
            },
            addScrollBar: function (id) {
                if (UTILS.isTouch()) {
                    $(id).css('overflow-y', 'auto');
                    return;
                }

                $(id).append("<div class='scrollbar-container-element'></div><div class='scrollbar'></div>");
                var child = $(id).children().first(), scrollbar_width = _getWidth(child);
                if (scrollbar_width !== '0px')
                    child.css('padding-right', scrollbar_width).css('width', 'calc(100% + ' + scrollbar_width + ')');
                $(id).css('position', 'relative').on('mouseenter', function () {
                    var h_parent = $(id).height(), h_child = $(id).children().prop('scrollHeight'), h_scrollbar = ~~(h_parent * (h_parent / h_child));
                    if (h_scrollbar / h_parent !== 1)
                        $(this).find('.scrollbar').css('height', h_scrollbar + 'px').show();
                }).on('mouseleave', function () {
                    if (!UTILS.isDefined(_scroll))
                        $(this).find('.scrollbar').hide();
                }).children().first().on('scroll', function () {
                    var h_parent = $(id).height(), h_child = $(this).prop('scrollHeight'), scroll = $(this).scrollTop(), top_scrollbar = ~~(h_parent * (scroll / h_child)), max = h_parent - $(id).find('.scrollbar').height();
                    top_scrollbar = top_scrollbar === max - 1 ? top_scrollbar + 1 : top_scrollbar;
                    $(id).find('.scrollbar').css('top', top_scrollbar + 'px');
                });
            }
        };
    }
});
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: "templates",
    module: function () {
        var _methods = {
            _templates: {},
            _get: function (params) {
                var template = '', clone = null;
                if (UTILS.isDefined(params.params) && UTILS.isDefined(params.params.replaceTemplate))
                    var template = '#' + params.template + '-' + params.element.type, clone = $(template).clone();
                else
                    var template = '#' + params.template, clone = $(template).clone();

                if (UTILS.isDefined(params.element))
                    clone.attr('data-id', UTILS.escape(params.element.id)).attr('id', params.template + "-" + UTILS.escape(params.element.id));
                if (UTILS.isDefined(params.params) && UTILS.isDefined(params.params.dataobj) && params.params.dataobj === true)
                    clone.attr('data-obj', JSON.stringify(params.element));
                if (typeof this._templates[params.template] === 'function' && params.nofunc !== true)
                    this._templates[params.template](clone);
                for (var prop in params.element)
                    if (prop !== 'id') {
                        var element = clone.find(template + '-' + prop);
                        if (UTILS.isDefined(element)) {
                            if (element.is('img'))
                                element.attr('src', params.element[prop]).attr('id', null);
                            else
                                element.text(UTILS.escape(params.element[prop])).attr('id', null);
                        }
                    }
                return clone;
            },
            create: function (params) {
                if (!UTILS.isDefined(params) || !UTILS.isDefined(params.template) || !params.template in this._templates)
                    return;
                if (!UTILS.isDefined(params.append))
                    return this._get(params);
                else
                    $(params.append).append(this._get(params));
            },
            create_from_array: function (params) {
                var html = $(document.createDocumentFragment());
                for (var element in params.array)
                    html.append(this.create({element: params.array[element], template: params.template, params: params}));
                if (params.empty === true)
                    $(params.append).html("");
                $(params.append).append(html);
            },
            create_from_num: function (params) {
                var html = $(document.createDocumentFragment()), cpt = 0;
                for (var i = 0; i < params.num; i++)
                    html.append(this.create({template: params.template, element: {id: params.element.id + cpt++}}));
                $(params.append).append(html);
            }
        };

        return {
            call: function (params) {
                if (!UTILS.isDefined(params) || !UTILS.isDefined(params.method) || !params.method in _methods || params.method.substr(0, 1) === '_')
                    return;
                return _methods[params.method](params.params);
            },
            init: function (templates) {
                _methods._templates = templates;
            }
        };
    }
});
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: "menu",
    module: function () {
        var _finished = true;
        var _hide = function (element) {
            element.hide();
        };
        //=============================================================================================================================
        // changes history 
        var _change = function (params) {
            if (typeof params.skip === 'undefined')
                params.app.module('history').push('*?mr=open');
        };
        //=============================================================================================================================
        // changes opacity the overlay div
        var _m0 = function (element) {
            element.css('opacity', '0').show();
        };
        //=============================================================================================================================
        // changes opacity the overlay div
        var _m1 = function (element) {
            element.css('opacity', '1');
        };
        //=============================================================================================================================
        // transforms the menu div
        var _m2 = function (element) {
            element.css('-webkit-transform', 'translateX(120px)').css('transform', 'translateX(120px)').show();
        };
        //=============================================================================================================================
        // transforms the menu div
        var _m3 = function (element) {
            element.css('-webkit-transform', '').css('transform', '');
            _finished = true;
        };

        return {
            //=============================================================================================================================
            // toggles the menu
            menu: function (obj) {
                _finished = false;
                if (typeof obj === 'undefined') {
                    this.DIAMOND_APP.module('transitions').changePage({to: this.DIAMOND_APP.state()});
                    this.DIAMOND_APP.module('animation').addTransform({element: '.top-menu-right-menu .fa', prop: 'rotate(0deg)'});
                    this.DIAMOND_APP.module('animation').addAnimation({obj: "#menu-overlay", class: "animateFadeout", callbackend: _hide});
                    this.DIAMOND_APP.module('animation').addAnimation({obj: "#right-menu", class: "a-menuToRight", callbackend: _hide});
                    this.DIAMOND_APP.state("");
                } else {
                    _change({skip: obj.skip, app: this.DIAMOND_APP});
                    this.DIAMOND_APP.module('animation').addTransform({element: '.top-menu-right-menu .fa', prop: 'rotate(90deg)'});
                    this.DIAMOND_APP.module('animation').addAnimation({obj: "#menu-overlay", class: "animateFadein", callbackbefore: _m0, callbackend: _m1});
                    this.DIAMOND_APP.module('animation').addAnimation({obj: "#right-menu", class: "a-menuFromRight", callbackbefore: _m2, callbackend: _m3});
                }
            },
            //=============================================================================================================================
            // if menu animation is finished
            finished: function () {
                return _finished;
            }
        };
    }
});
//*****************************************************************************************************************************************************************************************************************************
DIAMOND.module.create({
    name: "transitions",
    module: function () {
        var _finish = {1: true, 2: true};
        var _methods = {
            //=============================================================================================================================
            // happens when anim is empty, but transition requested
            noAnim: function (params) {
                if (!UTILS.isDefined(params.anim)) {
                    var page = params.app.page();
                    params.app.page(params.to);
                    params.app.current().changeHTML(params.to);
                    params.app.current().afterPageChanges(page);
                    params.app.current().beforePageChanges(params.to);
                    $("#" + page).hide();
                    $("#" + params.to).show();
                    $('input').blur();

                    if (params.to === params.app.default_page()) {
                        params.app.module('history').reset();
                        params.app.module('history').push(params.to);
                    } else if (params.type !== 'back')
                        params.app.module('history').push(params.to);
                    return true;
                }
                return false;
            },
            //=============================================================================================================================
            // gets the css classes
            getAnim: function (anim) {
                var result = "";
                switch (anim) {
                    case 'slideLeft':
                        result = {first: 'pt-page-moveToLeft', last: 'pt-page-moveFromRight'};
                        break;
                    case 'slideRight':
                        result = {first: 'pt-page-moveToRight', last: 'pt-page-moveFromLeft'};
                        break;
                    case 'slideTop':
                        result = {first: '', last: 'pt-page-moveFromBottom'};
                        break;
                    case 'slideBottom':
                        result = {first: 'pt-page-moveFromTop', last: 'pt-page-fade-in'};
                        break;
                }
                return result;
            },
            //=============================================================================================================================
            // callback from page begin
            fromCallbackEnd: function (params) {
                params.element.hide();
                _finish[1] = true;
                if (typeof params.after === 'function')
                    params.after();
            },
            //=============================================================================================================================
            // callback before the animation from page end
            toCallbackBefore: function (params) {
                if (params.anim === 'slideLeft')
                    params.element.css('-webkit-transform', 'transflateX(100%)').css('transform', 'translateX(100%)').show();
                if (params.anim === 'slideRight')
                    params.element.css('-webkit-transform', 'translateX(-100%)').css('transform', 'translateX(-100%)').show();
                if (params.anim === 'slideTop')
                    params.element.css('-webkit-transform', 'translateY(100%)').css('transform', 'translateY(100%)').show();
                if (params.anim === 'slideBottom')
                    params.element.css('-webkit-transform', 'translateY(-100%)').css('transform', 'translateY(-100%)').show();
                params.app.current().changeHTML(params.to);
            },
            //=============================================================================================================================
            // callback after the animation from page end
            toCallbackEnd: function (params) {
                params.element.css('-webkit-transform', '').css('transform', '');
                _finish[2] = true;
                params.app.current().beforePageChanges(params.to);
                params.app.current().afterPageChanges(params.page);
            }
        };

        return {
            //=============================================================================================================================
            // transition the pages
            changePage: function (params) {
                var anim = _methods.getAnim(params.anim), page = this.DIAMOND_APP.page(), context = this;
                if (params.to === page || !this.DIAMOND_APP.ifPageExists(params.to) || (_finish[1] !== true || _finish[2] !== true) || _methods.noAnim({type: params.type, to: params.to, app: this.DIAMOND_APP, anim: params.anim}) === true)
                    return;
                $('input').blur();
                _finish = {1: false, 2: false};
                this.DIAMOND_APP.module('animation').addAnimation({obj: "#" + page, class: anim.first, callbackend: function (element) {
                        _methods.fromCallbackEnd({element: element, after: params.after});
                    }});
                this.DIAMOND_APP.module('animation').addAnimation({obj: "#" + params.to, class: anim.last, callbackbefore: function (element) {
                        _methods.toCallbackBefore({element: element, anim: params.anim, app: context.DIAMOND_APP, to: params.to});
                    }, callbackend: function (element) {
                        _methods.toCallbackEnd({element: element, to: params.to, page: page, app: context.DIAMOND_APP});
                    }});

                if (params.to === this.DIAMOND_APP.default_page()) {
                    this.DIAMOND_APP.module('history').reset();
                    this.DIAMOND_APP.module('history').push(params.to);
                } else if (params.type !== 'back')
                    this.DIAMOND_APP.module('history').push(params.to);
                $('body, html, #' + this.DIAMOND_APP.page(params.to)).scrollTop(0);
            },
            started: function () {
                return _finish[1] !== true || _finish[2] !== true;
            }
        };
    }
});
