import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setDetailData } from './store/slice/movieSlice';
import { useAppDispatch, useAppSelector } from './hooks/hook';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Detail = () => {
   const { movieId } = useParams();
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { detailData } = useAppSelector((state) => state.movie);

   const fetchMovieDetail = async () => {
      try {
         const url = `https://omdbapi.com/?apikey=d24aa795&i=${movieId}`;
         const response = await axios.get(url);
         dispatch(setDetailData(response.data));
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   useEffect(() => {
      fetchMovieDetail();
   }, []);
   console.log(detailData);
   return (
      <>
         <Button
            variant="outlined"
            sx={{ margin: '10px' }}
            startIcon={<ArrowBackIcon />}
            onClick={() => {
               navigate('/');
            }}
         >
            Go Back
         </Button>
         <Grid container display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ backgroundColor: 'aliceblue', marginTop: '20px' }}>
            <Grid>
               <img alt="" src={detailData.Poster} style={{ borderRadius: '16px' }}></img>
            </Grid>
            <Grid sx={{ width: '50%', ml: '40px' }}>
               <Card sx={{ borderRadius: '16px' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', color: 'text.main', gap: '10px' }}>
                     <Typography gutterBottom variant="h4" component="div">
                        {detailData.Title}
                     </Typography>
                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        IMDB RATING: {detailData.imdbRating}
                     </Typography>
                     <Typography variant="body2">{detailData.Plot}</Typography>
                     <Typography variant="body2">GENRE: {detailData.Genre}</Typography>
                     <Typography variant="body2">YEAR: {detailData.Year}</Typography>
                     <Typography variant="body2">LANGUAGE: {detailData.Language}</Typography>
                     <Typography variant="body2">DIRECTOR: {detailData.Director}</Typography>
                     <Typography variant="body2">WRITER: {detailData.Writer}</Typography>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </>
   );
};

export default Detail;
