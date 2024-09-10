import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setDetailData } from './store/slice/movieSlice';
import { useAppDispatch, useAppSelector } from './hooks/hook';

const Detail = () => {
   const { movieId } = useParams();
   const dispatch = useAppDispatch();
   const { detailData } = useAppSelector((state) => state.movie);
   console.log(detailData);
   const fetchMovieDetail = async () => {
      try {
         const url = `https://omdbapi.com/?apikey=d24aa795&i=${movieId}`;
         const response = await axios.get(url);
         console.log(response.data);
         dispatch(setDetailData(response.data));
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   useEffect(() => {
      fetchMovieDetail();
      console.log('fetch oldu');
   }, []);
   return (
      <>
         <div>{detailData.Title}</div>
         <div>{detailData.Genre}</div>
         <div>{detailData.Language}</div>
         <div>{detailData.imdbRating}</div>
         <div>{detailData.imdbVotes}</div>
         <div>{detailData.Year}</div>
         <img src={detailData.Poster}></img>
      </>
   );
};

export default Detail;
