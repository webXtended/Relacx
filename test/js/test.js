"use strict";

var TestApp = function (_React$Component) {
    babelHelpers.inherits(TestApp, _React$Component);

    function TestApp() {
        babelHelpers.classCallCheck(this, TestApp);
        return babelHelpers.possibleConstructorReturn(this, (TestApp.__proto__ || Object.getPrototypeOf(TestApp)).apply(this, arguments));
    }

    babelHelpers.createClass(TestApp, [{
        key: "render",
        value: function render() {
            var name = "",
                childComp = "";
            if (this.props.state.data && this.props.state.data.name) {
                name = this.props.state.name;
                childComp = Relacx.component(ChildComp, {
                    parent: this,
                    state: this.props.state.child ? this.props.state.child.data : {},
                    childPath: "child.data"
                });
            }

            return React.createElement(
                "div",
                null,
                name,
                React.createElement(
                    "button",
                    { onClick: this.props.controller.action("test") },
                    "Click Me"
                ),
                childComp
            );
        }
    }]);
    return TestApp;
}(React.Component);

var ChildComp = function (_React$Component2) {
    babelHelpers.inherits(ChildComp, _React$Component2);

    function ChildComp() {
        babelHelpers.classCallCheck(this, ChildComp);
        return babelHelpers.possibleConstructorReturn(this, (ChildComp.__proto__ || Object.getPrototypeOf(ChildComp)).apply(this, arguments));
    }

    babelHelpers.createClass(ChildComp, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                this.props.state.innerData ? this.props.state.innerData.name : "no data",
                React.createElement(
                    "button",
                    { onClick: this.props.controller.action("innerClick") },
                    "CLICK"
                )
            );
        }
    }]);
    return ChildComp;
}(React.Component);

var TestController = Relacx.controller(TestApp);
TestController.addAction("test", function () {
    this.setState({
        data: {
            name: new Date().toString()
        }
    });
});

var ChildContoller = Relacx.controller(ChildComp);
ChildContoller.addAction("innerClick", function () {
    this.setState({
        innerData: {
            name: new Date().getSeconds()
        }
    });
});

window.addEventListener("load", function () {
    Relacx.render(TestApp, document.getElementById("app"));
});