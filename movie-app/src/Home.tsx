import { useEffect, useMemo, useState } from 'react';

import './App.css';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TableRowProps, TextField } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { MRT_ColumnDef, useMaterialReactTable, MaterialReactTable } from 'material-react-table';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';

import { MovieType, SearchItemType, SearchOptionType } from './helpers/type';
import { useAppDispatch, useAppSelector } from './hooks/hook';
import { clearDetailData, setData, setTotalResults } from './store/slice/movieSlice';
import SearchIcon from '@mui/icons-material/Search';
import { searchOptions } from './helpers/arrays';

const Home = () => {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const location = useLocation();
   const { data, totalResults } = useAppSelector((state) => state.movie);

   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
   const [searchItem, setSearchItem] = useState({
      search: location.state && location.state.searchItem ? location.state.searchItem : 'Pokemon',
      year: '',
      type: '',
   } as SearchItemType);
   console.log(location);
   const fetchMoviesBySearch = async () => {
      try {
         const apiKey = import.meta.env.VITE_APP_OMDB_API_KEY;
         let url = `https://omdbapi.com/?apikey=${apiKey}&s=${searchItem.search}&page=${pagination.pageIndex + 1}`;
         if (searchItem.year) {
            url += `&y=${searchItem.year}`;
         }
         if (searchItem.type) {
            url += `&type=${searchItem.type}`;
         }
         const response = await axios.get(url);

         if (response.data.Response === 'False') {
            dispatch(setData([]));
            dispatch(setTotalResults(0));
            toast.error(`Error fetching data: ${response.data.Error}`);
            return;
         }

         dispatch(setData(response.data.Search));
         dispatch(setTotalResults(parseInt(response.data.totalResults)));
      } catch (error) {
         toast.error(`Error fetching data: ${error}`);
      }
   };

   useEffect(() => {
      fetchMoviesBySearch();
   }, [pagination.pageIndex]);

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
      muiTableBodyRowProps: ({ row }) =>
         ({
            onClick: () => {
               const movieId = row.original.imdbID;
               dispatch(clearDetailData());
               navigate(`/movie-detail/${movieId}`, { state: { searchItem: searchItem.search } });
            },
            style: {
               cursor: 'pointer',
            },
         } as TableRowProps),
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
            <Grid container spacing={3} justifyContent={'flex-end'} padding={4}>
               <TextField
                  placeholder="Search by title"
                  value={searchItem.search}
                  onChange={(e) =>
                     setSearchItem((prev: SearchItemType) => {
                        return { ...prev, search: e.target.value };
                     })
                  }
                  sx={{
                     '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                           borderColor: '#4F75FF',
                        },
                     },
                  }}
               />
               <TextField
                  placeholder="Search by year"
                  value={searchItem.year}
                  onChange={(e) =>
                     setSearchItem((prev: SearchItemType) => {
                        return { ...prev, year: e.target.value };
                     })
                  }
                  sx={{
                     '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                           borderColor: '#4F75FF',
                        },
                     },
                  }}
               />
               <FormControl>
                  <InputLabel
                     id="select-label"
                     sx={{
                        '&.Mui-focused': {
                           color: '#4F75FF',
                        },
                     }}
                  >
                     Type
                  </InputLabel>
                  <Select
                     sx={{
                        width: '150px',
                        fontSize: '14px',

                        '&.MuiOutlinedInput-root.Mui-focused': {
                           '.MuiOutlinedInput-notchedOutline': { border: 1, borderColor: '#4F75FF' },
                        },
                     }}
                     value={searchItem.type}
                     onChange={(e: SelectChangeEvent) =>
                        setSearchItem((prev: SearchItemType) => {
                           return { ...prev, type: e.target.value };
                        })
                     }
                     label="Type"
                  >
                     {searchOptions.map((option: SearchOptionType) => (
                        <MenuItem key={option.value} value={option.value}>
                           {option.label}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>

               <Button type="submit" variant="contained" color="primary" endIcon={<SearchIcon />}>
                  Search
               </Button>
            </Grid>
         </form>
         <Grid sx={{ px: '50px' }}>
            <MaterialReactTable table={table} />
         </Grid>

         <Toaster />
      </>
   );
};

export default Home;
