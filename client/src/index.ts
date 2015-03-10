///<reference path="_reference.d.ts" />

import React = require("react");
import Fluxxor = require("fluxxor");
import Router = require("react-router");

import stores = require('./stores');
import actions = require('./actions');
import routes = require('./routes');

var flux = new Fluxxor.Flux(stores, actions);

Router.run(routes, (Handler) => {
    React.render(React.jsx(`<Handler flux={flux} />`), document.getElementById("app"));
});
