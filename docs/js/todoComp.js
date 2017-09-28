"use strict";

var TodoApp = function (_React$Component) {
    babelHelpers.inherits(TodoApp, _React$Component);

    function TodoApp() {
        babelHelpers.classCallCheck(this, TodoApp);
        return babelHelpers.possibleConstructorReturn(this, (TodoApp.__proto__ || Object.getPrototypeOf(TodoApp)).apply(this, arguments));
    }

    babelHelpers.createClass(TodoApp, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "todoApp" },
                React.createElement(
                    "div",
                    { className: "addSection" },
                    Relacx.component(AddTodo, {
                        state: this.props.state.addTodo,
                        parent: this,
                        childPath: "addTodo"
                    })
                ),
                React.createElement(
                    "div",
                    { className: "listSection" },
                    Relacx.component(TodoList, {
                        state: this.props.state.todoList,
                        parent: this,
                        childPath: "todoList"
                    })
                ),
                React.createElement(
                    "div",
                    { className: "notificationSection" },
                    Relacx.component(TodoNotification, {
                        state: this.props.state.notification,
                        parent: this,
                        childPath: "notification"
                    })
                )
            );
        }
    }]);
    return TodoApp;
}(React.Component);

var AddTodo = function (_React$Component2) {
    babelHelpers.inherits(AddTodo, _React$Component2);

    function AddTodo() {
        babelHelpers.classCallCheck(this, AddTodo);
        return babelHelpers.possibleConstructorReturn(this, (AddTodo.__proto__ || Object.getPrototypeOf(AddTodo)).apply(this, arguments));
    }

    babelHelpers.createClass(AddTodo, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "addContiner" },
                React.createElement("input", { className: "addInput",
                    placeholder: "Add Todo",
                    value: this.props.state.value,
                    onKeyPress: this.props.controller.action("onKeyPress"),
                    onChange: this.props.controller.action("changeAction") }),
                React.createElement(
                    "button",
                    { className: "addButton",
                        onClick: this.props.controller.action("add") },
                    "Add Todo"
                )
            );
        }
    }]);
    return AddTodo;
}(React.Component);

var TodoList = function (_React$Component3) {
    babelHelpers.inherits(TodoList, _React$Component3);

    function TodoList() {
        babelHelpers.classCallCheck(this, TodoList);
        return babelHelpers.possibleConstructorReturn(this, (TodoList.__proto__ || Object.getPrototypeOf(TodoList)).apply(this, arguments));
    }

    babelHelpers.createClass(TodoList, [{
        key: "getTodoList",
        value: function getTodoList() {
            var that = this;
            return (this.props.state.list || []).map(function (item, index) {
                return Relacx.component(TodoItem, {
                    props: item,
                    key: item.id,
                    parent: that,
                    childPath: "todoList." + index
                });
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                this.getTodoList()
            );
        }
    }]);
    return TodoList;
}(React.Component);

var TodoItem = function (_React$Component4) {
    babelHelpers.inherits(TodoItem, _React$Component4);

    function TodoItem() {
        babelHelpers.classCallCheck(this, TodoItem);
        return babelHelpers.possibleConstructorReturn(this, (TodoItem.__proto__ || Object.getPrototypeOf(TodoItem)).apply(this, arguments));
    }

    babelHelpers.createClass(TodoItem, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "todoItem" },
                React.createElement(
                    "div",
                    { className: "removeText" },
                    this.props.todoItem
                ),
                React.createElement(
                    "div",
                    { className: "todoCross",
                        onClick: this.props.controller.action("delete", this.props.id) },
                    "X"
                )
            );
        }
    }]);
    return TodoItem;
}(React.Component);

var TodoNotification = function (_React$Component5) {
    babelHelpers.inherits(TodoNotification, _React$Component5);

    function TodoNotification() {
        babelHelpers.classCallCheck(this, TodoNotification);
        return babelHelpers.possibleConstructorReturn(this, (TodoNotification.__proto__ || Object.getPrototypeOf(TodoNotification)).apply(this, arguments));
    }

    babelHelpers.createClass(TodoNotification, [{
        key: "render",
        value: function render() {
            if (this.props.state.notification) {
                return React.createElement(
                    "div",
                    { className: "notificationContainer" },
                    React.createElement(
                        "span",
                        { className: "notificationText" },
                        this.props.state.notification
                    )
                );
            } else {
                return false;
            }
        }
    }]);
    return TodoNotification;
}(React.Component);