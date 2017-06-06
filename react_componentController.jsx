var ComponentController = (function () {
    var controllers = {};

    class BaseComponent extends React.Component{
        constructor(props){
            super();
        }
        componentWillMount() {
            this.props.init.prototype = this.props.properties;
            var controller = new this.props.init(this);
            this.controller = controller;
            this.setState(this.props.state);
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

    function getBaseController() {
        function Controller(context) {
            this.component = context;
            var that = this;
            this.action = function(name){
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                var fn = Function.prototype.bind.apply(that[name],[that].concat(args));
                return fn;
            }
        }
        return Controller;
    }

    function render(Component, container, props, state) {
        var Controller = getBaseController();
        var properties = controllers[Component.name]  || {};

        ReactDOM.render(
            <BaseComponent init={Controller}
                           comp={Component}
                           props={props}
                           properties={properties || {}}
                           state={state}>
            </BaseComponent>,
            container);
    }

    function create(component, controller) {
        component = component.name || component;
        controllers[component] = controller;
    }

    return {
        render: render,
        create: create
    }
})();
