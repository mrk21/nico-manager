import React = require("react");
import Router = require("react-router");
import Base = require('./base');
import SessionStore = require('../stores/session_store');
import SigninFormComponent = require('./signin_form_component');
import RouteHandler = Router.RouteHandler;
import Link = Router.Link;

export interface Props extends Base.Props {}
export interface State extends Base.State {
    session?: SessionStore.State;
}

export class Spec extends Base.Spec<Props, State> {
    getStateFromFlux() {
        return {
            session: this.getFlux().store('session').state
        };
    }
    
    componentWillMount() {
        this.getFlux().actions.session.show();
    }
    
    render() {
        switch (this.state.session.auth) {
        case SessionStore.AuthState.NOT_INITIALIZED:
            return React.jsx(`<article className="app not-initialized" />`);
            
        case SessionStore.AuthState.AUTHENTICATED:
            return React.jsx(`
                <article className="app authenticated">
                    <header>
                        <h1><Link to="/">nico-manager</Link></h1>
                        <p>{this.state.session.user.nickname}</p>
                        <img src={this.state.session.user.avatar} />
                        <button ref="signout" onClick={this.onSignout}>sign out</button>
                    </header>
                    
                    <RouteHandler {...this.props} />
                </article>
            `);
            
        default:
            var SigninForm = SigninFormComponent.Component;
            return React.jsx(`
                <article className="signin">
                    <div className="signin__wrapper">
                        <h1>nico-manager</h1>
                        <SigninForm ref="signIn" {...this.props} />
                    </div>
                </article>
            `);
        }
    }
    
    onSignout() {
        this.getFlux().actions.session.destroy();
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec, ['session']);
