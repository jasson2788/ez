/* global UTILS */

function easy_api() {
}
easy_api.prototype = (function() {
    var _methods = {
        _current: {},
        _matches: [],
        _activities: [],
        _try_get_matches: function(callback) {
            this._matches = [
                {name: 'Kim', age: 19, activity: 'cinema (horror movie)', level: 2, profile: 'http://1.soompi.io/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-9.48.48-PM.png', id: 'A'},
                {name: 'Kaetlyn', age: 18, activity: 'walking', level: 3, profile: 'http://1.soompi.io/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-9.48.48-PM.png', id: 'B'},
                {name: 'Vera', age: 24, activity: 'soccer', level: 1, profile: 'http://i61.tinypic.com/23w8upz.jpg', id: 'C'},
                {name: 'Gracie', age: 24, activity: 'jogging', level: 5, profile: 'https://i.ytimg.com/vi/TQIG-0r4UFo/maxresdefault.jpg', id: 'D'},
                {name: 'Ashley', age: 22, activity: 'cinema (romance movie)', level: 9, profile: 'http://assets.nydailynews.com/polopoly_fs/1.1620185.1392847317!/img/httpImage/image.jpg_gen/derivatives/gallery_1200/faces-ashley-wagner.jpg', id: 'E'},
                {name: 'Vera', age: 24, activity: 'soccer', level: 1, profile: 'http://i61.tinypic.com/23w8upz.jpg', id: 'H'},
                {name: 'Kim', age: 19, activity: 'cinema (horror movie)', level: 2, profile: 'http://1.soompi.io/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-9.48.48-PM.png', id: 'F'},
                {name: 'Kaetlyn', age: 18, activity: 'walking', level: 3, profile: 'http://1.soompi.io/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-9.48.48-PM.png', id: 'G'},
                {name: 'Gracie', age: 24, activity: 'jogging', level: 5, profile: 'https://i.ytimg.com/vi/TQIG-0r4UFo/maxresdefault.jpg', id: 'I'},
                {name: 'Ashley', age: 22, activity: 'cinema (romance movie)', level: 9, profile: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Starsinthesky.jpg/1920px-Starsinthesky.jpg', id: 'J'}
            ];
            callback();
        },
        _try_get_activities: function(callback) {
            this._activities = [
                {activity: 'Cinema', id: 'A'},
                {activity: 'Exploring', id: 'B'},
                {activity: 'Bowling', id: 'C'},
                {activity: 'Basketball', id: 'E'},
                {activity: 'Taking', id: 'F'},
                {activity: 'Debates', id: 'G'},
                {activity: 'Walking', id: 'H'},
                {activity: 'Hockey', id: 'I'},
                {activity: 'volunteering', id: 'J'},
                {activity: 'dog walking', id: 'K'}
            ];
            callback();
        },
        get_activities: function(params) {
            var context = this;
            function __activities() {
                params.callback(context._activities);
            }

            this._try_get_activities(__activities);
        },
        search_activities: function(params) {
            var context = this;
            params.callback(
                    context._activities.filter(function(element) {
                        return element.activity.toLowerCase().indexOf(params.value) !== -1;
                    })
            );
        },
        remove_from_current: function(params) {
            for (var index in this._current)
                if (this._current[index].id === params.id) {
                    delete this._current[index];
                    break;
                }
            params.callback();
        },
        get_profile_by_id: function(params) {
            for (var index in this._current)
                if (this._current[index].id === params.id)
                    return this._current[index];
            return null;
        },
        get_matches: function(params) {
            var context = this;
            function _matches() {
                var num = params.num || 5, cpt = 0, result = [], i = 0, length = context._matches.length;
                while (length--) {
                    if (cpt++ === num)
                        break;
                    context._current[length] = context._matches[length];
                    result[length] = context._matches[length];
                    context._matches.splice(length, 1);
                    i = length;
                }
                params.callback(result.length === 0 ? "empty" : cpt > 2 ? result : result[i]);
            }

            if (context._matches.length < 1)
                context._try_get_matches(_matches);
            else
                _matches();
        },
        get_my_matches: function(params) {
            _methods.my_matches = [];
            for (var i = 0; i < 20; i++) {
                _methods.my_matches.push({id: 'request' + i, name: 'Ashley', message: 'Wanna be buddies?', src: "img/profile2.jpg", type: 'request'});
                _methods.my_matches.push({id: 'message' + i, name: 'Jasson', message: 'Hi, there! Wanna meet?', src: "img/profile.jpg", type: 'message'});
            }

            UTILS.call(function() {
                params.callback(_methods.my_matches);
            });
        },
        get_comment_by_id: function(params) {
            _methods.comments = [];

            for (var i = 0; i < 3; i++) {
                _methods.comments.push({id: 'comments1', name: 'Ashley', message: 'Wanna be buddies?', src: "img/profile2.jpg", type: 'you', date: new Date().toDateString()});
                _methods.comments.push({id: 'comments2', name: 'Jasson', message: 'Yeah why not... How are you?', src: "img/profile.jpg", type: 'me', date: new Date().toDateString()});
                _methods.comments.push({id: 'comments3', name: 'Jasson', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit urna at eros condimentum, a ornare ante auctor. Nam eget aliquet neque. Pellentesque et consequat odio. Curabitur sed libero dui. Donec ultrices enim vel commodo suscipit. Donec rutrum tincidunt dignissim. Cras consequat odio tortor.', src: "img/profile.jpg", type: 'me', date: new Date().toDateString()});
            }

            setTimeout(function() {
                UTILS.call(function() {
                    params.callback(_methods.comments);
                });
            }, 1000);
        }
    };

    return {
        call: function(params) {
            if (!UTILS.isDefined(params) || !UTILS.isDefined(params.method) || !(params.method in _methods) || params.method.substr(0, 1) === '_')
                return;
            return _methods[params.method](params.params);
        }
    };
})();


var EASY_API = new easy_api();


