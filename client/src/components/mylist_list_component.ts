import React = require("react");
import Router = require('react-router');
import Base = require('./base');
import MylistStore = require('../stores/mylist_store');
import Link = Router.Link;

export interface Props extends Base.Props {}
export interface State extends Base.State {
    mylist: MylistStore.State;
}

export class Spec extends Base.Spec<Props, State> {
    getStateFromFlux() {
        return {
            mylist: this.getFlux().store('mylist').state
        };
    }
    
    componentWillMount() {
        this.getFlux().actions.mylist.index();
    }
    
    render() {
        var that = this;
        
        if (!this.state.mylist.isFetched) {
            return React.jsx(`<nav />`);
        }
        return React.jsx(`
            <nav className="l-entry__mylists">
                <header className="l-entry__group">
                    <h3>mylists</h3>
                    <p className="l-entry__group-count">{this.state.mylist.list.length}</p>
                </header>
                
                <ul className="c-mylist-list" ref="mylistList">{this.state.mylist.list.map((mylist) =>
                    <li className="c-mylist-list__list-item" key={mylist.group_id} title={mylist.name}>
                        <Link to="mylist_entries" params={{group_id: mylist.group_id}}>
                            <p className="c-mylist-list__name">{mylist.name}</p>
                            <p className="c-mylist-list__count">{mylist.count}</p>
                        </Link>
                    </li>
                )}</ul>
            </nav>
        `);
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec, ['mylist']);
