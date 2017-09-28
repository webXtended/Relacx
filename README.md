# Relacx
A micro library for separately managing react components and their state.

#### Installation


> By Script Tag

Since Relacx is a state manager for React; it requires React.js and React-Dom.js
The current version of Relacx uses React version 15.5.4 

    <script type="text/javascript" src="react.js"></script>
    <script type="text/javascript" src="react-dom.js"></script>

Since ES6 is being used, babel is used to provide polyfill the new features of ES6.
The helpers.js is used for the same. It is available in the dist directory.

    <script type="text/javascript" src="helpers.js"></script>

Now, to use Relacx the Relacx.js file is needed, available in dist directory

    <script type="text/javascript" src="relacx.js"></script>

After this you can add your project's script files.

#####
#### Usage

The following methods are available in the library :

1. render
2. component
3. controller
4. broadcastAction

##### Usage of render function

    Relacx.render(COMPONENT, ELEMENT, OPTIONS);

| Parameter | Type | Description |
| ------ | ------ | ------ |
| COMPONENT | React Component | Any React element to be rendered. This will typically be your root element. |
| ELEMENT | DOM node | The DOM node into which COMPONENT needs to be rendered. |
| OPTIONS | JavaScript Object | 2 options can be passed into the parameter to initialize the component.|

The following options are available to pass into the component to be rendered.
* props - JavaScript Object
* state - JavaScript Object

>props

These are same as react props. Pass in a JavaScript object and use it in the component as

    this.props.PROPERTY_NAME
where PROPERTY_NAME is the any key in the passed props object.

#####
> state

The initial state of the component to be rendered. Provide a JavaScript object into this option, this object will
be available in the component as

    this.props.state.PROPERTY_NAME
where PROPERTY_NAME is the any key in the passed state object.

The state value can be changed using the setState method of the component's controller.

#####

##### Usage of component function

    Relacx.component(COMPONENT, ELEMENT, OPTIONS);


| Parameter | Type | Description |
| ------ | ------ | ------ |
| COMPONENT | React Component | Any React element to be rendered. This will typically be your root element. |
| ELEMENT | DOM node | The DOM node into which COMPONENT needs to be rendered. |
| OPTIONS | JavaScript Object | 4 options can be passed into the parameter to initialize the component.|

The following options are available to pass into the component to be rendered.
* props - JavaScript Object
* state - JavaScript Object
* parent - Reference to parent Component
* childPath - JavaScript String


#####
> props and state

They work the same way as described in the render function above.

#####
> parent

If the state of the component needs to be maintained by its parent component, then a reference of the parent
component needs to be passed along with the childPath.

By passing parent and childPath; setState method of the component will update the state of the parent.

By skipping the parent and childPath options, the component is independent of the parent's state.

#####
> childPath

This is the path of the data source for the component's state option.

i.e. the path from the parent's state to the component's state.

The path values are separated by a .(DOT)

#####

##### Usage of controller function

The controller method is used to create a controller for a React component.

    var CONTROLLER_NAME = Relacx.controller(COMPONENT);

The method accepts a React component for whihc the controller needs to be created.

In the syntax above,

CONTROLLER_NAME is any name you want to give to your controller.

COMPONENT the React component for which the controller needs to be made.


A controller can have three type of properties:

 * Action
 * BroadcastAction
 * ActionListener

> Action

Actions happening in a component can be controlled by the Action property.
Components will require event handlers like click, keyPress, submit etc. to be used,
for this purpose actions can be added to the controller.

    CONTROLLER_NAME.addAction("ACTION_NAME", FUNCTION);

Use the addAction method of the controller to add an action. The method takes 2 arguments,
* ACTION_NAME : any string to recognize the action.
* FUNCTION: a JavaScript function to be called when the action takes place

The actions are available in the component in props.controller property,

    <COMPONENT onClick={this.props.controller.action("ACTION_NAME", ARGUMENTS)}>
        SUBMIT
    </COMPONENT>


"this.props.controller.action" method is used to access an action in the controller,

The first parameter in the action method is the name of the action to be used.

Any number of comma separated arguments can be passed after the action name which will be available in the
function passed while creating the action.

#####
> BroadcastAction

BroadcastActions are the same as Actions with an additional functionality of broadcasting the result of the action to 
ActionListeners.

    CONTROLLER_NAME.addBroadcastAction("ACTION_NAME", FUNCTION);

They are used the same way as Actions are used. The return value of the BroadcastAction will be provided to ActionListeners 
listening to the "ACTION _NAME".


#####
> ActionListener

An ActionListener is used to respond to other actions. Whenever an action is triggered, the action needs to broadcast it
using the broadcast action method.

    ContentController.addActionListener([ACTION_NAMES], FUNCTION);

The addActionListener method is used to listen to actions. The method takes in two parameters:
* ACTION_NAMES: list of action name string
* FUNCTION :  a JavaScript function to be called when an action is broadcast.

read **_Usage of broadcastAction function_** for more details.



#####
##### Usage of broadcastAction function

The broadcastAction method is used to inform other actions of a triggered event.
This is an alternative to using BroadcastAction in the Controller. It can be used anywhere in your application.

    Relacx.broadcastAction("ACTION_NAME", DATA);

Whenever an action takes place and you want to inform other actions of an event, then use the
broadcastAction method to do so. Action listeners listening for the ACTION_NAME event will get triggered
and the triggered function will receive 2 parameters, the ACTION_NAME and DATA from the broadcaster.
