import React = require("react");
import Base = require('./base');

export interface Props extends Base.Props {}
export interface State extends Base.State {}

export class Spec extends Base.Spec<Props, State> {
    render() {
        return React.jsx(`<p>Home</p>`);
    }
};

export type Component = React.CompositeComponent<Props, State>;

export var ComponentClass = Base.createClass(Spec);
