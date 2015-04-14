import request = require('superagent');
import Action = require('./base');
import Api = require('../api');
import dispatchLoader = require('./dispatch_loader');

export class IndexBase extends Action.Base<Api.ListWithRange<Api.EntryListItem> | Api.Message> {
    handler(...args: any[]) {
        new Error('You must implement this method');
    }
    
    access(url: string, query?: string, range?: Api.Range) {
        var sendQuery: any = query ? {q: query} : {};
        
        dispatchLoader(this, (done) => {
            var req = request.get(url).query(sendQuery);
            
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
                        var contentRange = res.header['content-range'].split('/');
                        var range = contentRange[0].split('-');
                        var total = contentRange[1];
                        
                        this.dispatch('entry:set', {
                            records: JSON.parse(res.text),
                            range: {
                                since: range[0]-0,
                                until: range[1]-0,
                                total: total-0
                            }
                        });
                    }
                }
            });
        });
    }
}

export class Index extends IndexBase {
    handler(query?: string, range?: Api.Range) {
        this.access('/api/entries', query, range);
    }
}
