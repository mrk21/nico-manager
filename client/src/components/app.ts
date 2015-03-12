import React = require("react");
import TypedReact = require("typed-react");
import Router = require("react-router");
import RouteHandler = Router.RouteHandler;
import Fluxxor = require('fluxxor');
import SessionStore = require('../stores/session_store');
import Link = Router.Link;

interface State {
    session?: SessionStore.State;
    isInitialized?: boolean
}

class Spec extends TypedReact.Component<any, State> implements Fluxxor.FluxMixin, Fluxxor.StoreWatchMixin<State> {
    getFlux: () => Fluxxor.Flux;
    
    getInitialState() {
        return {
            isInitialized: false
        };
    }
    
    getStateFromFlux() {
        return {
            session: this.getFlux().store('SessionStore').state
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

var Component = TypedReact.createClass(Spec, [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin<State>('SessionStore')
]);

export = Component;
