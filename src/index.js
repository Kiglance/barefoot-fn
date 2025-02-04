import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { socket, socketContext } from './helpers/context';
import store from './redux/store';
import AllRoutes from './routes';

global.React = React;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <socketContext.Provider value={socket}>
    <Provider store={store}>
      <AllRoutes />
    </Provider>
  </socketContext.Provider>,
);
