import { useEffect, useMemo, useState } from 'react';

import './App.css';
import axios from 'axios';
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { MRT_ColumnDef, useMaterialReactTable, MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';

import { MovieType, SearchItemType } from './types/type';
import { useAppDispatch, useAppSelector } from './hooks/hook';
import { setData, setTotalResults } from './store/slice/movieSlice';

const Home = () => {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { data, totalResults } = useAppSelector((state) => state.movie);

   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
   const [searchItem, setSearchItem] = useState({ search: 'Pokemon', year: '', type: '' } as SearchItemType);

   const fetchMoviesBySearch = async () => {
      try {
         let url = `https://omdbapi.com/?apikey=d24aa795&s=${searchItem.search}&page=${pagination.pageIndex + 1}`;
         if (searchItem.year) {
            url += `&y=${searchItem.year}`;
         }
         if (searchItem.type) {
            url += `&type=${searchItem.type}`;
         }
         const response = await axios.get(url);

         console.log(response.data);

         dispatch(setData(response.data.Search));
         dispatch(setTotalResults(parseInt(response.data.totalResults)));
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   useEffect(() => {
      fetchMoviesBySearch();
      console.log('fetch oldu');
   }, [pagination]);

   const searchOptions = [
      { value: 'movie', label: 'Movie' },
      { value: 'series', label: 'Series' },
      { value: 'episode', label: 'Episode' },
   ];

   const columns = useMemo<MRT_ColumnDef<MovieType>[]>(
      () => [
         {
            accessorKey: 'Title',
            header: 'Title',
            size: 150,
         },
         {
            accessorKey: 'Type',
            header: 'Type',
            size: 150,
         },
         {
            accessorKey: 'Year',
            header: 'Year',
            size: 200,
         },
         {
            accessorKey: 'imdbID',
            header: 'IMBD ID',
            size: 150,
         },
      ],
      [],
   );

   const table = useMaterialReactTable({
      columns,
      data,
      enableRowSelection: false,
      enableTopToolbar: false,
      enableColumnActions: false,
      enableSorting: false,
      manualPagination: true,
      pageCount: Math.ceil(totalResults / 10) - 1,
      paginationDisplayMode: 'pages',
      state: {
         pagination,
      },
      muiTableBodyRowProps: ({ row }) => ({
         onClick: () => {
            const movieId = row.original.imdbID;
            navigate(`/movie-detail/${movieId}`);
         },
         style: {
            cursor: 'pointer',
         },
      }),
      onPaginationChange: setPagination,
      muiPaginationProps: {
         color: 'primary',
         shape: 'rounded',
         showRowsPerPage: false,
         variant: 'outlined',
      },
   });

   return (
      <>
         <form
            onSubmit={(e) => {
               e.preventDefault();
               if (searchItem.search === '') {
                  toast.error('Search field is mandatory');
                  return;
               }
               fetchMoviesBySearch();
            }}
         >
            <TextField
               value={searchItem.search}
               onChange={(e) =>
                  setSearchItem((prev: SearchItemType) => {
                     return { ...prev, search: e.target.value };
                  })
               }
            />
            <TextField
               value={searchItem.year}
               onChange={(e) =>
                  setSearchItem((prev: SearchItemType) => {
                     return { ...prev, year: e.target.value };
                  })
               }
            />
            <Select
               value={searchItem.type}
               onChange={(e: SelectChangeEvent) =>
                  setSearchItem((prev: SearchItemType) => {
                     return { ...prev, type: e.target.value };
                  })
               }
               label="Choose Type"
               /*   sx={{
                '& .MuiInputBase-root': {
                   fontWeight: 400,
                   fontSize: '14px',
                   backgroundColor: '#f6f8f9',
                   padding: '0px',
                },
                '& .MuiOutlinedInput-root': {
                   height: '32px',
                   fontSize: '12px',
                   '&:hover fieldset': {
                      borderColor: '#F59E0B',
                   },
                   '&.Mui-focused fieldset': {
                      borderColor: '#F59E0B',
                   },
                },
                marginLeft: '10px',
                width: '15%',
             }} */
               placeholder="choose"
            >
               {searchOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                     {option.label}
                  </MenuItem>
               ))}
            </Select>
            <Button type="submit">Search</Button>
         </form>
         <MaterialReactTable table={table} />
         <Toaster />
      </>
   );
};

export default Home;
