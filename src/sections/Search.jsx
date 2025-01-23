import { useEffect, useState } from "react";
import Title from "../components/Title";
import { Pagination } from "flowbite-react";
import axios from "axios";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import ModalList from "../components/ModalList";
import ImageList from "../components/ImageList";
import OpenModal from "../components/OpenModal";
import { useCallback } from "react";

const Search = ({ size }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedTV, setSelectedTV] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites")
    return storedFavorites ? JSON.parse(storedFavorites) : []
  })

  const title = searchParams.get("title") || "";
  const queryType = searchParams.get("type") || "";
  const currentPage = searchParams.get("page") || 1;
  const token = (import.meta.env.VITE_REACT_APP_API_KEY)

  const onPageChange = (page) => {
    setSearchParams({
      title: title,
      type: queryType,
      page,
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        let url = "";
        let headers = {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        if (title) {
          url = `https://api.themoviedb.org/3/search/${
            queryType === "Movie" ? "movie" : "tv"
          }?query=${encodeURIComponent(
            title
          )}&language=en-US&page=${currentPage}`;
        }
        console.log(url);

        const response = await axios(url, { method: "GET", headers });
        setData(response.data.results || []);
      } catch (error) {
        console.error("Data tidak tersedia", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [title, queryType, currentPage]);

  const handleList = (tv) => {
    setSelectedTV(tv);
    setOpenModal(true);
  };

  const handleFavorite = useCallback((search, type) => {
    setFavorites((prevFavorites) => {
      const isFavorite = Array.isArray(prevFavorites) && prevFavorites.some((fav) => fav.id === search.id && search.media_type === type);

      let updatedFavorites

      if(isFavorite) {
        updatedFavorites = prevFavorites.filter((fav) => fav.id !== search.id || fav.media_type !== type)
      } else {
        updatedFavorites = [{...search, media_type:type}, ...prevFavorites]
      }

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      return updatedFavorites
    })
  }, [])

  return (
    <div className="container mx-auto">
      <div className="my-4 media">
        <Title title={`${title} - ${queryType}` || "Unknown"} />

        {isLoading ? (
          <div className="flex justify-center items-center my-10">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {data.length === 0 ? (
              <div className="flex justify-center items-center my-10">
                <p>Tidak ada hasil yang ditemukan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-4 w-full">
                {data.map((search) => (
                  <ImageList
                    key={search.id}
                    type={queryType}
                    size={size}
                    item={search}
                    onClick={() => handleList(search)}
                    onFavorite={() => handleFavorite(search, type)}
                    favorites={favorites}
                  />
                ))}
              </div>
            )}
            <div className="flex justify-center xs md:text-base items-center my-5">
              {data.length >= 20 && (
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
                  type={queryType}
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

export default Search;
