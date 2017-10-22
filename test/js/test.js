"use strict";

var CounterParent = function (_React$Component) {
    babelHelpers.inherits(CounterParent, _React$Component);

    function CounterParent() {
        babelHelpers.classCallCheck(this, CounterParent);
        return babelHelpers.possibleConstructorReturn(this, (CounterParent.__proto__ || Object.getPrototypeOf(CounterParent)).apply(this, arguments));
    }

    babelHelpers.createClass(CounterParent, [{
        key: "render",
        value: function render() {
            var counters = this.props.state.counters.map(function (item, index) {
                return Relacx.component(Counter, {
                    state: { count: 0, diff: item },
                    key: index,
                    props: {
                        key: index
                    }
                });
            });
            return React.createElement(
                "div",
                null,
                counters
            );
        }
    }]);
    return CounterParent;
}(React.Component);

var Counter = function (_React$Component2) {
    babelHelpers.inherits(Counter, _React$Component2);

    function Counter() {
        babelHelpers.classCallCheck(this, Counter);
        return babelHelpers.possibleConstructorReturn(this, (Counter.__proto__ || Object.getPrototypeOf(Counter)).apply(this, arguments));
    }

    babelHelpers.createClass(Counter, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { onClick: this.props.controller.action("showCount") },
                this.props.state.count
            );
        }
    }]);
    return Counter;
}(React.Component);

var CounterController = Relacx.controller(Counter);
CounterController.addActionListener("INCREMENT", function () {
    var state = this.getState();
    this.setState({
        count: state.count + state.diff
    });
});
CounterController.addAction("showCount", function () {
    console.log(this.getState().count);
});

Relacx.render(CounterParent, document.getElementById("app"), {
    state: { counters: [1, 3, 5, 7] },
    afterRender: function afterRender() {
        setInterval(function () {
            Relacx.broadcastAction("INCREMENT");
        }, 3000);
    }
});

// window.addEventListener("load", function(){
//    // Relacx.render(TestApp, document.getElementById("app"));
//
//     Relacx.render(WorldClock, document.getElementById("app"), {
//         state: {clocks:[
//             new Date(),
//             new Date()
//         ]}
//     });
//
// });
//