# react_componentController
A micro library for separately managing react components and their state

## How to use component controller


ComponentController contains two methods
1. create
2. render

__Create__ links a component with a controller
eg: ComponentController.create(COMPONENT, CONTROLLER);
Here COMPONENT is a react component and 
CONTROLLER is an object containing controll functions.

__render__ render's a react component in a provided container along with the initial state and props.
eg: ComponentController.render(COMPONENT, DOM_CONTAINER, PROPS, STATE);
Here COMPONENT is a react component,
DOM_CONTAINER is any DOM element inside whihc the component will render,
PROPS is an object of props to be passed to COMPONENT,
STATE is the initial state object for the COMPONENT.

```javascript
class TestComponent extends React.Component {
    constructor(){
        super();
    }
    render() {
        return (
            <div>
                <div onClick={that.props.controller.action("clickHandler")}>
                    {this.props.props.title}
                </div>
                <div onClick={that.props.controller.action("clickHandler")}>
                    {this.props.state.data}
                </div>
            </div>
        );
    }
};

var TestController = {
    clickHandler: function(e){
        this.component.setState({
            data: "data changed"
        });
    }
};


ComponentController.create(TestComponent, TestController);
ComponentController.render(TestComponent,document.getElementById("container"),{title:"this is the title"},{data:"this is the data"});

```
