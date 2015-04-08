import React = require("react");
import Router = require("react-router");
import Base = require('./base');
import SessionStore = require('../stores/session_store');
import SigninFormComponent = require('./signin_form_component');
import LoaderComponent = require('./loader_component');
import RouteHandler = Router.RouteHandler;
import Link = Router.Link;
import SigninForm = SigninFormComponent.Component;
import Loader = LoaderComponent.Component;

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
            return React.jsx(`<article />`);
            
        case SessionStore.AuthState.AUTHENTICATED:
            return React.jsx(`
                <article className="l-page">
                    <header className="l-page__header">
                        <div className="l-page__header-content">
                            <h1><Link to="/">nico-manager</Link></h1>
                            <div className="l-page__user">
                                <section className="l-page__user-info">
                                    <img src={this.state.session.user.avatar} />
                                    <p>{this.state.session.user.nickname}</p>
                                </section>
                                <menu className="l-page__user-menu">
                                   <li><button ref="signOut" onClick={this.onSignout}>sign out</button></li>
                                </menu>
                            </div>
                        </div>
                    </header>
                    
                    <section className="l-page__body">
                        <RouteHandler {...this.props} />
                    </section>
                    
                    <Loader />
                </article>
            `);
            
        default:
            return React.jsx(`
                <article className="l-signin">
                    <div className="l-signin__wrapper">
                        <h1>nico-manager</h1>
                        <SigninForm ref="signIn" {...this.props} />
                    </div>
                    <Loader />
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
