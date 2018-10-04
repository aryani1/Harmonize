import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router'
import App from '../App';
import login from './login'

const Root = ({ store }) => (
  <Provider store={store}>

    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path ="/test" component={login} />
      </div>
    </Router>

  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root