import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setDetailData } from './store/slice/movieSlice';
import { useAppDispatch, useAppSelector } from './hooks/hook';
import Grid from '@mui/material/Grid2';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

const Detail = () => {
  const { movieId } = useParams();
  const dispatch = useAppDispatch();
  const { detailData } = useAppSelector((state) => state.movie);

  const fetchMovieDetail = async () => {
    try {
      const url = `https://omdbapi.com/?apikey=d24aa795&i=${movieId}`;
      const response = await axios.get(url);
      dispatch(setDetailData(response.data));
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMovieDetail();
  }, []);

  return (
    <Grid container display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ backgroundColor: '#F5EDED', height: '100vh' }}>
      <Grid sx={{ width: '40%' }}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              image={detailData.Poster}
              alt=""
              sx={{
                height: '60vh',
                objectFit: 'contain'
              }}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', color: 'text.main' }}>
              <Typography gutterBottom variant="h4" component="div">
                {detailData.Title}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                IMDB RATING: {detailData.imdbRating}
              </Typography>
              <Typography variant="body2">GENRE: {detailData.Genre}</Typography>
              <Typography variant="body2">YEAR: {detailData.Year}</Typography>
              <Typography variant="body2">LANGUAGE: {detailData.Language}</Typography>
              <Typography variant="body2">DIRECTOR: {detailData.Director}</Typography>
              <Typography variant="body2">WRITER: {detailData.Writer}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Detail;
