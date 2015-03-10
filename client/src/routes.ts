import React = require("react");
import Router = require("react-router");
import Route = Router.Route;
import DefaultRoute = Router.DefaultRoute;

import App = require("./components/app")
import Home = require("./components/home");

var routes: Router.Route =  React.jsx(`
    <Route handler={App} name="root" path="/">
        <DefaultRoute handler={Home} />
    </Route>
`);

export = routes;
