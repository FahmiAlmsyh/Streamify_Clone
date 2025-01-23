import { useEffect, useState } from "react";
import "../style/styles.css";
import ImageCard from "./ImageCard";
import axios from "axios";
import Title from "./Title";
import ModalMovie from "./ModalMovie";
import ScrollButton from "./ScrollButton";
import OpenModal from "./OpenModal";
import { useCallback } from "react";

function Card({ title, type, link, url }) {
  const [genres, setGenres] = useState([]);
  const [data, setData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = import.meta.env.VITE_REACT_APP_API_KEY;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleFavorite = useCallback((item, type) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some(
        (fav) => fav.id === item.id && fav.media_type === type
      );
      let updatedFavorites;

      if (isFavorite) {
        updatedFavorites = prevFavorites.filter(
          (fav) => fav.id !== item.id || fav.media_type !== type
        );
      } else {
        updatedFavorites = [{ ...item, media_type: type }, ...prevFavorites];
      }

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
        const response = await axios(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error(error);
      }
    };

    getGenres();
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (genres.length === 0) {
        console.warn("Genre tidak tersedia");
        return;
      }
      try {
        setIsLoading(true);
        let url = "";
        const matchedGenre = genres.find(
          (genre) => genre.name.toLowerCase() === title.toLowerCase()
        );

        if (type === "Movie") {
          if (title === "Popular") {
            url =
              "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
          } else if (matchedGenre) {
            url = `https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=${matchedGenre.id}&page=1`;
          }
        } else if (type === "TV Show") {
          if (title === "Popular") {
            url =
              "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1";
          } else if (title === "On The Air") {
            url =
              "https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1";
          }
        }

        const response = await axios.get(url, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.results);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [title, genres, type]);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setOpenModal(true);
  };

  return (
    <>
      <div
        className="container mx-auto"
        style={{ borderBottom: "1px solid rgba(255, 255, 255, .15)" }}
      >
        <div className="my-14 media">
          <Title title={title} showLink={link} link={url} />

          {isLoading ? (
            <div className="flex justify-center items-center">
              <p>Loading...</p>
            </div>
          ) : (
            <ScrollButton>
              {data.map((item) => (
                <ImageCard
                  key={item.id}
                  type={type}
                  item={item}
                  onClick={() => handleCardClick(item)}
                  onFavorite={() => handleFavorite(item, type)}
                  favorites={favorites}
                />
              ))}
            </ScrollButton>
          )}
        </div>
      </div>

      <OpenModal
        open={
          openModal
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-50 pointer-events-none"
        }
      >
        {openModal && (
          <ModalMovie
            movie={selectedMovie}
            onClose={() => setOpenModal(false)}
            type={type}
          />
        )}
      </OpenModal>
    </>
  );
}

export default Card;
