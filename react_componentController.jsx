var ComponentController = (function () {
    var controllers = {};
    class BaseComponent extends React.Component{
        constructor(){
            super();
        }
        componentWillMount() {
            this.props.init.prototype = this.props.properties;
            var controller = new this.props.init(this);
            this.controller = controller;
            this.setState(this.props.state);
            if(this.props.callback){
                this.props.callback(controller);
            }
        }
        render() {
            var Element = this.props.comp;
            return (
                <Element state={this.state}
                         controller={this.controller}
                         props={this.props.props}
                         properties={this.props.properties}/>
            );
        }
    };

    function setItemFromObjectKey(obj,key,item){
        var key = key.split(".");
        var data = obj;
        var prop;
        for(var i=1;i<key.length-1;i++){
                prop = key[i];
                data=data[prop];
        }
        data[key.pop()] = item;
        return obj;
    }

    function getBaseController() {
        function Controller(component) {
            var that = this;
            this.childKeys="root";
            this.action = function(name){
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                var fn = Function.prototype.bind.apply(that[name],[that].concat(args));
                return fn;
            };
            this.setState = function(obj,key){
                if(key){
                    var data = setItemFromObjectKey(component.state,key, obj);
                    data = JSON.parse(JSON.stringify(data));
                    component.setState(data);
                }else{
                    component.setState(obj);
                }
            };
            this.getState = function(){
                return component.state;
            }
        }
        return Controller;
    }

    function getChildController(parent, child){
        function Controller() {
            var that = this;
            var key = child;
            this.action = function(name){
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                var fn = Function.prototype.bind.apply(that[name],[that].concat(args));
                return fn;
            };
            this.setState = function(obj){
                var keyList = parent.props.controller.childKeys;
                parent.props.controller.setState(obj, [keyList,key].join("."));
            };
        }
        return Controller;
    }


    function render(Component, container, props, state, callback) {
        var Controller = getBaseController();
        var properties = controllers[Component.name]  || {};

        var baseComponent =  <BaseComponent init={Controller}
                                            callback={callback}
                                            comp={Component}
                                            props={props}
                                            properties={properties || {}}
                                            state={state}>
                            </BaseComponent>

        if(container){
            ReactDOM.render(baseComponent,container);
        }else{
            return baseComponent;
        }
    }

    function component(Comp, props, state, parent, child){
        var Controller = parent&&child?getChildController(parent, child):getBaseController();
        var properties = controllers[Comp.name]  || {};

        var baseComponent =  <BaseComponent init={Controller}
                                            comp={Comp}
                                            key={props.key}
                                            props={props}
                                            properties={properties || {}}
                                            state={state}>
                             </BaseComponent>

        return baseComponent;
    }

    function create(component, controller) {
        component = component.name || component;
        controllers[component] = controller;
    }

    return {
        render: render,
        component: component,
        create: create
    }
})();

