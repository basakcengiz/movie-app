import { Route, Routes } from 'react-router-dom';
import Detail from './Detail';
import Home from './Home';

function App() {
   return (
      <Routes>
         <Route path="/" element={<Home />}></Route>
         <Route path="/movie-detail/:movieId" element={<Detail />}></Route>
      </Routes>
   );
}

export default App;
