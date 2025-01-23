import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import "../style/styles.css";
import Title from "../components/Title";
import ImageCard from "../components/ImageCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "flowbite-react";
import OpenModal from "../components/OpenModal";
import ModalMovie from "../components/ModalMovie";

const Movies = ({ title, type, size, dropdown }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentGenre, setCurrentGenre] = useState(null);
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const selectedGenre = searchParams.get("genre") || "";
  const currentPage = searchParams.get("page") || 1;
  const token = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleFavorite = useCallback((movies, type) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some(
        (fav) => fav.id === movies.id && fav.media_type === type
      );
      let updatedFavorites;

      if (isFavorite) {
        updatedFavorites = prevFavorites.filter(
          (fav) => fav.id !== movies.id || fav.media_type !== type
        );
      } else {
        updatedFavorites = [{ ...movies, media_type: type }, ...prevFavorites];
      }

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  useEffect(() => {
    const fetchGenre = async () => {
      if (selectedGenre) {
        try {
          const url =
            "https://api.themoviedb.org/3/genre/movie/list?language=en";
          const response = await axios(url, {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const genre = response.data.genres.find(
            (genre) => genre.id === Number(selectedGenre)
          );
          if (genre) {
            setCurrentGenre({ id: genre.id, name: genre.name });
          }
        } catch (error) {
          console.log("Data genre tidak tersedia", error);
        }
      }
    };
    fetchGenre();
  }, [selectedGenre]);

  const onPageChange = (page) => {
    setSearchParams({ page, genre: selectedGenre });
  };

  const onGenreChange = (genreId, genreName) => {
    setSearchParams({ page: 1, genre: genreId });
    setCurrentGenre({ id: genreId, name: genreName });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setIsImageLoading(true);

        const genreFilter = selectedGenre
          ? `&with_genres=${selectedGenre}`
          : "";
        const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${currentPage}${genreFilter}`;

        const response = await axios(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.results);
      } catch (error) {
        console.error("Data tidak tersedia", error);
      } finally {
        setIsLoading(false);
        setTimeout(() => setIsImageLoading(false), 500);
      }
    };
    getData();
  }, [selectedGenre, currentPage]);

  const handleMovie = (movie) => {
    setSelectedMovie(movie);
    setOpenModal(true);
  };

  return (
    <div className="container mx-auto">
      <div className="my-4 media">
        <Title
          title={currentGenre ? `${title} - ${currentGenre.name}` : title}
          dropdown={dropdown}
          onGenreChange={onGenreChange}
          currentGenre={currentGenre}
        />
        {isLoading ? (
          <div className="flex justify-center items-center my-10">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {data.length === 0 ? (
              <div className="flex justify-center items-center my-10">
                Tidak ada movie yang tersedia di genre ini.
              </div>
            ) : (
              <>
                {isImageLoading ? (
                  <div className="flex justify-center items-center my-10">
                    <p>Loading images...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-4 w-full">
                    {data.map((movies) => (
                      <ImageCard
                        key={movies.id}
                        item={movies}
                        type={type}
                        size={size}
                        onFavorite={() => handleFavorite(movies, type)}
                        onClick={() => handleMovie(movies)}
                        favorites={favorites}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="flex md:text-base justify-center xs items-center my-5">
              {data.length > 0 && (
                <Pagination
                  currentPage={Number(currentPage)}
                  totalPages={500}
                  showIcons
                  onPageChange={onPageChange}
                />
              )}
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
        )}
      </div>
    </div>
  );
};

export default Movies;
