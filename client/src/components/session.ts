import React = require("react");
import TypedReact = require("typed-react");
import Fluxxor = require('fluxxor');
import Router = require('react-router');
import SessionStore = require('../stores/session_store');

interface State {
    session?: SessionStore.State;
    mail?: string;
    password?: string;
}

class Spec extends TypedReact.Component<any, State> implements
    Fluxxor.FluxMixin,
    Fluxxor.StoreWatchMixin<State>,
    Router.Navigation
{
    getFlux: () => Fluxxor.Flux;
    
    makePath: (to: string, params?: {}, query?: {}) => string;
    makeHref: (to: string, params?: {}, query?: {}) => string;
    transitionTo: (to: string, params?: {}, query?: {}) => void;
    replaceWith: (to: string, params?: {}, query?: {}) => void;
    goBack: () => void;
    
    getInitialState() {
        return {};
    }
    
    getStateFromFlux() {
        return {
            session: this.getFlux().store('SessionStore').state
        };
    }
    
    componentDidMount() {
        if (this.state.session.auth == SessionStore.AuthState.AUTHENTICATED) {
            this.transitionTo("/");
        }
    }
    
    componentWillUnmount() {
        this.state.mail = null;
        this.state.password = null;
    }
    
    render() {
        if (this.state.session.auth == SessionStore.AuthState.AUTHENTICATION_FAILED) {
            var message = React.jsx(`<p>invalid</p>`);
        }
        return React.jsx(`
            <div>
                {message}
                <form onSubmit={this.onSubmit}>
                    <input type="text" value={this.state.mail} onChange={this.onChangeMail} />
                    <input type="password" value={this.state.password} onChange={this.onChangePassword} />
                    <input type="submit" value="sign in" />
                </form>
            </div>
        `);
    }
    
    onChangeMail(e: React.SyntheticEvent) {
        this.setState({mail: (<HTMLInputElement>e.target).value});
    }
    
    onChangePassword(e: React.SyntheticEvent) {
        this.setState({password: (<HTMLInputElement>e.target).value});
    }
    
    onSubmit() {
        this.getFlux().actions.session.create({
            mail: this.state.mail,
            password: this.state.password
        });
    }
};

var Component = TypedReact.createClass(Spec, [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin<State>('SessionStore'),
    Router.Navigation
]);

export = Component;
