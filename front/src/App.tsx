import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {ApolloClient,InMemoryCache,ApolloProvider,useQuery,gql} from "@apollo/client"
import PersonsList from './components/PersonList';
import AddPerson from './components/AddPerson';
function App() {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_API_URL,
    cache: new InMemoryCache()
  });
  console.log(`Api: ${process.env.REACT_API_URL}`);

  const [reload, setReload] = useState<boolean>(true);

  const reloadHandler = () => {
    setReload(!reload);
  }

  return (
    <ApolloProvider client={client}>
      <AddPerson reloadHandler={reloadHandler}/>
      <PersonsList reloadHandler={reloadHandler}/>
    </ApolloProvider>
  );
}

export default App;
