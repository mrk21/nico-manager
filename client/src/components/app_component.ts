import React = require("react");
import Router = require("react-router");
import Base = require('./base');
import SessionStore = require('../stores/session_store');
import RouteHandler = Router.RouteHandler;
import Link = Router.Link;

export interface Props extends Base.Props {}

export interface State extends Base.State {
    session?: SessionStore.State;
    isInitialized?: boolean
}

export class Spec extends Base.Spec<Props, State> {
    getInitialState() {
        return {
            isInitialized: false
        };
    }
    
    getStateFromFlux() {
        return {
            session: this.getFlux().store('session').state
        };
    }
    
    componentDidUpdate() {
        if (!this.state.isInitialized) {
            this.setState({isInitialized: true});
        }
    }
    
    componentDidMount() {
        this.getFlux().actions.session.show();
    }
    
    render() {
        if (!this.state.isInitialized) {
            return React.jsx(`<div></div>`);
        }
        else if (this.state.session.auth == SessionStore.AuthState.AUTHENTICATED) {
            return React.jsx(`
                <div>
                    <h1><Link to="/">nico-manager</Link></h1>
                    <p>{this.state.session.user.nickname}</p>
                    <img src={this.state.session.user.avatar} />
                    <button onClick={this.onSignout}>sign out</button>
                    <RouteHandler {...this.props} />
                </div>
            `);
        }
        else {
            return React.jsx(`
                <div>
                    <h1><Link to="/">nico-manager</Link></h1>
                    <Link to="session">sign in</Link>
                    <RouteHandler {...this.props} />
                </div>
            `);
        }
    }
    
    onSignout() {
        this.getFlux().actions.session.destroy();
    }
};

export type Component = React.CompositeComponent<Props, State>;

export var ComponentClass = Base.createClass(Spec, ['session']);
