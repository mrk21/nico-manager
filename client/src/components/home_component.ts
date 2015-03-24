import React = require("react");
import Router = require('react-router');
import Base = require('./base');
import EntryStore = require('../stores/entry_store');
import TagStore = require('../stores/tag_store');
import Link = Router.Link;

export interface Props extends Base.Props {}
export interface State extends Base.State {
    entry?: EntryStore.State;
    tag?: TagStore.State;
    path?: string;
}

export class Spec extends Base.Spec<Props, State> {
    getInitialState() {
        return {
            path: this.getPath()
        };
    }
    
    getStateFromFlux() {
        return {
            entry: this.getFlux().store('entry').state,
            tag: this.getFlux().store('tag').state
        };
    }
    
    componentWillMount() {
        this.updateEntries();
        this.getFlux().actions.tag.index();
    }
    
    componentDidUpdate() {
        if (this.getPath() != this.state.path) {
            this.updateEntries();
            this.setState({path: this.getPath()});
        }
    }
    
    updateEntries() {
        if (this.isActive('tag_entries')) {
            this.getFlux().actions.tag.entry((<any>this.getParams()).name);
        }
        else {
            this.getFlux().actions.entry.index();
        }
    }
    
    render() {
        if (!this.state.entry.isFetched || !this.state.tag.isFetched) {
            return React.jsx(`<article />`);
        }
        return React.jsx(`
            <article>
                <ul ref="tagList">{this.state.tag.list.map((tag) =>
                    <li key={tag.name}>
                        <p><Link to="tag_entries" params={{name: tag.name}}>{tag.name}</Link></p>
                        <p>{tag.count}</p>
                    </li>
                )}</ul>
                
                <ul ref="entryList">{this.state.entry.list.map((entry) =>
                    <li key={[entry.group_id, entry.item_id].join('-')}>
                        <p>{entry.video.title}</p>
                        <img src={entry.video.thumbnail_url} />
                    </li>
                )}</ul>
            </article>
        `);
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec, ['entry','tag']);
