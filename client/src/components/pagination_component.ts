import React = require("react");
import Router = require("react-router");
import Base = require('./base');
import Link = Router.Link;
import Api = require('../api');

export interface Props extends Base.Props {
    total: number;
    perPage: number;
    currentPage: number;
    maxLinkCount: number;
    getLinkProps: (page: number) => {
        to: string;
        params: any;
        query: any;
    };
}
export interface State extends Base.State {}

export class Spec extends Base.Spec<Props, State> {
    render() {
        var links: any[] = [];
        
        this.getDisplayLinks().forEach((page) => {
            var stateClassName = page === this.props.currentPage ? 'is-active' : '';
            
            links.push(React.jsx(`
                <li key={page} ref={'link.'+ page} className={'c-pagination__page-list-item '+ stateClassName}>
                    <Link {...this.props.getLinkProps(page)}>{page}</Link>
                </li>
            `));
        });
        
        return React.jsx(`
            <nav className="c-pagination">
                <Link className="c-pagination__to-first" {...this.props.getLinkProps(1)}>first page</Link>
                <Link className="c-pagination__to-previous" {...this.props.getLinkProps(this.getPreviousPage())}>previous page</Link>
                
                <ul className="c-pagination__page-list">{links}</ul>
                
                <Link className="c-pagination__to-next" {...this.props.getLinkProps(this.getNextPage())}>next page</Link>
                <Link className="c-pagination__to-last" {...this.props.getLinkProps(this.getTotalPageCount())}>last page</Link>
            </nav>
        `);
    }
    
    private getTotalPageCount() {
        return Math.ceil(1.0 * this.props.total / this.props.perPage);
    }
    
    private getPreviousPage() {
        var result = this.props.currentPage - 1;
        if (result < 1) return 1;
        return result;
    }
    
    private getNextPage() {
        var result = this.props.currentPage + 1;
        if (result > this.getTotalPageCount()) return this.getTotalPageCount();
        return result;
    }
    
    private getDisplayLinks() {
        var result: number[] = [];
        var pageNum = this.getTotalPageCount();
        var since = 1;
        var until = pageNum;
        
        if (pageNum > this.props.maxLinkCount) {
            var beforeLinkCount = Math.ceil(1.0 * this.props.maxLinkCount / 2) - 1;
            var afterLinkCount = this.props.maxLinkCount - beforeLinkCount - 1;
            
            since = this.props.currentPage - beforeLinkCount;
            until = this.props.currentPage + afterLinkCount;
            
            if (since < 1) {
                since = 1;
                until = this.props.maxLinkCount;
            }
            else if (until > pageNum) {
                since = pageNum - (this.props.maxLinkCount - 1);
                until = pageNum;
            }
        }
        for (var i = since; i <= until; i++) result.push(i);
        return result;
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec);
