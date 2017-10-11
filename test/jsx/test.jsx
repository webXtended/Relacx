class TestApp extends React.Component{
    render(){
        var name = "",
        childComp = "";
        if(this.props.state.data && this.props.state.data.name){
           name = this.props.state.name;
           childComp = Relacx.component(ChildComp, {
              parent: this,
              state:(this.props.state.child?this.props.state.child.data : {}),
              childPath: "child.data"
           });
        }


        return(
            <div>
                {name}
                <button onClick={this.props.controller.action("test")}>Click Me</button>
                {childComp}
            </div>
        )
    }
}


class ChildComp extends React.Component{
    render(){
        return(
            <div>{this.props.state.innerData?this.props.state.innerData.name:"no data"}
             <button onClick={this.props.controller.action("innerClick")}>CLICK</button>
            </div>
        )
    }
}


var TestController = Relacx.controller(TestApp);
TestController.addAction("test", function(){
   this.setState({
       data:{
           name: new Date().toString()
       }
   })
});


var ChildContoller = Relacx.controller(ChildComp);
ChildContoller.addAction("innerClick", function(){
   this.setState({
       innerData:{
           name: new Date().getSeconds()
       }
   })
});

window.addEventListener("load", function(){
   Relacx.render(TestApp, document.getElementById("app"));
});