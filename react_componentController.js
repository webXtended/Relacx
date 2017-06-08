"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ComponentController = function () {
    var controllers = {};

    var BaseComponent = function (_React$Component) {
        _inherits(BaseComponent, _React$Component);

        function BaseComponent() {
            _classCallCheck(this, BaseComponent);

            return _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));
        }

        _createClass(BaseComponent, [{
            key: "componentWillMount",
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
            key: "render",
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

    function component(Comp, props, state, parent, child) {
        var Controller = parent && child ? getChildController(parent, child) : getBaseController();
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
}();
