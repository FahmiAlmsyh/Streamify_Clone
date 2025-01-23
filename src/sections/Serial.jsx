import { useCallback, useEffect, useState } from "react";
import Title from "../components/Title";
import { Pagination } from "flowbite-react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import ModalList from "../components/ModalList";
import ImageList from "../components/ImageList";
import OpenModal from "../components/OpenModal";

const Serial = ({ title, dropdown, type, size }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentGenre, setCurrentGenre] = useState(null);
  const navigate = useNavigate();
  const [selectedTV, setSelectedTV] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const currentPage = searchParams.get("page") || 1;
  const selectedGenre = searchParams.get("genre") || "";
  const token = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleFavorite = useCallback((serial, type) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some(
        (fav) => fav.id === serial.id && fav.media_type === type
      );
      let updatedFavorites;

      if (isFavorite) {
        updatedFavorites = prevFavorites.filter(
          (fav) => fav.id !== serial.id || fav.media_type !== type
        );
      } else {
        updatedFavorites = [{ ...serial, media_type: type }, ...prevFavorites];
      }

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  useEffect(() => {
    const fetchGenreName = async () => {
      if (selectedGenre) {
        try {
          const url = `https://api.themoviedb.org/3/genre/tv/list?language=en`;
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
          console.error("Data genre tidak tersedia", error);
        }
      }
    };

    fetchGenreName();
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
        const url = `https://api.themoviedb.org/3/discover/tv?language=en-US&page=${currentPage}${genreFilter}`;

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
        setIsImageLoading(false);
      }
    };

    getData();
  }, [currentPage, selectedGenre]);

  // Handle opening modal
  const handleList = (tv) => {
    setSelectedTV(tv);
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
                <p>Tidak ada serial yang tersedia di genre ini.</p>
              </div>
            ) : (
              <>
                {isImageLoading ? (
                  <div className="flex justify-center items-center my-10">
                    <p>Loading images...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-4 w-full">
                    {data.map((serial) => (
                      <ImageList
                        key={serial.id}
                        type={type}
                        size={size}
                        item={serial}
                        onFavorite={() => handleFavorite(serial, type)}
                        onClick={() => handleList(serial)}
                        favorites={favorites}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="flex justify-center items-center my-5">
              {data.length > 0 && (
                <Pagination
                  currentPage={Number(currentPage)}
                  totalPages={500}
                  onPageChange={onPageChange}
                  showIcons
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

export default Serial;
