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
            var linkProps = this.props.getLinkProps(page);
            links.push(React.jsx(`
                <li key={page} ref={'link.'+ page}>
                    <Link to={linkProps.to} params={linkProps.params} query={linkProps.query}>{page}</Link>
                </li>
            `));
        }
        
        return React.jsx(`
            <nav>
                <ul>{links}</ul>
            </nav>
        `);
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec);
