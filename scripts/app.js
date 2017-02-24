/* global APP, UTILS, App, TEMPLATES, Hammer, Repository, EASY_API, MATCHES_CANVAS, DIAMOND, MATCHES_ALL_CANVAS */

DIAMOND.core.app({
    name: 'EazyMatches',
    controller: 'Match',
    default_page: 'messages',
    modules: ['menu', 'loading', 'animation', 'history', 'transitions', 'templates', 'scrollbar', 'click', 'inputs'],
    //=============================================================================================================================
    // pages that go before
    pages: {
        'messages': [],
        'matches': ['messages'],
        'conversation': ['messages'],
        'settings': ['messages']
    },
    //=============================================================================================================================
    // will be executed on back button press
    back_steps: {
        '*?mr=open': function (app) {
            app.module('menu').menu();
        },
        'conversation': function (app) {
            app.get('Match').back('conversation');
        },
        'matches': function (app) {
            app.get('Match').back('matches');
        },
        'settings': function (app) {
            app.get('Match').back('settings');
        }
    },
    //=============================================================================================================================
    // will be executed on next button press
    next_steps: {
        '*?mr=open': function (app) {
            app.module('menu').menu({direction: 'right', skip: true});
        }
    },
    click: function (element, app) {
        if (app.module('transitions').started())
            return;

        if ($(element).hasClass('clickable'))
            $.event.trigger({type: "clickable", message: $(element)});
        if ($(element).attr('id') === 'menu-overlay' && app.module('menu').finished() === true)
            app.back();
        if ($(element).hasClass('top-menu-prev'))
            app.back();
        if ($(element).hasClass('top-menu-right-menu'))
            app.module('menu').menu({direction: 'right'});
    },
    templates: {
        'templates-iframe': function (obj) {
            $(obj).attr('src', 'image.html');
        }
    }
});

DIAMOND.controller.create({
    name: 'Match',
    controller: function () {
        var _magic = {MATCHES_QTY: 5};
        var _variables = {};

        var _context = {
            //=============================================================================================================================
            // this function joins the clicked element with a function by element class
            bindClickableClasses: function (e, context) {
                if (e.message.hasClass('right-menu-btn'))
                    _context.app.back({state: e.message.data('goto')});
                if (e.message.hasClass('templates-match-message') && window.innerWidth < 920)
                    context.next('conversation');
            },
            //=============================================================================================================================
            // this function joins the clicked element with a function by element id
            bindClickableID: function (e, context) {
                switch (e.message.attr('id')) {
                    case 'matches-step2-matches-btn1':
                        context.no();
                        break;
                    case 'matches-step2-matches-btn2':
                        context.yes();
                        break;
                }
            }
        };

        return {
            //=============================================================================================================================
            // this function triggers when the user says yes to antoher user
            yes: function () {
                MATCHES_CANVAS.animate({anim: 'right'});
            },
            //=============================================================================================================================
            // this function triggers when the user says no to antoher user
            no: function () {
                MATCHES_CANVAS.animate({anim: 'left'});
            },
            //=============================================================================================================================
            // this function initialize the matches container
            matches: function () {
                if (_context.loadIframes !== _magic.MATCHES_QTY || _variables.matches_init === true)
                    return;

                _context.app.module('loading').startLoading({id: '#templates-loading-matches-ll'});

                EASY_API.call({method: 'get_matches', params: {num: _magic.MATCHES_QTY, callback: __matches}});

                function __fade_buttons() {
                    _context.app.module('animation').fadeIn({element: $('#matches-step2-matches-btn1')});
                    _context.app.module('animation').fadeIn({element: $('#matches-step2-matches-btn2')});
                }

                function __matches(matches) {
                    _context.app.module('loading').stopLoading({id: '#templates-loading-matches-ll'});
                    MATCHES_CANVAS.init({data: matches, callback: __fade_buttons});
                    _variables.matches_init = true;
                }
            },
            //=============================================================================================================================
            // changes some html, adds templates, etc...
            changeHTML: function (page) {
                page = page || _context.app.page();
                if (!UTILS.isDefined(_variables.pages_html_init))
                    _variables.pages_html_init = {};
                if (page in _variables.pages_html_init && _variables.pages_html_init[page] === true)
                    return;

                switch (page) {
                    case 'messages':
                        _context.app.module('scrollbar').addScrollBar("#matches-all-container-messages-container-container");
                        _context.app.module('scrollbar').addScrollBar("#matches-all-container-message-message-container");
                        _context.app.module('templates').call({method: 'create', params: {append: '#messages', template: 'templates-loading', element: {text: 'loading your buddies', id: 'matches-all-loading'}}});
                        break;
                    case 'conversation':
                        _context.app.module('scrollbar').addScrollBar("#conversation-container");
                        _context.app.module('templates').call({method: 'create', params: {append: '#conversation', template: 'templates-loading', element: {text: 'loading conversation', id: 'conversation-loading'}}});
                        this.getComments(page);
                        break;
                    case 'matches':
                        _context.app.module('templates').call({method: 'create', params: {append: '#matches', template: 'templates-loading', element: {text: 'loading your matches', id: 'matches-ll'}}});
                        break;
                }

                _variables.pages_html_init[page] = true;
            },
            //=============================================================================================================================
            // add resize event to window
            addResize: function () {
                $(window).on('resize', function () {
                    if (_context.app.page() === 'conversation' && window.innerWidth >= 920)
                        _context.app.module('transitions').changePage({to: 'messages'});
                });
            },
            //=============================================================================================================================
            // this function initialize this controller by binding clickable events, etc...
            construct: function (app) {
                _context.app = app;

                this.changeHTML();
                this.loadIframes();
                this.bindClickable();
                this.beforePageChanges();
                this.fixCalc();
                this.addResize();
            },
            //=============================================================================================================================
            // this function loads five iframes then launches matches
            loadIframes: function () {
                _context.loadIframes = 0;
                if (UTILS.isOriginNull()) {
                    var context = this;
                    _context.app.module('templates').call({method: 'create_from_num', params: {num: _magic.MATCHES_QTY, template: 'templates-iframe', element: {id: "matches-step2-matches-container-iframe"}, append: '#matches-step2-matches-container-canvas'}});
                    $(window).on("message", function (e) {
                        if (e.originalEvent.data === 'loadIframes')
                            _context.loadIframes++;
                        if (_context.loadIframes === _magic.MATCHES_QTY) {
                            $(window).off("message");
                            if (_context.app.page() === 'matches')
                                context.matches();
                        }
                    });
                } else
                    _context.loadIframes = _magic.MATCHES_QTY;
            },
            //=============================================================================================================================
            // this function is executed by context.app.changePage() on the page that is shown.
            beforePageChanges: function (page) {
                page = page || _context.app.page();
                switch (page) {
                    case 'messages':
                        this.matchesAll();
                        break;
                    case 'conversation':
                        break;
                    case 'matches':
                        this.matches();
                        break;
                }
            },
            //=============================================================================================================================
            // this function is executed by context.app.changePage() on the page that is hidden.
            afterPageChanges: function (page) {
                page = page || _context.app.page();
                switch (page) {
                    case 'matches':
                        MATCHES_CANVAS.events('off');
                        break;
                }
            },
            //=============================================================================================================================
            // this function triggers when the user requests history.forward();
            next: function (step) {
                _context.app.module('transitions').changePage({to: step});
            },
            //=============================================================================================================================
            // this function triggers when the user requests history.back();
            back: function (step) {
                switch (step) {
                    case 'conversation':
                        _context.app.module('transitions').changePage({to: 'messages', 'type': 'back'});
                        break;
                    case 'matches':
                        _context.app.module('transitions').changePage({to: 'messages', 'type': 'back'});
                        break;
                    case 'settings':
                        _context.app.module('transitions').changePage({to: 'messages', 'type': 'back'});
                        break;
                }
            },
            //=============================================================================================================================
            // this function initialize the matches-all page
            matchesAll: function () {
                if (_variables.matches_all_init === true)
                    return;

                function __fade_out(matches) {
                    if (matches.length > 0) {
                        var append = UTILS.isTouch() ? '#matches-all-container-messages-container-container' : $('#matches-all-container-messages-container-container').children().first();
                        _context.app.module('templates').call({method: 'create_from_array', params: {append: append, array: matches, template: 'templates-match', empty: true, replaceTemplate: true}});
                        if ($("#matches-all-container-messages-container-container-container").prop('scrollHeight') < $(append).prop('scrollHeight'))
                            $('#matches-all-container-messages-container-container').addClass('last-element-hidden');
                    } else {
                        $('#matches-all-container-matches-container').hide();
                        $('#matches-all-container-message-container').hide();
                        $('#matches-all-container-empty').show();
                    }
                    _context.app.module('loading').stopLoading({id: '#templates-loading-matches-all-loading'});
                    _context.app.module('animation').fadeOut({element: '#templates-loading-matches-all-loading', callbackend: function () {
                            _context.app.module('animation').fadeIn({element: '#matches-all-container'});
                        }});

                    _variables.matches_all_init = true;
                }

                _context.app.module('loading').startLoading({id: '#templates-loading-matches-all-loading'});
                EASY_API.call({method: 'get_my_matches', params: {callback: __fade_out}});
                this.getComments();
            },
            //=============================================================================================================================
            // gets comments by id
            getComments: function (page) {
                page = page || _context.app.page();
                var loading = page === 'messages' ? '#templates-loading-matches-all-messages-loading' : '#templates-loading-conversation-loading';
                if (page === 'messages') {
                    $('#matches-all-container-message-empty-user').hide();
                    $('#matches-all-container-message-c').hide();
                    $('#matches-all-container-message-container-btn').show();
                    $('#matches-all-container-message-message').html("");
                    if (!$(loading).length)
                        _context.app.module('templates').call({method: 'create', params: {append: '#matches-all-container-message-container', template: 'templates-loading', element: {text: 'loading conversation', id: 'matches-all-messages-loading'}}});
                    _context.app.module('loading').startLoading({id: loading});
                } else if (page === 'conversation') {
                    $('#conversation-container-content').html("");
                    $('#conversation-page').hide();
                    _context.app.module('loading').startLoading({id: loading});
                }

                function __comments(comments) {
                    var append = UTILS.isTouch() ? "#matches-all-container-message-message-container" : page === 'messages' ? $('#matches-all-container-message-message-container').children().first() : '#conversation-container-content', fadeIn = _context.app.page() === 'messages' ? '#matches-all-container-message-c' : '#conversation-page';
                    if (comments.length > 0) {
                        _context.app.module('templates').call({method: 'create_from_array', params: {append: append, array: comments, template: 'templates-message', replaceTemplate: true}});
                    } else {
                        if (page === 'messages') {
                            $('#matches-all-container-message-empty').show();
                            $('#matches-all-container-message-message-container').css('visibility', 'hidden');
                        } else if (page === 'conversation') {
                            $('#conversation-container-content').hide();
                            $('#conversation-container-empty').show();
                        }
                    }

                    _context.app.module('loading').stopLoading({id: loading});
                    _context.app.module('animation').fadeOut({element: loading, callbackend: function () {
                            _context.app.module('animation').fadeIn({element: fadeIn});
                        }});
                }

                EASY_API.call({method: 'get_comment_by_id', params: {callback: __comments}});
            },
            //=============================================================================================================================
            // this function joins the clicked element with a function
            bindClickable: function () {
                var context = this;
                _context.app.subscribe('clickable', function (e) {
                    _context.bindClickableID(e, context);
                    _context.bindClickableClasses(e, context);
                });
            },
            //=============================================================================================================================
            // this function fixes brosers that do not support calc
            fixCalc: function () {
                $('body').append('<div id="css3-calc"></div>');
                if ($('#css3-calc').width() === 10) {
                    function __resize() {
                        var width = window.innerWidth < 920 ? window.innerWidth : 920, widthWithPadding = width - 20, height = $(document).height();
                        $('.top-menu-page-name').width(width - 100);
                        $('.top-menu-search').width(width - 60);
                        $('#matches-step1-who-container-box1, #matches-step1-who-container-box2').css('left', widthWithPadding / 2 - 5);
                        $('.matches-step2-matches-btn').width(widthWithPadding / 2 - 17);
                        $('#matches-all-container').css('min-height', height - 412 - 61 - 10);
                        $('#matches-all-container .no-boxes-container').css('height', height - 412 - 61 - 10);
                        $('.ppage').height(height - 71);
                    }
                    $(window).resize(__resize);
                    __resize();
                }
                $('#css3-calc').remove();
            }
        };
    }
});

