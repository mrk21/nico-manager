///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import PaginationComponent = require('../../../src/components/pagination_component');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<PaginationComponent.Component> {}

(initDom ? describe : describe.skip)('components/pagination_component', () => {
    var helper: MyHelper;
    var helperCallback = (helper: MyHelper) => {}
    var props: PaginationComponent.Props;
    
    before(() => {
        props = {
            flux: null,
            total: 100,
            perPage: 30,
            maxLinkCount: 10,
            currentPage: 2,
            getLinkProps: (page) => {
                return {
                    to: 'home',
                    params: {},
                    query: {p: page}
                };
            }
        };
    });
    
    beforeEach((done) => {
        helper = new MyHelper(PaginationComponent.Component, props, done, helperCallback);
    });
    
    context('when mounted', () => {
        it('should exist page links', () => {
            var count = 0;
            for (var key in helper.component.refs) {
                if (key.match(/link\./)) count++;
            }
            assert(count === 4);
        });
        
        it('should set "is-active" class to the current page element', () => {
            var activeElement = helper.component.refs[`link.${props.currentPage}`];
            assert(activeElement.getDOMNode<HTMLElement>().className.match('is-active'));
        });
        
        context('when the number of the pages was greater than the maxLinkCount', () => {
            before(() => {
                props = {
                    flux: null,
                    total: 100,
                    perPage: 6,
                    maxLinkCount: 6,
                    currentPage: 10,
                    getLinkProps: (page) => {
                        return {
                            to: 'home',
                            params: {},
                            query: {p: page}
                        };
                    }
                };
            });
            
            it('should limit the number of the page links by the maxLinkCount', () => {
                var count = 0;
                for (var key in helper.component.refs) {
                    if (key.match(/link\./)) count++;
                }
                assert(count === props.maxLinkCount);
            });
            
            it('should exist anteroposterior links of the current page', () => {
                assert(helper.component.refs['link.8']);
                assert(helper.component.refs['link.9']);
                assert(helper.component.refs['link.10']); // current page
                assert(helper.component.refs['link.11']);
                assert(helper.component.refs['link.12']);
                assert(helper.component.refs['link.13']);
            });
            
            context('when the current page was around of the first page', () => {
                before(() => {
                    props = {
                        flux: null,
                        total: 100,
                        perPage: 6,
                        maxLinkCount: 6,
                        currentPage: 2,
                        getLinkProps: (page) => {
                            return {
                                to: 'home',
                                params: {},
                                query: {p: page}
                            };
                        }
                    };
                });
                
                it('should limit the number of the page links by the maxLinkCount', () => {
                    var count = 0;
                    for (var key in helper.component.refs) {
                        if (key.match(/link\./)) count++;
                    }
                    assert(count === props.maxLinkCount);
                });
                
                it('should exist anteroposterior links of the current page', () => {
                    assert(helper.component.refs['link.1']);
                    assert(helper.component.refs['link.2']); // current page
                    assert(helper.component.refs['link.3']);
                    assert(helper.component.refs['link.4']);
                    assert(helper.component.refs['link.5']);
                    assert(helper.component.refs['link.6']);
                });
            });
            
            context('when the current page was around of the last page', () => {
                before(() => {
                    props = {
                        flux: null,
                        total: 100,
                        perPage: 6,
                        maxLinkCount: 6,
                        currentPage: 16,
                        getLinkProps: (page) => {
                            return {
                                to: 'home',
                                params: {},
                                query: {p: page}
                            };
                        }
                    };
                });
                
                it('should limit the number of the page links by the maxLinkCount', () => {
                    var count = 0;
                    for (var key in helper.component.refs) {
                        if (key.match(/link\./)) count++;
                    }
                    assert(count === props.maxLinkCount);
                });
                
                it('should exist anteroposterior links of the current page', () => {
                    assert(helper.component.refs['link.12']);
                    assert(helper.component.refs['link.13']);
                    assert(helper.component.refs['link.14']);
                    assert(helper.component.refs['link.15']);
                    assert(helper.component.refs['link.16']); // current page
                    assert(helper.component.refs['link.17']);
                });
            });
        });
    });
});
