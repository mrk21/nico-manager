import React = require("react");
import TypedReact = require("typed-react");

class Spec extends TypedReact.Component<any, any> {
    render() {
        return React.jsx(`<p>home</p>`);
    }
};

var Component = TypedReact.createClass(Spec);

export = Component;
