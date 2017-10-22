class CounterParent extends React.Component{
    render(){
        var counters = this.props.state.counters.map(function(item, index){
            return Relacx.component(Counter, {
                state:{count:0,diff:item},
                key: index,
                props: {
                    key: index
                }
            });
        });
        return(
            <div>{counters}</div>
        )
    }
}

class Counter extends React.Component{
    render(){
        return(
            <div onClick={this.props.controller.action("showCount")}>
                {this.props.state.count}
            </div>)
    }
}


var CounterController = Relacx.controller(Counter);
CounterController.addActionListener("INCREMENT", function(){
    var state = this.getState();
    this.setState({
        count: state.count + state.diff
    })
});
CounterController.addAction("showCount", function(){
    console.log(this.getState().count);
});

Relacx.render(CounterParent, document.getElementById("app"), {
    state: {counters:[1,3,5,7]},
    afterRender: function(){
        setInterval(function(){
            Relacx.broadcastAction("INCREMENT")
        },3000);
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


