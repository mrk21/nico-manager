import React = require("react");
import Base = require('./base');
import SessionStore = require('../stores/session_store');

export interface Props extends Base.Props {}

export interface State extends Base.State {
    session?: SessionStore.State;
    mail?: string;
    password?: string;
}

export class Spec extends Base.Spec<Props, State> {
    getInitialState() {
        return {};
    }
    
    getStateFromFlux() {
        return {
            session: this.getFlux().store('session').state
        };
    }
    
    componentWillUnmount() {
        this.state.mail = null;
        this.state.password = null;
    }
    
    render() {
        if (this.state.session.auth == SessionStore.AuthState.AUTHENTICATED) {
            this.transitionTo("/");
        }
        if (this.state.session.auth == SessionStore.AuthState.AUTHENTICATION_FAILED) {
            var message = 'invalid';
        }
        return React.jsx(`
            <div>
                <p ref="errorMessage">{message}</p>
                <form ref="form" onSubmit={this.onSubmit}>
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

export type Component = React.CompositeComponent<Props, State>;

export var ComponentClass = Base.createClass(Spec, ['session']);
