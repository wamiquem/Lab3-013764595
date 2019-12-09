import React, { Component } from 'react';
import './App.css';
import './Sidebar.css';
import Main from './components/Main';
import {HashRouter} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';

const client = new ApolloClient({
  uri: 'http://localhost:3101/graphql'
})

class App extends Component {
  
  render() {
    return (
      <ApolloProvider client={client}>
      {/* Use Browser Router to route to different pages */}
      <HashRouter>
        <div>
          {/* App Component Has a Child Component called Main*/}
          <Main/>
        </div>
      </HashRouter>
      </ApolloProvider>
    );
  }
}

export default App;
