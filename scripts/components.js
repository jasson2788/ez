/* global UTILS, DIAMOND */

//========================================================================================================================================================
//* Defines a match element that will be drawn on the canvas
function matches_canvas_element() {
    this.variables = {};
}
matches_canvas_element.prototype = (function() {
    var _magic = {INFOHEIGHT: 70, FIX: 0.5, IMAGEX: 10, IMAGEY: 10, border: '#e6e6e6'};
    var _methods = {
        //========================================================================================================================================================
        //* Draws the container for the match
        container: function(ref) {
            var ctx = ref.variables.context, radius = 10, borderWidth = 1, ios = UTILS.iosVersion()[0] === 8 ? 5 : 0; // fixes ios8 weird bug;

            ctx.lineJoin = "round";
            ctx.lineWidth = radius;
            ctx.fillStyle = _magic.border;
            ctx.strokeStyle = _magic.border;
            ctx.strokeRect(radius / 2 + ios, radius / 2 + ios, ref.variables.width - radius - ios * 2, ref.variables.height - radius - ios * 2);
            ctx.fillRect(radius / 2 + ios, radius / 2 + ios, ref.variables.width - radius - ios * 2, ref.variables.height - radius - ios * 2);

            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            ctx.strokeRect(radius / 2 + borderWidth + ios, radius / 2 + borderWidth + ios, ref.variables.width - radius - borderWidth * 2 - ios * 2, ref.variables.height - radius - borderWidth * 2 - ios * 2);
            ctx.fillRect(radius / 2 + borderWidth + ios, radius / 2 + borderWidth + ios, ref.variables.width - radius - borderWidth * 2 - ios * 2, ref.variables.height - radius - borderWidth * 2 - ios * 2);
        },
        //========================================================================================================================================================
        //* Draws the profile pic of the match inside the container
        image: function(ref) {
            var ctx = ref.variables.context;
            function __draw() {
                if (ref.variables.skip_image !== true && ref.variables.image_loaded === true)
                    ctx.drawImage(ref.variables.image[0], _magic.IMAGEX, _magic.IMAGEY, ref.variables.width - (_magic.IMAGEX * 2), ref.variables.height - (_magic.IMAGEY * 2) - _magic.INFOHEIGHT);
                if (ref.variables.image_loaded === false) {
                    ref.variables.image_loaded = true;
                    $.event.trigger({type: "matches_canvas_element_image_load", message: ref});
                }
            }
            if (!UTILS.isDefined(ref.variables.image)) {
                if (UTILS.isDefined(ref.variables.iframe))
                    ref.variables.image = ref.variables.iframe.contents().find('#img');
                else
                    ref.variables.image = $(new Image());
                ref.variables.image.load(__draw);
                ref.variables.image.attr('src', ref.variables.data.profile);
            } else if (ref.variables.image.attr('src') !== ref.variables.data.profile)
                ref.variables.image.attr('src', ref.variables.data.profile);
            else
                __draw();
        },
        //========================================================================================================================================================
        //* Draws the profile info of the match and separators inside the container
        info: function(ref) {
            this.line({x1: _magic.FIX, y1: ref.variables.height - _magic.INFOHEIGHT + _magic.FIX, x2: ref.variables.width + _magic.FIX, y2: ref.variables.height - _magic.INFOHEIGHT + _magic.FIX, ref: ref});
            this.line({x1: ref.variables.width - _magic.INFOHEIGHT + _magic.FIX, y1: ref.variables.height - _magic.INFOHEIGHT + _magic.FIX, x2: ref.variables.width - _magic.INFOHEIGHT + _magic.FIX, y2: ref.variables.height + _magic.FIX, ref: ref});
            this.level(ref);
            this.information(ref);
            this.loading(ref);
        },
        //========================================================================================================================================================
        //* Draws a line based on params
        //* @x1, y1, x2, y2
        line: function(params) {
            var ctx = params.ref.variables.context;
            ctx.restore();
            ctx.lineWidth = 1;
            ctx.strokeStyle = _magic.border;
            ctx.beginPath();
            ctx.moveTo(params.x1, params.y1);
            ctx.lineTo(params.x2, params.y2);
            ctx.stroke();
        },
        //========================================================================================================================================================
        //* Draws a loading on the image container
        loading: function(ref) {
            if (ref.variables.skip_image === false)
                return;

            var ctx = ref.variables.context, x = ref.variables.width / 2 - 40, y = ref.variables.height / 2 - 85;
            ctx.fillStyle = "#e5e5e5";
            ctx.beginPath();
            ctx.moveTo(x + 40 / 2, y);
            ctx.lineTo(x + 40, 25 + y);
            ctx.lineTo(x, 25 + y);
            ctx.closePath();
            ctx.fill();

            x += 40;
            ctx.fillStyle = "#c1c1c1";
            ctx.beginPath();
            ctx.moveTo(x + 40 / 2, y);
            ctx.lineTo(x + 40, 25 + y);
            ctx.lineTo(x, 25 + y);
            ctx.closePath();
            ctx.fill();

            x -= 20;
            ctx.fillStyle = "#d9d9d9";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 40, y);
            ctx.lineTo(x + 20, y + 25);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fill();

            x -= 20;
            y += 25;
            ctx.fillStyle = "#a9a9a9";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 40, y);
            ctx.lineTo(x + 40, y + 60);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fill();

            x += 40;
            ctx.fillStyle = "#919191";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 40, y);
            ctx.lineTo(x, y + 60);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fill();

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#7F7F7F';
            ctx.font = "16px light";
            ctx.fillText("loading pictures", ref.variables.width / 2, y + 75);
        },
        //========================================================================================================================================================
        //* Draws the profile level of the match inside the container
        level: function(ref) {
            var ctx = ref.variables.context;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#7F7F7F';
            ctx.font = "55px FontAwesome";
            ctx.fillText("\uf08a", ref.variables.width - _magic.INFOHEIGHT / 2, ref.variables.height - _magic.INFOHEIGHT / 2);
            ctx.font = "bold 20px light";
            ctx.fillText(ref.variables.data.level, ref.variables.width - _magic.INFOHEIGHT / 2, ref.variables.height - _magic.INFOHEIGHT / 2 - 1);
        },
        //========================================================================================================================================================
        //* Draws the profile info of the match inside the container
        information: function(ref) {
            var ctx = ref.variables.context;
            ctx.textAlign = 'left';
            ctx.fillStyle = '#262626';
            ctx.font = "24px light";
            ctx.fillText(ref.variables.data.name, 10, ref.variables.height - 50);

            var width = ctx.measureText(ref.variables.data.name).width + 10;
            ctx.fillStyle = '#7F7F7F';
            ctx.font = "14px light";
            ctx.fillText(", " + ref.variables.data.age, width, ref.variables.height - 45 - 1);
            ctx.font = "16px light";
            ctx.fillText(ref.variables.data.activity, 9, ref.variables.height - 28);
        },
        //========================================================================================================================================================
        //* Sets up the variables of this object
        set_up: function(params) {
            params.ref.variables.app = params.params.ref;
            params.ref.variables.data = params.params.data;
            params.ref.variables.skip_image = true;
            params.ref.variables.image_fadein_finish = false;
            params.ref.variables.image_loaded = false;
            params.ref.variables.width = _methods.container_width();
            params.ref.variables.height = _methods.container_height();
            params.ref.variables.canvas = document.createElement('canvas');
            params.ref.variables.context = params.ref.variables.canvas.getContext('2d');
            params.ref.variables.app.optimize_canvas({
                width: params.ref.variables.width,
                height: params.ref.variables.height,
                canvas: params.ref.variables.canvas,
                context: params.ref.variables.context
            });
        },
        //========================================================================================================================================================
        //* Returns the container width
        container_width: function() {
            return window.innerWidth < 920 ? window.innerWidth - 20 : 900;
        },
        //========================================================================================================================================================
        //* Returns the container height
        container_height: function() {
            return window.innerHeight - 154;
        }
    };

    return {
        //========================================================================================================================================================
        //* initialize the container of the match based on params
        init: function(params) {
            _methods.set_up({params: params, ref: this});
            this.redraw();
        },
        //========================================================================================================================================================
        //* draws the container
        redraw: function(params) {
            var context = this;
            if (UTILS.isDefined(params) && UTILS.isDefined(params.resize)) {
                context.variables.width = _methods.container_width();
                context.variables.height = _methods.container_height();
                context.variables.app.optimize_canvas({width: context.variables.width, height: context.variables.height, canvas: context.variables.canvas, context: context.variables.context});
            }

            _methods.container(context);
            _methods.image(context);
            _methods.info(context);
            return this.get_canvas();
        },
        //========================================================================================================================================================
        //* draws the container with the loaded image
        redraw_with_image: function() {
            this.variables.skip_image = false;
            _methods.image(this);
            return this;
        },
        //========================================================================================================================================================
        //* returns the canvas
        get_canvas: function() {
            return this.variables.canvas;
        },
        //========================================================================================================================================================
        //* cancel image loading
        cancel: function() {
            var iframe = $(this.variables.iframe)[0];
            if (!UTILS.isDefined(iframe))
                return;

            if (UTILS.isIE())
                iframe.contentDocument.execCommand('Stop');
            else
                iframe.contentWindow.stop();
        }
    };
})();

function matches_canvas(id, id_back) {
    this.ID = id;
    this.ID_BACK = id_back;
}
matches_canvas.prototype = (function() {
    var _variables = {
        //========================================================================================================================================================
        //* returns canvas height
        height: function() {
            return this.canvas.height;
        },
        //========================================================================================================================================================
        //* returns canvas width
        width: function() {
            return this.canvas.width;
        },
        //========================================================================================================================================================
        //* returns match element width
        container_width: function() {
            return this.width() / this.ratio < 920 ? this.width() / this.ratio - 20 : 900;
        },
        //========================================================================================================================================================
        //* returns match element height
        container_height: function() {
            return this.height() / this.ratio - 14;
        },
        //========================================================================================================================================================
        //* stores window height for resize event
        page_height: window.innerHeight,
        //========================================================================================================================================================
        //* defines the drag object
        //@x drag distance on x axis, @drag if match element is dragged
        drag: {x: 0, drag: false},
        //========================================================================================================================================================
        //* defines match elements array
        elements: []
    };

    var _magic = {
        //========================================================================================================================================================
        //* min distance for swipe left event to happen
        TO_SWIPE_LEFT: -60,
        //========================================================================================================================================================
        //* max distance for swipe left event to happen
        TO_SWIPE_RIGHT: 60
    };

    var _methods = {
        //========================================================================================================================================================
        //* determines width, height, x, y of a match element
        box: function(swipe_left_right_scale, moveTo, init_scale) {
            if (!UTILS.isDefined(init_scale)) {
                var scale = swipe_left_right_scale || 1, add = moveTo > 0 ? (_variables.container_width() - (_variables.container_width() * scale)) : 0;
                return {x: (_variables.width() / _variables.ratio - _variables.container_width()) / 2 + add, y: (_variables.height() / _variables.ratio - _variables.container_height() * scale) / 2 + 3, width: _variables.container_width() * scale, height: _variables.container_height() * scale};
            } else {
                return {x: (_variables.width() / _variables.ratio - _variables.container_width() * init_scale) / 2, y: (_variables.height() / _variables.ratio - _variables.container_height() * init_scale) / 2 + 3, width: _variables.container_width() * init_scale, height: _variables.container_height() * init_scale};
            }
        },
        //========================================================================================================================================================
        //* triggered when mousedown or touchstart
        down: function(e) {
            if (_variables.loaded === false || _variables.anim === true)
                return;
            var xy = UTILS.getClientXY(e);
            if (xy.x > _variables.rect.x && xy.x < _variables.rect.x + _variables.rect.width && xy.y > _variables.rect.y && xy.y < _variables.rect.y + _variables.rect.height)
                _variables.drag = {x: xy.x, drag: true};
        },
        //========================================================================================================================================================
        //* triggered when mousemove or touchmove
        move: function(e, ref) {
            if (_variables.loaded === false || _variables.anim === true)
                return;
            
            if (_variables.drag.drag === true) {
                _variables.moveTo = UTILS.getClientXY(e).x - _variables.drag.x;
                _methods.draw({moveTo: _variables.moveTo, ref: ref, element: _variables.elements[_variables.elements.length - 1], context: _variables.context});
            }
        },
        //========================================================================================================================================================
        //* triggered when mouseup or touchend
        up: function(e, ref) {
            if (_variables.loaded === false || _variables.anim === true)
                return;
            if (_variables.drag.drag === true) {
                var anim = "", moveTo = UTILS.getClientXY(e).x - _variables.drag.x;
                moveTo = ~~moveTo;

                if (moveTo < _magic.TO_SWIPE_LEFT && moveTo !== 0)
                    anim = "left";
                else if (moveTo > _magic.TO_SWIPE_RIGHT && moveTo !== 0)
                    anim = "right";
                else if (moveTo !== 0)
                    anim = "init";

                ref.animate({moveTo: moveTo, anim: anim});
                _variables.drag = {x: 0, drag: false};
                _variables.moveTo = 0;
            }
        },
        //========================================================================================================================================================
        //* creates matche elements and beggins the animation for their appearance
        init: function(params) {
            var cpt = 0, init_scale = 0, scale, i_scale = 0.92, canvas = document.createElement('canvas'), t_width = _variables.width() / _variables.ratio, t_height = _variables.height() / _variables.ratio;
            var c_height = _variables.container_height() + 14, c_width = _variables.container_width();

            for (var i in params.data) {
                _variables.elements[cpt] = new matches_canvas_element();
                if (UTILS.isOriginNull())
                    _variables.elements[cpt].variables.iframe = $('#templates-iframe-matches-step2-matches-container-iframe' + cpt);
                _variables.elements[cpt].init({ref: params.ref, data: params.data[i], skip_image: true});
                _variables.elements[cpt].rotate = cpt % 2 === 0 ? -(cpt % 5) : (cpt % 5);
                cpt++;
            }

            params.ref.optimize_canvas({width: c_width, height: c_height, canvas: canvas, context: canvas.getContext('2d')});
            for (var i in _variables.elements)
                _methods.draw({element: _variables.elements[i], init_scale: i_scale, rotate: _variables.elements[i].rotate, context: canvas.getContext('2d'), norect: true});

            function __init_all() {
                if (init_scale < i_scale + 0.01) {
                    scale = init_scale + 0.08;
                    init_scale += 0.04;
                    _variables.back_context.drawImage(canvas, ~~((t_width - c_width * scale) / 2), ~~((t_height - c_height * scale) / 2), ~~(c_width * scale), ~~(c_height * scale));
                    requestAnimationFrame(__init_all);
                } else
                    requestAnimationFrame(function() {
                        _methods.first_container_rotate({ref: params.ref, callback: params.callback});
                    });
            }

            requestAnimationFrame(__init_all);
        },
        //========================================================================================================================================================
        //* animates the first element during the last part of the animation
        first_container_rotate: function(params) {
            var init_scale = 0.92, scale_add = 0.008, element = _variables.elements[_variables.elements.length - 1], r = element.rotate, rotate = element.rotate, rotate_add = Math.abs(rotate) / ((1 - init_scale) / scale_add);
            _variables.fade_in_image_alpha = 0;
            _methods.init_anim_draw({init_scale_back: init_scale, init_scale: init_scale, ref: params.ref});

            // if image has been loaded, update
            function __if_image() {
                var update = false, length = _variables.elements.length;
                for (var i in  _variables.elements) {
                    if (i < length && _variables.elements[i].variables.image_loaded === true) {
                        update = true;
                        break;
                    }
                }
                if (update === true)
                    _methods.init_anim_draw({init_scale_back: 0.92, ref: params.ref, image: true, no_first: true});
            }

            function __draw() {
                _methods.clear_me({ref: params.ref, context: _variables.context});
                if (init_scale < 1 || r < 0 && rotate < 0) {
                    _methods.draw({element: element, init_scale: init_scale < 1 ? init_scale.toFixed(2) : 1, rotate: rotate.toFixed(2), context: _variables.context});
                    requestAnimationFrame(__draw);
                    init_scale += scale_add;
                    rotate += rotate > 0 ? -rotate_add : rotate_add;
                } else {
                    if (UTILS.isDefined(params.element)) {
                        _variables.elements.unshift(params.element);
                        _methods.init_anim_draw({init_scale_back: 0.92, ref: params.ref, no_first: true});
                    }
                    _variables.anim = false;
                    _methods.draw({element: element, context: _variables.context});
                    _methods.first_container_fade_in_image(element, params.ref);
                    setTimeout(__if_image, 5);
                    UTILS.call(params.callback);
                }
            }

            __draw();
        },
        //========================================================================================================================================================
        //* happens when match element loads an image
        fade_in_image: function(e, ref) {
            if (_variables.loaded === true && e.message.variables.data.id === _variables.elements[_variables.elements.length - 1].variables.data.id && _variables.anim === false)
                _methods.first_container_fade_in_image(e.message, ref);
            else if (_variables.loaded === true && _variables.anim === false)
                _methods.init_anim_draw({init_scale_back: 0.92, ref: ref, element: e.message, no_first: true});
        },
        //========================================================================================================================================================
        //* last part of the animation, fade in profile pic of the first match element
        first_container_fade_in_image: function(element, ref) {
            if (element.variables.image_loaded !== true || element.variables.skip_image === false)
                return;

            function __fade_in() {
                if (_variables.fade_in_image_alpha > 0) {
                    _variables.fade_in_image_alpha -= 0.1;
                    _variables.fade_in_image_alpha = Number(_variables.fade_in_image_alpha.toFixed(2));
                    _methods.draw({moveTo: _variables.moveTo, element: element, context: _variables.context, ref: ref});
                    requestAnimationFrame(__fade_in);
                } else {
                    element.variables.image_fadein_finish = true;
                    _variables.fade_in_image_cancel = false;
                }
            }

            function __fade_out() {
                if (_variables.fade_in_image_alpha < 1) {
                    _variables.fade_in_image_alpha += 0.1;
                    _variables.fade_in_image_alpha = Number(_variables.fade_in_image_alpha.toFixed(2));
                    _methods.draw({moveTo: _variables.moveTo, element: element, context: _variables.context, ref: ref});
                    requestAnimationFrame(__fade_out);
                } else {
                    _methods.draw({element: element.redraw_with_image(), context: _variables.context});
                    requestAnimationFrame(__fade_in);
                }
            }

            if (element.variables.image_loaded === true && element.variables.image_fadein_finish === false)
                requestAnimationFrame(__fade_out);
        },
        //========================================================================================================================================================
        //* draws all available elements
        init_anim_draw: function(params) {
            var id = null;
            _methods.clear_me({ref: params.ref, context: _variables.back_context});
            if (UTILS.isDefined(params.element) || UTILS.isDefined(params.image)) {
                if (UTILS.isDefined(params.element))
                    id = params.element.variables.data.id;
            } else
                _methods.clear_me({ref: params.ref, context: _variables.context});

            if (params.back !== 'back') {
                for (var i in _variables.elements) {
                    if (i < _variables.elements.length - 1) {
                        _methods.draw({element: UTILS.isDefined(params.image) ? _variables.elements[i].redraw_with_image() : UTILS.isDefined(id) ? id === _variables.elements[i].variables.data.id ? _variables.elements[i].redraw_with_image() : _variables.elements[i] : _variables.elements[i], init_scale: params.init_scale_back, rotate: _variables.elements[i].rotate, context: _variables.back_context, resize: params.resize});
                    } else if (params.no_first !== true)
                        _methods.draw({element: _variables.elements[i], init_scale: params.init_scale, rotate: params.rotate === false ? 0 : _variables.elements[i].rotate, context: _variables.context, resize: params.resize});
                }
            } else
                _methods.draw({element: _variables.elements[_variables.elements.length - 1], init_scale: params.init_scale, rotate: params.rotate === false ? 0 : _variables.elements[_variables.elements.length - 1].rotate, context: _variables.context, resize: params.resize});
        },
        //========================================================================================================================================================
        //* draws a match element on the given canvas
        draw: function(params) {
            if (params.resize === 'resize')
                params.element.redraw(params);

            var moveTo = 0, swipe_left_right_scale = 1, init_scale = !UTILS.isDefined(params.init_scale) ? null : params.init_scale;
            var x = _variables.width() / _variables.ratio / 2, y = _variables.height() / _variables.ratio / 2;
            if (UTILS.isDefined(params) && UTILS.isDefined(params.moveTo) && params.moveTo !== 0) {
                swipe_left_right_scale = 1 - Math.abs(params.moveTo / _variables.width());
                _methods.clear_me({ref: params.ref, context: params.context});
                params.context.translate(x, y);
                params.context.rotate((params.moveTo / _variables.ratio / 100) * Math.PI / 180);
                params.context.translate(-x, -y);
                moveTo = params.moveTo;
            }

            // determines the coordinates, width and height of the image
            var rect = _methods.box(swipe_left_right_scale, moveTo, init_scale);
            if (UTILS.isDefined(params) && !UTILS.isDefined(params.norect)) {
                // rotate context for the init animation
                _methods.init_anim_rotate({context: params.context, init_scale: init_scale, x: x, y: y, rotate: params.rotate});
                // draws the image on the given canvas
                params.context.drawImage(params.element.get_canvas(), ~~(rect.x + moveTo), ~~(rect.y), ~~(rect.width), ~~(rect.height));
                // draws a thumb up or thumb down based on swipe events
                if (UTILS.isDefined(params.ref))
                    _methods.yes_no(params.ref, moveTo, rect, swipe_left_right_scale);
            } else {
                x = _variables.container_width() / 2;
                // rotate context for the init animation
                _methods.init_anim_rotate({context: params.context, init_scale: init_scale, x: x, y: y, rotate: params.rotate});
                params.context.drawImage(params.element.get_canvas(), ~~((_variables.container_width() - rect.width) / 2), ~~(rect.y), ~~(rect.width), ~~(rect.height));
            }

            // draw loading of the match image
            if (params.element.variables.image_loaded === true && params.element.variables.image_fadein_finish === false && _variables.fade_in_image_alpha !== 0) {
                params.context.fillStyle = "rgba(255,255,255," + _variables.fade_in_image_alpha + ")";
                params.context.fillRect(~~(rect.x + moveTo + 10), ~~(rect.y + 10 * swipe_left_right_scale), ~~(rect.width - 20 * swipe_left_right_scale), ~~(rect.height - 90 * swipe_left_right_scale));
            }
        },
        //========================================================================================================================================================
        //* rotate context for the init animation
        init_anim_rotate: function(params) {
            if (UTILS.isDefined(params) && UTILS.isDefined(params.init_scale)) {
                params.context.restore();
                params.context.save();
                params.context.translate(params.x, params.y);
                params.context.rotate(params.rotate * Math.PI / 180);
                params.context.translate(-params.x, -params.y);
            }
        },
        //========================================================================================================================================================
        //* draws a thumb up or thumb down in the center of the image
        yes_no: function(ref, moveTo, rect, scale) {
            var ctx = _variables.context;
            if (!UTILS.isDefined(_variables.yes_no)) {
                _variables.yes_no = document.createElement('canvas');
                ref.optimize_canvas({
                    width: 200,
                    height: 100,
                    canvas: _variables.yes_no,
                    context: _variables.yes_no.getContext('2d')
                });

                function __draw(type, ctx) {
                    ctx.beginPath();
                    ctx.arc(type === 'no' ? 50 / _variables.ratio + 1 : 150 / _variables.ratio + 1, 50 / _variables.ratio + 1, 50 / _variables.ratio - 2, 0, 2 * Math.PI, false);
                    ctx.lineWidth = 1 / _variables.ratio;
                    ctx.strokeStyle = type === 'no' ? '#EB6361' : '#3B8A8E';
                    ctx.stroke();

                    ctx.textBaseline = "middle";
                    ctx.textAlign = 'center';
                    ctx.fillStyle = type === 'no' ? '#EB6361' : '#3B8A8E';
                    ctx.font = (70 / _variables.ratio) + "px FontAwesome";
                    ctx.fillText(type === 'no' ? '\uf165' : '\uf164', type === 'no' ? 50 / _variables.ratio + 2 : 150 / _variables.ratio + 2, 50 / _variables.ratio + 2);
                }

                __draw('no', _variables.yes_no.getContext('2d'));
                __draw('yes', _variables.yes_no.getContext('2d'));
            }

            var resize_circle = (100 - (100 * scale)) / 2;
            if (moveTo < _magic.TO_SWIPE_LEFT && moveTo !== 0)
                ctx.drawImage(_variables.yes_no, 0, 0, 100, 100, rect.x + (rect.width / 2) - 50 + moveTo + resize_circle, rect.y + (rect.height / 2) - 50 + resize_circle, 100 * scale, 100 * scale);
            else if (moveTo > _magic.TO_SWIPE_RIGHT && moveTo !== 0)
                ctx.drawImage(_variables.yes_no, 100, 0, 100, 100, rect.x + (rect.width / 2) - 50 + moveTo + resize_circle, rect.y + (rect.height / 2) - 50 + resize_circle, 100 * scale, 100 * scale);
        },
        //========================================================================================================================================================
        //* optimizes two canvases for high def screens
        optimize_me: function(ref) {
            ref.optimize_canvas({
                width: window.innerWidth,
                height: window.innerHeight - 140,
                canvas: _variables.canvas,
                context: _variables.context
            });
            ref.optimize_canvas({
                width: window.innerWidth,
                height: window.innerHeight - 140,
                canvas: _variables.back_canvas,
                context: _variables.back_context
            });
        },
        //========================================================================================================================================================
        //* clears surface of the two canvases
        clear_me: function(params) {
            params.ref.clear({context: params.context, width: _variables.width(), height: _variables.height()});
        },
        //========================================================================================================================================================
        //* resize event
        events_resize: {
            timer: null,
            event: null,
            func: function(ref) {
                window.clearTimeout(_methods.events_resize.timer);
                _methods.optimize_me(ref);
                _methods.init_anim_draw({init_scale: 1, init_scale_back: 0.92, ref: ref, rotate: false, resize: 'resize', back: 'back'});
                _variables.rect = _methods.box();
                _methods.events_resize.timer = setTimeout(function() {
                    _methods.init_anim_draw({init_scale: 1, init_scale_back: 0.92, ref: ref, rotate: false, resize: 'resize'});
                }, 200);
                _variables.page_height = window.innerHeight;
            }
        },
        //========================================================================================================================================================
        //* binds touch and resize events to canvas
        events: function(ref, power) {
            if (!UTILS.isDefined(_methods.events_resize.event))
                _methods.events_resize.event = function() {
                    _methods.events_resize.func(ref);
                };

            if (power === 'on' && _variables.events_loaded !== true) {
                _variables.canvas.addEventListener(UTILS.isTouch() ? 'touchstart' : 'mousedown', _methods.down, false);
                _variables.canvas.addEventListener(UTILS.isTouch() ? 'touchmove' : 'mousemove', function(e) {
                    _methods.move(e, ref);
                }, false);
                _variables.canvas.addEventListener(UTILS.isTouch() ? 'touchend' : 'mouseup', function(e) {
                    _methods.up(e, ref);
                }, false);

                window.addEventListener('resize', _methods.events_resize.event, false);
                DIAMOND.core.app().subscribe('matches_canvas_element_image_load', function(e) {
                    _methods.fade_in_image(e, ref);
                });
                DIAMOND.core.app().subscribe('matches_swipe', _methods.swipe);
            } else if (power === 'on')
                window.addEventListener('resize', _methods.events_resize.event, false);
            else if (power === 'off')
                window.removeEventListener('resize', _methods.events_resize.event);
            _variables.events_loaded = true;
        },
        //========================================================================================================================================================
        //* happens after swipe left ot right occurs
        swipe: function(params) {
            _methods.first_container_rotate({ref: params.ref, element: _variables.element});
        }
    };

    return {
        //========================================================================================================================================================
        //* initialize the match canvas
        init: function(params) {
            var context = this;
            _variables.canvas = document.getElementById(this.ID);
            _variables.context = _variables.canvas.getContext("2d");
            _variables.back_canvas = document.getElementById(this.ID_BACK);
            _variables.back_context = _variables.back_canvas.getContext("2d");
            _variables.ratio = window.devicePixelRatio || 1;
            _variables.loaded = false;
            _variables.fade_in_image_alpha = 1;
            _variables.moveTo = 0;

            this.events('on');
            _methods.optimize_me(context);

            _variables.rect = _methods.box();

            setTimeout(function() {
                _methods.init({ref: context, data: params.data, callback: function() {
                        _variables.loaded = true;
                        params.callback();
                    }});
            }, 250);
        },
        //========================================================================================================================================================
        //* binds touch and resize events to canvas
        events: function(power) {
            _methods.events(this, power);
        },
        //========================================================================================================================================================
        //* optimizes the canvas for high def screens
        optimize_canvas: function(params) {
            var width = params.width, height = params.height;
            params.canvas.style.width = width + "px";
            params.canvas.style.height = height + "px";
            params.canvas.setAttribute('width', width);
            params.canvas.setAttribute('height', height);
            params.canvas.width = width * _variables.ratio;
            params.canvas.height = height * _variables.ratio;
            params.context.setTransform(1, 0, 0, 1, 0, 0);
            params.context.scale(_variables.ratio, _variables.ratio);
        },
        //========================================================================================================================================================
        //* clears the context passed as parameter
        clear: function(params) {
            params.context.setTransform(1, 0, 0, 1, 0, 0);
            params.context.scale(_variables.ratio, _variables.ratio);
            params.context.clearRect(-1, -1, params.width + 2, params.height + 2);
        },
        //========================================================================================================================================================
        //* happens when swipe right, left, or init
        animate: function(params) {
            if (!UTILS.isDefined(params) || !UTILS.isDefined(params.anim) || params.anim === "" || _variables.anim === true)
                return;

            var context = _methods, tcontext = this, moveTo = params.moveTo || 0, maxWidth = _variables.width() / 2, ref = this, time = Math.round((maxWidth - Math.abs(moveTo)) / 12);

            _variables.anim = true;

            if (params.anim === "left" || params.anim === "right") {
                _variables.elements[_variables.elements.length - 1].cancel();
                _variables.element = _variables.elements.pop();
            }

            function __animate() {
                _methods.clear_me({ref: ref, context: _variables.context});
                if (params.anim === "init") {
                    moveTo = moveTo > 0 ? moveTo - 1 : moveTo + 1;
                    context.draw({moveTo: moveTo, ref: ref, element: _variables.elements[_variables.elements.length - 1], context: _variables.context});
                } else if (params.anim === "left") {
                    moveTo -= time;
                    context.draw({moveTo: moveTo, ref: ref, element: _variables.element, context: _variables.context});
                } else if (params.anim === "right") {
                    moveTo += time;
                    context.draw({moveTo: moveTo, ref: ref, element: _variables.element, context: _variables.context});
                }
                __finish();
            }

            function __finish() {
                if (params.anim === "init") {
                    if (moveTo !== 0)
                        requestAnimationFrame(__animate);
                    else
                        _variables.anim = false;
                } else if (params.anim === "left" || params.anim === "right") {
                    if (maxWidth > Math.abs(moveTo))
                        requestAnimationFrame(__animate);
                    else {
                        _methods.clear_me({ref: ref, context: _variables.context});
                        $.event.trigger({type: "matches_swipe", ref: tcontext});
                    }
                }
            }
            requestAnimationFrame(__animate);
        }
    };
})();

var MATCHES_CANVAS = new matches_canvas("matches-step2-matches-container", "matches-step2-matches-container-back");
