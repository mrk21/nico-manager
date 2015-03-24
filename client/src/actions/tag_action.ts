import request = require('superagent');
import Action = require('./base');
import Api = require('../api');

export class Index extends Action.Base<Api.TagListItem[] | Api.Message> {
    handler() {
        request
            .get('/api/tags')
            .end((res: request.Response) => {
                if (res.error) {
                    this.dispatch('session:unset', JSON.parse(res.text));
                }
                else {
                    this.dispatch('tag:set', JSON.parse(res.text));
                }
            })
        ;
    }
}

export class Entry extends Action.Base<Api.EntryListItem[] | Api.Message> {
    handler(name: string, query?: string) {
        var sendQuery: any = query ? {q: query} : {};
        
        request
            .get(`/api/tags/${name}/entries`)
            .query(sendQuery)
            .end((res: request.Response) => {
                if (res.error) {
                    this.dispatch('session:unset', JSON.parse(res.text));
                }
                else {
                    this.dispatch('entry:set', JSON.parse(res.text));
                }
            })
        ;
    }
}
