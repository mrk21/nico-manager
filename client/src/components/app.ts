import React = require("react");
import TypedReact = require("typed-react");
import Router = require("react-router");
import RouteHandler = Router.RouteHandler;

class Spec extends TypedReact.Component<any, any> {
    render() {
        return React.jsx(`
            <div>
                <h1>nico-manager</h1>
                <RouteHandler {...this.props} />
            </div>
        `);
    }
};

var Component = TypedReact.createClass(Spec);

export = Component;
