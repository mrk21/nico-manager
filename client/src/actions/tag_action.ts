import request = require('superagent');
import Action = require('./base');
import Api = require('../api');
import dispatchLoader = require('./dispatch_loader');
import EntryAction = require('./entry_action');

export class Index extends Action.Base<Api.TagListItem[] | Api.Message> {
    handler() {
        dispatchLoader(this, (done) => {
            request
                .get('/api/tags')
                .end((res: request.Response) => {
                    done();
                    
                    if (res.error) {
                        this.dispatch('session:unset', JSON.parse(res.text));
                    }
                    else {
                        this.dispatch('tag:set', JSON.parse(res.text));
                    }
                })
            ;
        });
    }
}

export class Entry extends EntryAction.IndexBase {
    handler(name: string, query?: string, range?: Api.Range) {
        this.access(`/api/tags/${name}/entries`, query, range);
    }
}
