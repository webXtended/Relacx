"use strict";

var getId = function () {
    var id = 0;
    return function () {
        return id++;
    };
}();

var AddTodoController = Relacx.controller(AddTodo);
AddTodoController.addAction("add", function () {
    var value = this.getState().value;
    this.action("TODO_ADDED", value)();
});
AddTodoController.addAction("changeAction", function (e) {
    var text = e.target.value;
    this.setState({
        value: text
    });
});
AddTodoController.addAction("onKeyPress", function (e) {
    if (e.charCode === 13) {
        var value = this.getState().value;
        this.action("TODO_ADDED", value)();
    }
});

//AddTodoController.addAction("addTodo", function(todo){
//    this.setState({
//        value: ""
//    });
//    Relacx.broadcastAction("TODO_ADDED", todo);
//});

AddTodoController.addBroadcastAction("TODO_ADDED", function (todo) {
    this.setState({
        value: ""
    });
    return todo;
});

var TodoListController = Relacx.controller(TodoList);
TodoListController.addActionListener("TODO_ADDED", function (action, data) {
    var list = this.getState().list;
    list = list.slice();
    list.push({
        todoItem: data,
        id: getId()
    });
    this.setState({
        list: list
    });
});
TodoListController.addActionListener("TODO_DELETED", function (action, id) {
    var list = this.getState().list;
    list = list.slice();

    var index = list.reduce(function (acc, item, index) {
        if (item.id === id) {
            return index;
        }
        return acc;
    }, 0);

    list.splice(index, 1);
    this.setState({
        list: list
    });
});

var ToDoItemController = Relacx.controller(TodoItem);
ToDoItemController.addAction("delete", function (id) {
    Relacx.broadcastAction("TODO_DELETED", id);
});

var TodoNotificationController = Relacx.controller(TodoNotification);
TodoNotificationController.addActionListener(["TODO_ADDED", "TODO_DELETED"], function (action, data) {
    var msg = "";

    switch (action) {
        case "TODO_ADDED":
            msg = "New todo added.";
            break;
        case "TODO_DELETED":
            msg = "Todo Deleted";
            break;
    }

    this.setState({
        notification: msg
    });

    setTimeout(function () {
        return Relacx.broadcastAction("REMOVE_NOTIFICATION");
    }, 3000);
});

TodoNotificationController.addActionListener("REMOVE_NOTIFICATION", function () {
    this.setState({
        notification: ""
    });
});

window.addEventListener("load", function () {
    var appState = {
        addTodo: { value: "" },
        todoList: { list: [] },
        notification: { notification: "" }
    };

    Relacx.render(TodoApp, document.getElementById("app"), {
        state: appState
    });
});