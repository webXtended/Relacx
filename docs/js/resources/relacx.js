var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*!
 * Relacx
 *
 * Copyright 2017, Himanshu Tanwar
 * Released under the MIT license
 * https://github.com/webXtended/Relacx
 */

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Relacx = factory();
})(this, function () {
    var controllers = {};
    var controllerInstances = {};
    var actionListeners = {};

    var BaseComponent = function (_React$Component) {
        _inherits(BaseComponent, _React$Component);

        function BaseComponent(props) {
            _classCallCheck(this, BaseComponent);

            var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this, props));

            var properties = {};

            for (var key in _this.props.props) {
                properties[key] = _this.props.props[key];
            }

            _this.properties = properties;
            return _this;
        }

        _createClass(BaseComponent, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                if (this.props.parentController) {
                    this.props.init.prototype.uber = this.props.parentController;
                }

                var controller = new this.props.init(this, this.props.compController);

                this.controller = controller;
                this.setState(this.props.state);

                if (controllers[this.props.comp.name]) {
                    controllers[this.props.comp.name].setComponentController(controller);
                    controllerInstances[this.props.comp.name] = controllerInstances[this.props.comp.name] || [];
                    controllerInstances[this.props.comp.name].push(controller);
                }

                if (this.props.callback) {
                    this.props.callback(controller);
                }
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(props) {
                this.setState(props.state);
            }
        }, {
            key: 'render',
            value: function render() {

                var Element = this.props.comp;

                this.properties.controller = this.controller;
                this.properties.state = this.state;
                return React.createElement(Element, this.properties);
            }
        }]);

        return BaseComponent;
    }(React.Component);

    ;

    function clone(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != (typeof obj === 'undefined' ? 'undefined' : _typeof(obj))) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function setItemFromObjectKey(obj, key, item) {
        var key = key.split(".");
        var data = obj;
        var prop;
        for (var i = 1; i < key.length - 1; i++) {
            prop = key[i];
            if (data[prop] === undefined) {
                data[prop] = {};
            }
            data = data[prop];
        }
        var dataKey = key.pop();
        data[dataKey] = item;
        return obj;
    }

    function getBaseController() {
        function Controller(component, controller) {
            var that = this;
            var childComponents = [];
            this.childKeys = "root";

            this.componentController = controller;
            this.constructor.prototype = controller;

            this.action = function (name) {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                var fn = Function.prototype.bind.apply(this.componentController[name], [that].concat(args));
                return fn;
            };
            this.setState = function (obj, key) {
                if (key) {
                    var data = setItemFromObjectKey(component.state, key, obj);
                    // data = JSON.parse(JSON.stringify(data));
                    data = clone(data);
                    component.setState(data);
                } else {
                    component.setState(obj);
                }
            };
            this.getState = function () {
                return component.state;
            };

            this.getChildInstances = function () {
                return childComponents;
            };
            this.addChildInstance = function (instance) {
                childComponents.push(instance);
            };
        }

        return Controller;
    }

    function getChildController(parent, childPath) {
        function Controller(component, controller) {
            var that = this;
            var key = childPath;

            this.childKeys = childPath;

            this.componentController = controller;

            this.action = function (name) {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                var fn = Function.prototype.bind.apply(this.componentController[name], [that].concat(args));
                return fn;
            };

            this.setState = function (obj, prevKey) {
                var keyList = parent.props.controller.childKeys;
                parent.props.controller.setState(obj, [keyList, prevKey || key].join("."));
            };

            this.getState = function () {
                return component.state;
            };
        }

        return Controller;
    }

    function render(Component, container, options) {
        var Controller = getBaseController();
        var properties = controllers[Component.name] || {};
        options = options || {};
        options.props = options.props || {};
        options.state = options.state || {};

        var baseComponent = React.createElement(BaseComponent, { init: Controller,
            comp: Component,
            compController: properties,
            props: options.props,
            state: options.state,
            callback: options.callback });

        if (container) {
            ReactDOM.render(baseComponent, container, function () {
                if (options.afterRender && typeof options.afterRender === 'function') {
                    options.afterRender();
                }
            });
        } else {
            return baseComponent;
        }
    }

    function component(Comp, options) {
        options = options || {};
        options.props = options.props || {};
        options.state = options.state || {};

        var compController = controllers[Comp.name] || {};

        var Controller = options.parent && options.childPath ? getChildController(options.parent, options.childPath) : getBaseController();

        var baseComponent = React.createElement(BaseComponent, { init: Controller,
            comp: Comp,
            compController: compController,
            key: options.key,
            props: options.props,
            state: options.state });
        return baseComponent;
    }

    function getController(component) {
        if (component) {
            var componentName = component.name;
            var controller = new Controller(componentName);
            controllers[componentName] = controller;
            return controller;
        }

        return false;
    }

    function Controller(componentName) {
        this.componentName = componentName;
    }

    Controller.prototype.setComponentController = function (controller) {
        this.componentController = controller;
    };

    Controller.prototype.addAction = function (actionName, action) {
        this[actionName] = action;
    };

    Controller.prototype.addActionListener = function (events, action) {
        if (events && typeof events === 'string') {
            actionListeners[events] = actionListeners[events] || [];
            actionListeners[events].push({
                componentName: this.componentName,
                action: action
            });
        } else if (events && events.length) {
            for (var i = 0; i < events.length; i++) {
                actionListeners[events[i]] = actionListeners[events[i]] || [];
                actionListeners[events[i]].push({
                    componentName: this.componentName,
                    action: action
                });
            }
        }
    };

    Controller.prototype.addBroadcastAction = function (actionName, action) {
        this[actionName] = function () {
            var args = Array.prototype.slice.call(arguments);
            var result = action.apply(this, args);
            broadcastAction(actionName, result);
        };
    };

    function broadcastAction(actionName, data) {
        var _this2 = this;

        var listeners = actionListeners[actionName];

        var _loop = function _loop(i) {
            var instances = controllerInstances[listeners[i].componentName];

            var _loop2 = function _loop2(j) {
                setTimeout(function (listener) {
                    listener.action.call(instances[j], actionName, data);
                }.bind(_this2, listeners[i]), 0);
            };

            for (var j = 0; j < instances.length; j++) {
                _loop2(j);
            }
        };

        for (var i = 0; i < listeners.length; i++) {
            _loop(i);
        }
    }

    return {
        render: render,
        component: component,
        controller: getController,
        broadcastAction: broadcastAction
    };
});