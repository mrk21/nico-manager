import request = require('superagent');
import Action = require('./base');
import Api = require('../api');
import dispatchLoader = require('./dispatch_loader');

export interface Data {
    records: Api.EntryListItem[];
    range?: Api.Range;
}

export class Index extends Action.Base<Data | Api.Message> {
    handler(query?: string, range?: Api.Range) {
        var sendQuery: any = query ? {q: query} : {};
        
        dispatchLoader(this, (done) => {
            var req = request.get('/api/entries').query(sendQuery);
            
            if (range) {
                req.set('Range', `records=${range.since}-${range.until}`);
            }
            
            req.end((res: request.Response) => {
                done();
                
                if (res.error) {
                    this.dispatch('session:unset', JSON.parse(res.text));
                }
                else {
                    if (res.status == 200) {
                        this.dispatch('entry:set', {
                            records: JSON.parse(res.text)
                        });
                    }
                    else {
                        var rangeHeader = res.header['content-range'].split('/');
                        var range = rangeHeader[0].split('-');
                        this.dispatch('entry:set', {
                            records: JSON.parse(res.text),
                            range: {
                                since: range[0],
                                until: range[1]
                            }
                        });
                    }
                }
            });
        });
    }
}
