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
        return {
            mail: '',
            password: ''
        };
    }
    
    getStateFromFlux() {
        return {
            session: this.getFlux().store('session').state
        };
    }
    
    componentWillUnmount() {
        this.state.mail = '';
        this.state.password = '';
    }
    
    render() {
        if (this.state.session.auth == SessionStore.AuthState.AUTHENTICATION_FAILED) {
            var errorMessage = React.jsx(`
                <p className="signin__error" ref="errorMessage">sign-in failed</p>
            `);
        }
        return React.jsx(`
            <form className="signin__form" onSubmit={this.onSubmit}>
                {errorMessage}
                <input type="text"
                    placeholder="mail"
                    value={this.state.mail}
                    onChange={this.onChangeMail} />
                <input type="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.onChangePassword} />
                <input type="submit" value="sign in" />
            </form>
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
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec, ['session']);
