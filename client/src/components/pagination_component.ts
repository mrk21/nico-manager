import React = require("react");
import Router = require("react-router");
import Base = require('./base');
import Link = Router.Link;
import Api = require('../api');

export interface Props extends Base.Props {
    total: number;
    perPage: number;
    currentPage: number;
    getLinkProps: (page: number) => {
        to: string;
        params: any;
        query: any;
    };
}
export interface State extends Base.State {}

export class Spec extends Base.Spec<Props, State> {
    render() {
        var pageNum = Math.ceil(1.0 * this.props.total / this.props.perPage);
        var links: any[] = [];
        
        for (var page = 1; page <= pageNum; page++) {
            var stateClassName = '';
            if (page === this.props.currentPage) {
                stateClassName = 'is-active';
            }
            links.push(React.jsx(`
                <li key={page} ref={'link.'+ page} className={'c-pagination__page-list-item '+ stateClassName}>
                    <Link {...this.props.getLinkProps(page)}>{page}</Link>
                </li>
            `));
        }
        
        return React.jsx(`
            <nav className="c-pagination">
                <ul className="c-pagination__page-list">{links}</ul>
            </nav>
        `);
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec);
