import React = require("react");
import Router = require('react-router');
import Base = require('./base');

import EntryStore = require('../stores/entry_store');
import MylistStore = require('../stores/mylist_store');
import TagStore = require('../stores/tag_store');
import Api = require('../api');

import SearchFormComponent = require('../components/search_form_component');
import TagListComponent = require('../components/tag_list_component');
import MylistListComponent = require('../components/mylist_list_component');
import PaginationComponent = require('../components/pagination_component');

import Link = Router.Link;
import SearchForm = SearchFormComponent.Component;
import TagList = TagListComponent.Component;
import MylistList = MylistListComponent.Component;
import Pagination = PaginationComponent.Component;

export interface Props extends Base.Props {}
export interface State extends Base.State {
    entry?: EntryStore.State;
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
            entry: this.getFlux().store('entry').state
        };
    }
    
    componentWillMount() {
        this.updateEntries();
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
        var currentPage: number = query.p-0 || 1;
        var range: Api.Range = {
            since: 20 * (currentPage - 1),
            until: 20 * (currentPage),
        };
        
        if (this.isActive('mylist_entries')) {
            this.getFlux().actions.mylist.entry(params.group_id, query.q, range);
        }
        else if (this.isActive('tag_entries')) {
            this.getFlux().actions.tag.entry(params.name, query.q, range);
        }
        else {
            this.getFlux().actions.entry.index(query.q, range);
        }
    }
    
    render() {
        var that = this;
        
        if (!this.state.entry.isFetched) {
            return React.jsx(`<article />`);
        }
        
        var query: any = this.getQuery() || {};
        var currentPage: number = query.p-0 || 1;
        var paginationProps: PaginationComponent.Props = {
            flux: this.getFlux(),
            total: this.state.entry.range.total,
            perPage: 20,
            maxLinkCount: 5,
            currentPage: currentPage,
            getLinkProps: (page: number) => {
                var query: any = this.getQuery() || {};
                query.p = page;
                
                return {
                    to: this.getPathname(),
                    params: this.getParams(),
                    query: query
                };
            }
        };
        
        return React.jsx(`
            <article className="l-entry">
                <div className="l-entry__nav">
                    <MylistList />
                    <TagList flux={this.getFlux()} limit={50} />
                </div>
                
                <section className="l-entry__entries">
                    <header className="l-entry__group">
                        <h2>entries</h2>
                        <p className="l-entry__group-count">{this.state.entry.range.total}</p>
                    </header>
                    
                    <div className="l-entry__search">
                        <SearchForm ref="searchForm" />
                    </div>
                    
                    <Pagination {...paginationProps} />
                    
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
                    
                    <Pagination {...paginationProps} />
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
export var Component = Base.createClass(Spec, ['entry']);
