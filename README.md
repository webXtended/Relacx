# react_componentController
A micro library for separately managing react components and their state

## How to use component controller


ComponentController contains three methods
1. create
2. render
3. component

__Create__ links a component with a controller
eg: ComponentController.create(COMPONENT, CONTROLLER);
Here COMPONENT is a react component and 
CONTROLLER is an object containing controll functions.

__render__ render's a react component in a provided container along with the initial state and props.
eg: ComponentController.render(COMPONENT, DOM_CONTAINER, PROPS, STATE, CALLBACK);
Here COMPONENT is a react component,
DOM_CONTAINER is any DOM element inside whihc the component will render,
PROPS is an object of props to be passed to COMPONENT,
STATE is the initial state object for the COMPONENT,
CALLBACK will take a function and return the instance of controller created for the COMPONENT

__component__ returns a react component to be placed within JSX for renderring.
eg: ComponentController.component(COMPONENT, PROPS, STATE, PARENT, CHILD);
Here COMPONENT is a react component,
PROPS is an object of props to be passed to COMPONENT,
STATE is the initial state object for the COMPONENT,
PARENT(optional) is the refrence of parent of COMPONENT 
CHILD(optional) is the id of child inside PARENT'S state

By giving PARENT AND CHILD, the state is managed by the PARENT and by skipping PARENT and CHILD, the state is independent of parent component.

```javascript
class TestComponent extends React.Component {
    constructor(){
        super();
    }
    render() {
        return (
            <div>
                <div onClick={this.props.controller.action("clickHandler")}>
                    {this.props.props.title}
                </div>
                <div onClick={this.props.controller.action("clickHandler")}>
                    {this.props.state.data}
                </div>
            </div>
        );
    }
};

var TestController = {
    clickHandler: function(e){
        this.setState({
            data: "data changed"
        });
    }
};


ComponentController.create(TestComponent, TestController);
ComponentController.render(TestComponent,document.getElementById("container"),{title:"this is the title"},{data:"this is the data"});

```

For using a component inside a parent
```javascript
class Outer extends React.Component {
    render() {
        var that = this;
        var list = this.props.state.list.map(function (item, index) {
            var key = that.props.state.list[index].key || index;
            key = index + new Date().getMilliseconds();
            that.props.state.list[index].key = key;
            return (
                ComponentController.component(Inner, {key:key}, item, that, "list."+index)
            );
        });
        return (
            <div>
                {list}
            </div>
        )
    }
}

class Inner extends React.Component {
    render() {
        return (
            <div onClick={this.props.controller.action("innerClick")}>
                {this.props.state.name}
            </div>
        )
    }
}

var data = [
    {
        name: "a"
    },
    {
        name: "b"
    },
    {
        name: "c"
    }
];


var OuterController = {
    render: function (list) {
        this.setState({list: list});
    }
};

var InnerController = {
    innerClick: function () {
        this.setState({
            name: "c1"
        });
    }
};

ComponentController.create(Outer, OuterController);
ComponentController.create(Inner, InnerController);

ComponentController.render(Outer, document.getElementById("container"),
    {}, {list: data}, function(controller){
        window.outerController1 = controller
    });
```

