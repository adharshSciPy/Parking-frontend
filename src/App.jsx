import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Toaster, NavBar, Notification } from './components'
import Router from './router/Router';

function App() {

  return (
    <BrowserRouter>
      <Toaster />
      <Notification />
      <NavBar />
      <Router />
    </BrowserRouter>
  );
}

export default App;
