import { DetailMovieType, MovieType } from './../../types/type';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MovieState {
   data: MovieType[];
   totalResults: number;
   detailData: DetailMovieType;
}

const initialState: MovieState = {
   data: [],
   totalResults: 0,
   detailData: {} as DetailMovieType,
};

export const movieSlice = createSlice({
   name: 'movie',
   initialState,
   reducers: {
      setData: (state, action: PayloadAction<MovieType[]>) => {
         state.data = action.payload;
      },
      setTotalResults: (state, action: PayloadAction<number>) => {
         state.totalResults = action.payload;
      },
      setDetailData: (state, action: PayloadAction<DetailMovieType>) => {
         state.detailData = action.payload;
      },
   },
});

export const { setData, setTotalResults, setDetailData } = movieSlice.actions;

export default movieSlice.reducer;
