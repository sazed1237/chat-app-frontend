import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from './Routes/Router.jsx';
import axios from 'axios';
import { Provider } from 'react-redux'
import { store } from './redux/store.jsx';


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
