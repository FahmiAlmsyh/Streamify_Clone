import { useCallback, useEffect, useRef, useState } from "react";
import "../style/styles.css";
import ImageList from "./ImageList";
import axios from "axios";
import Title from "./Title";
import ScrollButton from "./ScrollButton";
import ModalList from "./ModalList";
import OpenModal from "./OpenModal";
import { useNavigate } from "react-router-dom";
const List = ({ title, type, link, size, url }) => {
  const [data, setData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedTV, setSelectedTV] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = import.meta.env.VITE_REACT_APP_API_KEY;
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getGenres = async () => {
      try {
        const url = "https://api.themoviedb.org/3/genre/tv/list?language=en";
        const response = await axios(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.log(error);
      }
    };
    getGenres();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        let url = "";

        const matchGenre = genres.find(
          (genre) => genre.name.toLowerCase() === title.toLowerCase()
        );

        if (title === "Trending Now") {
          url = "https://api.themoviedb.org/3/trending/all/week?language=en-US";
        } else if (title === "Top Rated") {
          url =
            "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";
        } else if (matchGenre) {
          url = `https://api.themoviedb.org/3/discover/tv?language=en-US&with_genres=${matchGenre.id}&page=1`;
        } else {
          console.warn(`Tidak ada genre yang sama: ${title}`);
          return;
        }

        const response = await axios(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data.results);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [title, genres, type]);

  const handleList = (tv) => {
    setSelectedTV(tv);
    setOpenModal(true);
  };

  const handleFavorite = useCallback((movie, type) => {
    setFavorites((prevFavorites) => {
      const isFavorite =
        Array.isArray(prevFavorites) &&
        prevFavorites.some(
          (fav) => fav.id === movie.id && fav.media_type === type
        );
  
      let updatedFavorites;
  
      if (isFavorite) {
        updatedFavorites = prevFavorites.filter(
          (fav) => fav.id !== movie.id || fav.media_type !== type
        );
      } else {
        updatedFavorites = [{ ...movie, media_type: type }, ...prevFavorites];
      }
  
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);
  

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
              {data.map((movie) => (
                <ImageList
                  key={movie.id}
                  type={type}
                  size={size}
                  item={movie}
                  onClick={() => handleList(movie)}
                  onFavorite={() => handleFavorite(movie, type)}
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
          <ModalList
            tv={selectedTV}
            onClose={() => setOpenModal(false)}
            type={type}
            title={title}
          />
        )}
      </OpenModal>
    </>
  );
};

export default List;
