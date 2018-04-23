import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import SimpleAppBar from './component/AppBar';
import StoryList from './component/StoryList';
import Story from './component/Story';

import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom';

// const store = configureStore();

const Home = () => (
  <div>
    <StoryList>
    </StoryList>
  </div>
)

ReactDOM.render(
  <Router>
    <div>
      <SimpleAppBar>
      </SimpleAppBar>
      <Route exact path="/" component={Home} />
      <Route path="/stories/:id" component={Story} />
    </div>
  </Router>,
  document.getElementById('root')
);