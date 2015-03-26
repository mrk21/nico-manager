import React = require("react");
import Base = require('./base');
import AppStore = require('../stores/app_store');

export interface Props extends Base.Props {}
export interface State extends Base.State {
    app?: AppStore.State;
}

export class Spec extends Base.Spec<Props, State> {
    getStateFromFlux() {
        return {
            app: this.getFlux().store('app').state
        };
    }
    
    render() {
        var state = this.state.app.loading ? 'is-active' : '';
        return React.jsx(`
            <div className={'c-loader '+ state}>
                <div className="throbber" />
            </div>
        `);
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec, ['app']);
