'use strict';

/*!
 * React_ComponentController v1.0
 *
 * Copyright 2017, Himanshu Tanwar
 * Released under the MIT license
 * https://github.com/webXtended/react_componentController
 * Date: 2017-06-07
 */
(function (name, context, definition) {
    if (typeof module != 'undefined') {
        module.exports = definition();
    } else if (typeof define == 'function') {
        define(definition);
    } else {
        context[name] = definition();
    }
})('ComponentController', window, function () {
    var controllers = {};

    var BaseComponent = function (_React$Component) {
        babelHelpers.inherits(BaseComponent, _React$Component);

        function BaseComponent() {
            babelHelpers.classCallCheck(this, BaseComponent);
            return babelHelpers.possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));
        }

        babelHelpers.createClass(BaseComponent, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                this.props.init.prototype = this.props.properties;
                var controller = new this.props.init(this);
                this.controller = controller;
                this.setState(this.props.state);
                if (this.props.callback) {
                    this.props.callback(controller);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var Element = this.props.comp;
                return React.createElement(Element, { state: this.state,
                    controller: this.controller,
                    props: this.props.props,
                    properties: this.props.properties });
            }
        }]);
        return BaseComponent;
    }(React.Component);

    ;

    function setItemFromObjectKey(obj, key, item) {
        var key = key.split(".");
        var data = obj;
        var prop;
        for (var i = 1; i < key.length - 1; i++) {
            prop = key[i];
            data = data[prop];
        }
        data[key.pop()] = item;
        return obj;
    }

    function getBaseController() {
        function Controller(component) {
            var that = this;
            var childComponents = [];
            this.childKeys = "root";
            this.action = function (name) {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                var fn = Function.prototype.bind.apply(that[name], [that].concat(args));
                return fn;
            };
            this.setState = function (obj, key) {
                if (key) {
                    var data = setItemFromObjectKey(component.state, key, obj);
                    data = JSON.parse(JSON.stringify(data));
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

    function getChildController(parent, child) {
        function Controller() {
            var that = this;
            var key = child;
            this.action = function (name) {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                var fn = Function.prototype.bind.apply(that[name], [that].concat(args));
                return fn;
            };
            this.setState = function (obj) {
                var keyList = parent.props.controller.childKeys;
                parent.props.controller.setState(obj, [keyList, key].join("."));
            };
        }
        return Controller;
    }

    function render(Component, container, props, state, callback) {
        var Controller = getBaseController();
        var properties = controllers[Component.name] || {};

        var baseComponent = React.createElement(BaseComponent, { init: Controller,
            callback: callback,
            comp: Component,
            props: props,
            properties: properties || {},
            state: state });

        if (container) {
            ReactDOM.render(baseComponent, container);
        } else {
            return baseComponent;
        }
    }

    function component(Comp, props, state, parent, child, controller) {
        var Controller = controller ? controller : parent && child ? getChildController(parent, child) : getBaseController();
        var properties = controllers[Comp.name] || {};

        var baseComponent = React.createElement(BaseComponent, { init: Controller,
            comp: Comp,
            key: props.key,
            props: props,
            properties: properties || {},
            state: state });

        return baseComponent;
    }

    function create(component, controller) {
        component = component.name || component;
        controllers[component] = controller;
    }

    return {
        render: render,
        component: component,
        create: create
    };
});