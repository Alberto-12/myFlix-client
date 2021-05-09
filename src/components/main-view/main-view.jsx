import React from "react";
import axios from "axios";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { RegistrationView } from "../registration-view/registration-view";
import { Row, Col, Navbar, Button } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import { Link } from "react-router-dom";

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
  }

  getMovies(token) {
    axios
      .get("https://austin-night.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
    console.log("logout successful");
    alert("You have been successfully logged out");
    window.open("/", "_self");
  }

  render() {
    const { movies, user } = this.state;

    // if (!user)
    //   return (
    //     <Row>
    //       <Col>
    //         <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
    //       </Col>
    //     </Row>
    //   );
    // if (movies.length === 0) return <div className="main-view" />;

    return (
      <Router>
        <Navbar
          expand="lg"
          sticky="top"
          variant="dark"
          expand="lg"
          className="navbar shadow-sm mb-5"
        >
          <Navbar.Brand href="http://localhost:1234" className="navbar-brand">
            FlixNET
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            {/* <VisibilityFilterInput visibilityFilter={visibilityFilter} /> */}
            {!user ? (
              <ul>
                <Link to={`/`}>
                  <Button variant="link" className="navbar-link">
                    Sign In
                  </Button>
                </Link>
                <Link to={`/register`}>
                  <Button variant="link" className="navbar-link">
                    Register
                  </Button>
                </Link>
              </ul>
            ) : (
              <ul>
                <Link to={`/`}>
                  <Button
                    variant="link"
                    className="navbar-link"
                    onClick={() => this.logOut()}
                  >
                    Sign Out
                  </Button>
                </Link>
                <Link to={`/users/${user}`}>
                  <Button variant="link" className="navbar-link">
                    My Account
                  </Button>
                </Link>
                <Link to={`/`}>
                  <Button variant="link" className="navbar-link">
                    Movies
                  </Button>
                </Link>
                <Link to={`/about`}>
                  <Button variant="link" className="navbar-link">
                    About
                  </Button>
                </Link>
              </ul>
            )}
          </Navbar.Collapse>
        </Navbar>
        <Row className="main-view justify-content-md-center">
          <Route
            exact
            path="/"
            render={() => {
              if (!user)
                return (
                  <Col>
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  </Col>
                );
              return movies.map((m) => (
                <Col md={3} key={m._id}>
                  <MovieCard movie={m} />
                </Col>
              ));
            }}
          />
          <Route
            path="/register"
            render={() => {
              return (
                <Col>
                  <RegistrationView />
                </Col>
              );
            }}
          />
          {/* you keep the rest routes here */}
          <Route
            path="/movies/:movieId"
            render={({ match }) => {
              return (
                <Col md={8}>
                  <MovieView
                    movie={movies.find((m) => m._id === match.params.movieId)}
                  />
                </Col>
              );
            }}
          />

          <Route
            path="/directors/:name"
            render={({ match }) => {
              if (movies.length === 0) return <div className="main-view" />;
              return (
                <Col md={8}>
                  <DirectorView
                    director={movies.find(
                      (m) => m.Director.Name === match.params.name
                    )}
                  />
                </Col>
              );
            }}
          />
          <Route
            path="/genres/:name"
            render={({ match }) => {
              if (movies.length === 0) return <div className="main-view" />;
              return (
                <Col md={8}>
                  <GenreView
                    genre={movies.find(
                      (m) => m.Genre.Name === match.params.name
                    )}
                  />
                </Col>
              );
            }}
          />
        </Row>
      </Router>
    );
  }
}
