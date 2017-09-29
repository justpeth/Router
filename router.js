/**
 * @authors hexg
 * @date    2017-09-20 16:51:59
 */
;(function(global,undefined){
	global.Router = {
		// 路由路径
		'path': function(path){
            if (Router.routes.defined.hasOwnProperty(path)) {
                return Router.routes.defined[path];
            } else {
                return new Router.create.route(path);
            }
		},
        // 设置根路由
        'root': function (path) {
            Router.routes.root = path;
        },
		// 创建路由
        'create': {
            'route': function (path) {
                this.path = path;
                this.action = null;
                this.params = {};
                Router.routes.defined[path] = this;
            }
        },
		// 未定义的路由
        'rescue': function (fn) {
            Router.routes.rescue = fn;
        },
		// 监听路由变化
		'init': function () {
            var fn = function(){ Router.execute(location.hash); };
            if (location.hash === "") {
                // 判断是否设置默认路由
                if (Router.routes.root !== null) {
                    location.hash = Router.routes.root;
                }
            }
            // 判断浏览器是否支持onhashchange 如果不支持 则50ms对比一次hash值是否变化
            if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
                window.onhashchange = fn;
            } else {
                setInterval(fn, 50);
            }
            if(location.hash !== "") {
                Router.execute(location.hash);
            }
		},
        // 执行
        'execute': function(passed_route) {
            var previous_route, matched_route;
            if (Router.routes.current !== passed_route) {
                Router.routes.previous = Router.routes.current;
                Router.routes.current = passed_route;
                matched_route = Router.match(passed_route, true);
                if (matched_route !== null) {
                    matched_route.run();
                    return true;
                } else {
                    if (Router.routes.rescue !== null) {
                        Router.routes.rescue();
                    }
                }
            }
        },
        // 匹配  parameterize 是否需要参数化  true 返回参数对象集合params
        'match': function (path, parameterize) {
            var params = {}, route = null, possible_routes, slice, i, j, compare;
            for (route in Router.routes.defined) {
                if (route !== null && route !== undefined) {
                    route = Router.routes.defined[route];
                    possible_routes = route.partition();
                    for (j = 0; j < possible_routes.length; j++) {
                        slice = possible_routes[j];
                        compare = path;
                        if (slice.search(/:/) > 0) {
                            for (i = 0; i < slice.split("/").length; i++) {
                                if ((i < compare.split("/").length) && (slice.split("/")[i].charAt(0) === ":")) {
                                    params[slice.split('/')[i].replace(/:/, '')] = compare.split("/")[i];
                                    compare = compare.replace(compare.split("/")[i], slice.split("/")[i]);
                                }
                            }
                        }
                        if (slice === compare) {
                            if (parameterize) {
                                route.params = params;
                            }
                            return route;
                        }
                    }
                }
            }
            return null;
        },
        'routes': {
            'current': null,
            'root': null,
            'rescue': null,
            'previous': null,
            'defined': {}
        }
	};
    global.Router.create.route.prototype = {
        'done': function (fn) {
            this.action = fn;
            return this;
        },
        'partition': function () {
            var parts = [], options = [], re = /\(([^}]+?)\)/g, text, i;
            while (text = re.exec(this.path)) {
                parts.push(text[1]);
            }
            options.push(this.path.split("(")[0]);
            for (i = 0; i < parts.length; i++) {
                options.push(options[options.length - 1] + parts[i]);
            }
            return options;
        },
        'run': function () {
            Router.routes.defined[this.path].action();
        }
    };
})(window);