import request = require('superagent');
import Action = require('./base');
import Api = require('../api');
import dispatchLoader = require('./dispatch_loader');

export class Show extends Action.Base<Api.Session | Api.Message> {
    handler() {
        dispatchLoader(this, (done) => {
            request
                .get('/api/session')
                .end((res: request.Response) => {
                    done();
                    
                    if (res.error) {
                        this.dispatch('session:unset', JSON.parse(res.text));
                    }
                    else {
                        this.dispatch('session:set', JSON.parse(res.text));
                    }
                })
            ;
        });
    }
}

export class Create extends Action.Base<Api.Session | Api.Message> {
    handler(params: Api.SessionAuth) {
        dispatchLoader(this, (done) => {
            request
                .post('/api/session')
                .send({auth: params})
                .end((res: request.Response) => {
                    done();
                    
                    if (res.error) {
                        this.dispatch('session:invalid', JSON.parse(res.text));
                    }
                    else {
                        this.dispatch('session:set', JSON.parse(res.text));
                    }
                })
            ;
        });
    }
}

export class Destroy extends Action.Base<Api.Message> {
    handler() {
        dispatchLoader(this, (done) => {
            request
                .del('/api/session')
                .end((res: request.Response) => {
                    done();
                    
                    this.dispatch('session:unset', JSON.parse(res.text));
                })
            ;
        });
    }
}
