///<reference path="_reference.d.ts" />

import React = require('react');
import Fluxxor = require('fluxxor');
import Router = require('react-router');

import Stores = require('./stores');
import Actions = require('./actions');
import Routes = require('./routes');

var flux = new Fluxxor.Flux(new Stores(), new Actions());

flux.on('dispatch', (type: string, payload: any) => {
    console.log(type, payload);
});

Router.run((new Routes()).root, (Handler) => {
    React.render(React.jsx(`<Handler flux={flux} />`), document.getElementById("app"));
});
