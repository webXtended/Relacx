"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ComponentController = function () {
    var controllers = {};

    var BaseComponent = function (_React$Component) {
        _inherits(BaseComponent, _React$Component);

        function BaseComponent(props) {
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

    function getBaseController() {
        function Controller(context) {
            this.component = context;
            var that = this;
            this.action = function (name) {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                var fn = Function.prototype.bind.apply(that[name], [that].concat(args));
                return fn;
            };
        }
        return Controller;
    }

    function render(Component, container, props, state) {
        var Controller = getBaseController();
        var properties = controllers[Component.name] || {};

        ReactDOM.render(React.createElement(BaseComponent, { init: Controller,
            comp: Component,
            props: props,
            properties: properties || {},
            state: state }), container);
    }

    function create(component, controller) {
        component = component.name || component;
        controllers[component] = controller;
    }

    return {
        render: render,
        create: create
    };
}();
