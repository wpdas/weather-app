import React from 'react';
import ReactDOM from 'react-dom';
import { rehoc, setStates } from 'rehoc';
import WeatherApp from './WeatherApp';
import * as serviceWorker from './serviceWorker';
import weatherState from './states/weather/state';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';

// Rehoc state management
setStates({
  weatherState
});

const App = rehoc(WeatherApp);

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
