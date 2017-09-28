class TodoApp extends React.Component{
    render(){
        return(
            <div id="todoApp">
                <div className="addSection">
                    {Relacx.component(AddTodo,{
                        state:this.props.state.addTodo,
                        parent: this,
                        childPath: "addTodo"
                    })}
                </div>
                <div className="listSection">
                    {Relacx.component(TodoList, {
                        state: this.props.state.todoList,
                        parent: this,
                        childPath: "todoList"
                    })}
                </div>
                <div className="notificationSection">
                    {Relacx.component(TodoNotification,{
                        state:this.props.state.notification,
                        parent: this,
                        childPath: "notification"
                    })}
                </div>
            </div>
        );
    }
}

class AddTodo extends React.Component{
    render(){
        return(
            <div className="addContiner">
                <input className="addInput"
                       placeholder="Add Todo"
                       value={this.props.state.value}
                       onKeyPress={this.props.controller.action("onKeyPress")}
                       onChange={this.props.controller.action("changeAction")}/>
                <button className="addButton"
                        onClick={this.props.controller.action("add")}>
                Add Todo
                </button>
            </div>
        )
    }
}

class TodoList extends React.Component{
    getTodoList(){
        var that = this;
        return (this.props.state.list || []).map(function(item, index){
            return(
                Relacx.component(TodoItem,{
                    props: item,
                    key: item.id,
                    parent: that,
                    childPath: "todoList."+index
                })
            )
        });
    }

    render(){
        return(
            <div>{this.getTodoList()}</div>
        )
    }
}

class TodoItem extends React.Component{
    render(){
        return(
            <div className="todoItem">
                <div className="removeText">{this.props.todoItem}</div>
                <div className="todoCross"
                     onClick={this.props.controller.action("delete",this.props.id)}>
                     X
                </div>
            </div>
        );
    }
}

class TodoNotification extends React.Component{
    render(){
        if(this.props.state.notification){
            return (
                <div className="notificationContainer">
                    <span className="notificationText">
                    {this.props.state.notification}
                    </span>
                </div>
            )
        }else{
            return false;
        }
    }
}