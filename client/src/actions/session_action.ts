import request = require('superagent');
import Action = require('./base');
import Api = require('../api');

export class Show extends Action.Base<any> {
    handler() {
        request
            .get('/api/session')
            .end((res: request.Response) => {
                if (res.error) {
                    this.dispatch('session:unset', JSON.parse(res.text));
                }
                else {
                    this.dispatch('session:set', JSON.parse(res.text));
                }
            })
        ;
    }
}

export class Create extends Action.Base<Api.Session | Api.Message> {
    handler(params: Api.SessionAuth) {
        request
            .post('/api/session')
            .send({auth: params})
            .end((res: request.Response) => {
                if (res.error) {
                    this.dispatch('session:invalid', JSON.parse(res.text));
                }
                else {
                    this.dispatch('session:set', JSON.parse(res.text));
                }
            })
        ;
    }
}

export class Destroy extends Action.Base<Api.Message> {
    handler() {
        request
            .del('/api/session')
            .end((res: request.Response) => this.dispatch('session:unset', JSON.parse(res.text)))
        ;
    }
}
