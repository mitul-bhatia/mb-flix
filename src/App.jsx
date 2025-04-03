import  {useEffect, useState } from 'react'
import Search from './components/search'
import Loading from './components/Loading';
import Moviecard from './components/Moviecard';
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL= "https://api.themoviedb.org/3"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 


const Api_option ={
  method: 'GET',// The HTTP method used for the request (GET means we are retrieving data, not modifying it)

  headers:{
    accept: "application/json", // response ki type samachne ke liye
    Authorization: `Bearer ${API_KEY}` // API key is used to authenticate the user
  }
}
// api is application programming interface 
// api is a set of rules that allows one software application to talk to another
const App=()=> {
  // all the states i have used are mentoined here 
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debounceterm, setDebounceterm] = useState("")
  const [trendingMovies, setTrendingMovies]=useState([])

  // DEVOUNCES THE SEARCH TERM FROM AMKING TOO MANY REQUESTA ALL AT ONECE 
  useDebounce(() => setDebounceterm(searchTerm),500,[searchTerm])

  // main bosss fetch movies 
  const Fetchmovie= async (query="")=>{
     setIsLoading(true)
     setErrorMessage("")


    try{

    const endpoint =query? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`//this is thing that is used when we want to encode it properly
    :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

    const response = await fetch(endpoint, Api_option)
     if (!response.ok){
       throw Error('try karo dubara')
     }
     const data=await response.json()
      if (!data.results || data.results.length === 0) { // Fix response validation
        setErrorMessage('No movies found');
        setMovies([]);
        return;
      }

      setMovies(data.results|| [])

      if (query && data.results.length > 0) {
       await updateSearchCount(query,data.results[0]) // this is used to update the search count in the database
      }
    }
    catch(error){
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Error in fetching movies ')

    }
    finally{
      setIsLoading(false) // this is used to stop the loading of the page kyunki agar error aata hai toh bhi loading chal raha hai
    }
    
  } 
  // 


  const loadTrendingMovies = async () => {
    try {
      const movis = await getTrendingMovies();

      setTrendingMovies(movis);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    Fetchmovie(debounceterm)
  },[debounceterm])

   useEffect(()=>{
      loadTrendingMovies()
   },[])

  return (
    <main className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('https://example.com/your-image.jpg')` }}>
      <div className='pattern'/>

      <div className='wrapper'>



    {/* <header className="flex items-center justify-center flex-col h-64 bg-cover bg-top text-white shadow-lg"
      style={{ backgroundImage: "url('/public2/hero-bg.png')" }}
    > */}
    <header >
      <div className="flex items-center justify-center  bg-black">
      <h1
        className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text 
                   bg-gradient-to-r from-red-100 to-red-800 
                   drop-shadow-lg transition-transform duration-1000 ease-in-out 
                   hover:scale-110 animate-pulse"
      >
        BEST in Business
      </h1>
      </div>
      <img src='https://play-lh.googleusercontent.com/x6e04XkLxys_hZ0ENmupQXMJ6oIoPAp3lU-3H-V2TT7FIDMX56w4Bk0wefurWU2eduQ' alt='Hero Banner' />

      <h1>Find <span className='text-gradient'>Movies </span>You' will Enjoy Without the <span className='text-gradient1'>Hassle</span></h1>
           
           
    <Search searchTer={searchTerm} setSearchTerm={setSearchTerm}/>
    {/* <h1 className='text-white'>{searchTerm}</h1> */}
           
     </header>

     {
      console.log(trendingMovies)
     }
 

{trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

     <section className='all-movies'>

        <h2 className='mt-[50]'>All Movies</h2>
        
       {
         isLoading ? (
          <Loading/>
         ):errorMessage ? (
          <p className='text-red-743'>{errorMessage}</p>
         ):(
          <ul>
            {
              console.log(movies)
            }
            {movies.map((movie) => (

              <Moviecard key={movie.id} movie={movie}/>
              // <p key={movie.id} className='text-white'>{movie.title}</p> rather than names i need proper cards so i will use a movie card component
            ))}
          </ul>
         )
       }


      

        {/* {errorMessage && <p className='text-red-743'>{errorMessage}</p>} this can be also used but we prefer using state for thi task */}
      </section>
          
   </div> {/*wrapper ka div hai yeh */}




    </main>
     
  )
}

export default App
// import { useEffect, useState } from 'react'
// import Search from './components/search'
// import Spinner from './components/Spinner.jsx'
// import MovieCard from '/components/Moviecard'
// import { useDebounce } from 'react-use'
// import { getTrendingMovies, updateSearchCount } from './appwrite.js'

// const API_BASE_URL = 'https://api.themoviedb.org/3';

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// const API_OPTIONS = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: `Bearer ${API_KEY}`
//   }
// }

// const App = () => {
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
//   const [searchTerm, setSearchTerm] = useState('');

//   const [movieList, setMovieList] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const [trendingMovies, setTrendingMovies] = useState([]);

//   // Debounce the search term to prevent making too many API requests
//   // by waiting for the user to stop typing for 500ms
//   useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

//   const fetchMovies = async (query = '') => {
//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const endpoint = query
//         ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
//         : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

//       const response = await fetch(endpoint, API_OPTIONS);

//       if(!response.ok) {
//         throw new Error('Failed to fetch movies');
//       }

//       const data = await response.json();

//       if(data.Response === 'False') {
//         setErrorMessage(data.Error || 'Failed to fetch movies');
//         setMovieList([]);
//         return;
//       }

//       setMovieList(data.results || []);

//       if(query && data.results.length > 0) {
//         await updateSearchCount(query, data.results[0]);
//       }
//     } catch (error) {
//       console.error(`Error fetching movies: ${error}`);
//       setErrorMessage('Error fetching movies. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const loadTrendingMovies = async () => {
//     try {
//       const movies = await getTrendingMovies();

//       setTrendingMovies(movies);
//     } catch (error) {
//       console.error(`Error fetching trending movies: ${error}`);
//     }
//   }

//   useEffect(() => {
//     fetchMovies(debouncedSearchTerm);
//   }, [debouncedSearchTerm]);

//   useEffect(() => {
//     loadTrendingMovies();
//   }, []);

//   return (
//     <main>
//       <div className="pattern"/>

//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="Hero Banner" />
//           <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         </header>

//         {trendingMovies.length > 0 && (
//           <section className="trending">
//             <h2>Trending Movies</h2>

//             <ul>
//               {trendingMovies.map((movie, index) => (
//                 <li key={movie.$id}>
//                   <p>{index + 1}</p>
//                   <img src={movie.poster_url} alt={movie.title} />
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}

//         <section className="all-movies">
//           <h2>All Movies</h2>

//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard key={movie.id} movie={movie} />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   )
// }

// export default App