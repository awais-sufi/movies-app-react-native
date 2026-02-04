// const url =
//   "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYmM1OTgxNmJkNWRjZDJkNDU1YTQyOTk1Nzg5ZjAxZCIsIm5iZiI6MTc3MDE5MTI3Ni4wMDcsInN1YiI6IjY5ODJmOWFiZGI4OGNmNmQ2ODYyMTA2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Mgu2H_vm6emqS2alDthSSCdR9DZMp6is0sxeZEw5ruI",
//   },
// };

// fetch(url, options)
//   .then((res) => res.json())
//   .then((json) => console.log(json))
//   .catch((err) => console.error(err));

export const TMBD_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMBD_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMBD_CONFIG.BASE_URL}discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMBD_CONFIG.headers,
  });
  if (!response.ok) {
    //@ts-ignore
    throw new console.error("Failed to fetch movies", response.status);
  }
  const data = await response.json();
  return data.results;
};
