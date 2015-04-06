import React = require("react");
import Router = require('react-router');
import Base = require('./base');
import TagStore = require('../stores/tag_store');
import Link = Router.Link;

export interface Props extends Base.Props {}
export interface State extends Base.State {
    tag: TagStore.State;
}

export class Spec extends Base.Spec<Props, State> {
    getStateFromFlux() {
        return {
            tag: this.getFlux().store('tag').state
        };
    }
    
    componentWillMount() {
        this.getFlux().actions.tag.index();
    }
    
    render() {
        var that = this;
        
        if (!this.state.tag.isFetched) {
            return React.jsx(`<nav />`);
        }
        return React.jsx(`
            <nav className="l-entry__tags">
                <header className="l-entry__group">
                    <h3>tags</h3>
                    <p className="l-entry__group-count">{this.state.tag.list.length}</p>
                </header>
                
                <ul className="c-tag-list" ref="tagList">{this.state.tag.list.map((tag) =>
                    <li className="c-tag-list__list-item" key={tag.name} title={tag.name}>
                        <Link to="tag_entries" params={{name: tag.name}}>
                            <p className="c-tag-list__name">{tag.name}</p>
                            <p className="c-tag-list__count">{tag.count}</p>
                        </Link>
                    </li>
                )}</ul>
            </nav>
        `);
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec, ['tag']);
