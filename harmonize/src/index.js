import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import reducers from "./reducers/index.js";
import './index.css';
import Root from './components/root.js'
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers);

ReactDOM.render(
<Provider store= { store }>
    <Root store={ store }/>
</Provider>,
 document.getElementById('root')
);

registerServiceWorker();
