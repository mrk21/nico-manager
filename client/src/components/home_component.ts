import React = require("react");
import Base = require('./base');
import EntryStore = require('../stores/entry_store');

export interface Props extends Base.Props {}
export interface State extends Base.State {
    entry?: EntryStore.State;
}

export class Spec extends Base.Spec<Props, State> {
    getInitialState() {
        return {
            isInitialized: false
        };
    }
    
    getStateFromFlux() {
        return {
            entry: this.getFlux().store('entry').state
        };
    }
    
    componentWillMount() {
        this.getFlux().actions.entry.index();
    }
    
    render() {
        if (!this.state.entry.isFetched) {
            return React.jsx(`<div></div>`);
        }
        return React.jsx(`
            <div>
                <ul ref="entryList">{this.state.entry.list.map((entry) =>
                    <li key={entry.video.video_id}>
                        <p>{entry.video.title}</p>
                        <img src={entry.video.thumbnail_url} />
                    </li>
                )}</ul>
            </div>
        `);
    }
};

export type Component = Base.Component<Props, State>;
export var Component = Base.createClass(Spec, ['entry']);
