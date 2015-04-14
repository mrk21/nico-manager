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
                        var range = res.header['content-range'].match(/records (\d+)-(\d+)\/(\d+)/)
                        
                        this.dispatch('entry:set', {
                            records: JSON.parse(res.text),
                            range: {
                                since: range[1]-0,
                                until: range[2]-0,
                                total: range[3]-0
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
