import React = require("react");
import Base = require('./base');

export interface Props extends Base.Props {
    ref: string;
}
export interface State extends Base.State {
    text?: string;
    path?: string;
}

export class Spec extends Base.Spec<Props, State> {
    getInitialState() {
        return {
            text: this.getTextFromQuery(),
            path: this.getPathname()
        };
    }
    
    getTextFromQuery() {
        var query: any = this.getQuery() || {};
        return query.q || '';
    }
    
    componentDidUpdate() {
        if (this.getPathname() != this.state.path) {
            this.setState({
                text: this.getTextFromQuery(),
                path: this.getPathname()
            });
        }
    }
    
    render() {
        return React.jsx(`
            <form className="c-search-form" onSubmit={this.onSubmit}>
                <input className="c-search-form__input" type="text" placeholder="search" value={this.state.text} onChange={this.onChange} />
                <input className="c-search-form__submit" type="submit" value="search" />
            </form>
        `);
    }
    
    onChange(e: React.SyntheticEvent) {
        this.setState({text: (<HTMLInputElement>e.target).value});
    }
    
    onSubmit() {
        var query: any = this.getQuery();
        query.q = this.state.text;
        this.transitionTo(this.getPathname(), this.getParams(), query);
    }
}

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec);
