import request = require('superagent');
import Action = require('./base');
import Api = require('../api');

export class Index extends Action.Base<Api.MylistListItem[] | Api.Message> {
    handler() {
        request
            .get('/api/mylists')
            .end((res: request.Response) => {
                if (res.error) {
                    this.dispatch('session:unset', JSON.parse(res.text));
                }
                else {
                    this.dispatch('mylist:set', JSON.parse(res.text));
                }
            })
        ;
    }
}

export class Entry extends Action.Base<Api.EntryListItem[] | Api.Message> {
    handler(groupId: number) {
        request
            .get(`/api/mylists/${groupId}/entries`)
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
