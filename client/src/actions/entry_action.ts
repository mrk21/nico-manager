import request = require('superagent');
import Action = require('./base');
import Api = require('../api');

export class Index extends Action.Base<Api.EntryListItem[]> {
    handler(query?: string) {
        var sendQuery: any = query ? {q: query} : {};
        
        request
            .get('/api/entries')
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
