import React from 'react';
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';
import { Toaster, NavBar } from './components'
import Router from './router/Router';

function App() {

  return (
    <BrowserRouter>
      <Toaster />
      <NavBar />
      <Router />
    </BrowserRouter>
  );
}

export default App;
