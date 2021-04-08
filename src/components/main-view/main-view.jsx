import React from "react";
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [
        {
          _id: 1,
          Title: "Inception",
          Description: "desc1...",
          ImagePath: "...",
          Director: "Jhon"
        },
        {
          _id: 2,
          Title: "The Shawshank Redemption",
          Description: "desc2...",
          ImagePath: "...",
          Director: "Alberto"
        },
        {
          _id: 3,
          Title: "Gladiator",
          Description: "desc3...",
          ImagePath: "...",
          Director: "Austin night"
        },
      ],
      selectedMovie: null
    };
  }
  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie
    });
  }
  render() {
    const { movies, selectedMovie } = this.state;

    if (selectedMovie) return <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }} />;

    if (movies.length === 0) return <div className="main-view">The list is empty!</div>;

    return (
      <div className="main-view">
        {movies.map(movie => <MovieCard key={movie._id} movie={movie} onMovieClick={newSelectedMovie => { this.setState({ selectedMovie: newSelectedMovie }); }} />)}
      </div>
    );
  }
  
}
