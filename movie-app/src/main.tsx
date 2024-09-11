import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store.ts';
import { Provider } from 'react-redux';

const root = createRoot(document.getElementById('root')!);

root.render(
   <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </Provider>,
);
