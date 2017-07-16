import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './js/pages/Home.jsx';
import NotFound from './js/pages/NotFound.jsx';
import './assets/styles/main.scss';

ReactDOM.render(
  <Router>
      <Switch>
          <Route path="/" exact component={Home}/>
          <Route component={NotFound}/>
      </Switch>
  </Router>,
  document.getElementById('App')
);