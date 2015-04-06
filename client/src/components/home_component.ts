import React = require("react");
import Router = require('react-router');
import Base = require('./base');
import EntryStore = require('../stores/entry_store');
import MylistStore = require('../stores/mylist_store');
import TagStore = require('../stores/tag_store');
import SearchFormComponent = require('../components/search_form_component');
import TagListComponent = require('../components/tag_list_component');
import Link = Router.Link;
import SearchForm = SearchFormComponent.Component;
import TagList = TagListComponent.Component;

export interface Props extends Base.Props {}
export interface State extends Base.State {
    entry?: EntryStore.State;
    mylist?: MylistStore.State;
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
            mylist: this.getFlux().store('mylist').state,
        };
    }
    
    componentWillMount() {
        this.updateEntries();
        this.getFlux().actions.mylist.index();
    }
    
    componentDidUpdate() {
        if (this.getPath() != this.state.path) {
            this.updateEntries();
            this.setState({path: this.getPath()});
        }
    }
    
    updateEntries() {
        var params: any = this.getParams() || {};
        var query: any = this.getQuery() || {};
        
        if (this.isActive('mylist_entries')) {
            this.getFlux().actions.mylist.entry(params.group_id, query.q);
        }
        else if (this.isActive('tag_entries')) {
            this.getFlux().actions.tag.entry(params.name, query.q);
        }
        else {
            this.getFlux().actions.entry.index(query.q);
        }
    }
    
    render() {
        var that = this;
        
        if (!this.state.entry.isFetched || !this.state.mylist.isFetched) {
            return React.jsx(`<article />`);
        }
        return React.jsx(`
            <article className="l-entry">
                <div className="l-entry__nav">
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
                    
                    <TagList />
                </div>
                
                <section className="l-entry__entries">
                    <header className="l-entry__group">
                        <h2>entries</h2>
                        <p className="l-entry__group-count">{this.state.entry.list.length}</p>
                    </header>
                    
                    <div className="l-entry__search">
                        <SearchForm ref="searchForm" />
                    </div>
                    
                    <ul className="c-entry-list" ref="entryList">{this.state.entry.list.map((entry) =>
                        <li className="c-entry-list__list-item" key={[entry.mylist.group_id, entry.entry.item_id].join('-')} title={entry.video.title}>
                            <a href={'http://www.nicovideo.jp/watch/' + entry.video.watch_id}>
                                <p className="c-entry-list__title">{entry.video.title}</p>
                            </a>
                            
                            <div className="c-entry-list__wrapper">
                                <img className="c-entry-list__thumbnail" src={entry.video.thumbnail_url} />
                                <p className="c-entry-list__description" title={entry.video.description}>{that.elliptString(entry.video.description, 100)}</p>
                            </div>
                        </li>
                    )}</ul>
                </section>
            </article>
        `);
    }
    
    elliptString(str: string, limit: number) {
        str = str || '';
        if (str.length > limit) {
            return str.slice(0,limit) + '...';
        }
        return str;
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec, ['entry','mylist']);
