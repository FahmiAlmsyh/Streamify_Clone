import { useEffect, useState } from "react";
import Back from "../components/Back";
import Title from "../components/Title";
import "../style/styles.css";
import axios from "axios";
import { Pagination } from "flowbite-react";
import ImageList from "../components/ImageList";
import { useNavigate, useParams } from "react-router-dom";
import ModalList from "../components/ModalList";
import OpenModal from "../components/OpenModal";
import { useCallback } from "react";
const ListContent = ({ title, size, type, url }) => {
  const [data, setData] = useState([]);
  const [genres, setGenres] = useState([]);
  const params = useParams();
  const initialPage = params.id ? Number(params.id) : 1;
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTV, setSelectedTV] = useState(null);
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
        const url = "https://api.themoviedb.org/3/genre/tv/list?language=en";
        const response = await axios.get(url, {
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

        if (title === "Top Rated") {
          url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
        } else if (matchGenre) {
          url = `https://api.themoviedb.org/3/discover/tv?language=en-US&with_genres=${matchGenre.id}&page=${currentPage}`;
        } else {
          console.warn(`Tidak ada genre yang sama: ${title}`);
          return;
        }

        const response = await axios.get(url, {
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
  }, [title, genres, type, currentPage]);

  const handleList = (tv) => {
    setSelectedTV(tv);
    setOpenModal(true);
  };

  const handleFavorite = useCallback((item, type) => {
      setFavorites((prevFavorites) => {
        const isFavorite =
          Array.isArray(prevFavorites) &&
          prevFavorites.some(
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
              {data.map((item) => (
                <ImageList
                  key={item.id}
                  type={type}
                  size={size}
                  item={item}
                  onClick={() => handleList(item)}
                  onFavorite={() => handleFavorite(item, type)}
                  favorites={favorites}
                />
              ))}
            </div>
            <div className="flex justify-center xs items-center my-5 md:text-base">
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
                <ModalList
                  tv={selectedTV}
                  onClose={() => setOpenModal(false)}
                  type={type}
                  title={title}
                />
              )}
            </OpenModal>
          </>
        )}
      </div>
    </div>
  );
};

export default ListContent;
