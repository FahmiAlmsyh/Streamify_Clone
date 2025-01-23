import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import axios from "axios";
import { Pagination } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import Back from "../components/Back";
import ModalMovie from "../components/ModalMovie";
import OpenModal from "../components/OpenModal";
import ImageCard from "../components/ImageCard";
import { useCallback } from "react";

const CardContent = ({ title, type, url, size }) => {
  const [data, setData] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const initialPage = params.id ? Number(params.id) : 1;
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const token = import.meta.env.VITE_REACT_APP_API_KEY;
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const onPageChange = (page) => {
    setCurrentPage(page);
    navigate(`/${url}/${page}`);
  };

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
        setGenres(response.data.genres || []);
      } catch (error) {
        console.error(error);
      }
    };

    getGenres();
  }, [token]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        let url = "";
        const matchedGenre = genres.find(
          (genre) => genre.name.toLowerCase() === title.toLowerCase()
        );

        if (type === "Movie") {
          if (title === "Popular") {
            url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}`;
          } else if (matchedGenre) {
            url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${currentPage}&with_genres=${matchedGenre.id}`;
          } 
        } else if (type === "TV Show") {
          if (title === "Popular") {
            url = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${currentPage}`;
          } else if (title === "On The Air") {
            url = `https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=${currentPage}`;
          }
        }

        const response = await axios(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [title, genres, type, currentPage, token]);

  useEffect(() => {
    if (params.id) {
      setCurrentPage(Number(params.id));
    }
  }, [params.id]);

  const handleCard = (movie) => {
    setSelectedMovie(movie);
    setOpenModal(true);
  };

  const handleFavorite = useCallback((movies, type) => {
    setFavorites((prevFavorites) => {
      const isFavorite =
        Array.isArray(prevFavorites) &&
        prevFavorites.some(
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

  return (
    <div className="container mx-auto">
      <div className="my-4 media">
        <Back />
        <Title title={title} />

        {isLoading ? (
          <div className="flex justify-center items-center my-10">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-4 w-full mt-3">
                {data.map((movies) => (
                  <ImageCard
                    key={movies.id}
                    item={movies}
                    type={type}
                    size={size}
                    onClick={() => handleCard(movies)}
                    onFavorite={() => handleFavorite(movies, type)}
                    favorites={favorites}
                  />
                ))}
              </div>

            <div className="flex justify-center xs md:text-base items-center my-5">
              <Pagination
                totalPages={500}
                showIcons
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
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

export default CardContent;
