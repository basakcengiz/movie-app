import { useEffect, useState } from 'react';

import './App.css';
import axios from 'axios';
import Example from './Example';
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';

function App() {
  const [data, setData] = useState({} as any);

  const [searchTerm, setSearchTerm] = useState('pokemon');
  const [yearTerm, setYearTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);
  const handleChange = (event: SelectChangeEvent) => {
    setFilterTerm(event.target.value as string);
  };
  console.log(searchTerm);
  console.log(filterTerm);
  const fetchMovies = async () => {
    try {
      const response = await axios.get(`https://omdbapi.com/?apikey=d24aa795&s=${searchTerm}`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchMovies();
        }}
      >
        <TextField value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <TextField value={yearTerm} onChange={(e) => setYearTerm(e.target.value)} />
        <Select value={filterTerm} label="Age" onChange={handleChange} placeholder="choose">
          <MenuItem value="movie">Movie</MenuItem>
          <MenuItem value="series">Series</MenuItem>
          <MenuItem value="episode">Episode</MenuItem>
        </Select>
        <Button type="submit">Search</Button>
      </form>

      <Example></Example>
    </>
  );
}

export default App;
