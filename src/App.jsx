import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Toaster, NavBar, Socket } from './components'
import Router from './router/Router';

function App() {

  return (
    <BrowserRouter>
      <Toaster />
      <Socket />
      <NavBar />
      <Router />
    </BrowserRouter>
  );
}

export default App;
