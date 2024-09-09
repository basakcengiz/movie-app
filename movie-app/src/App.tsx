import { useEffect, useState } from 'react';

import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState({} as any);
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?i=tt3896198&apikey=d24aa795`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return <>{data?.Title}</>;
}

export default App;
