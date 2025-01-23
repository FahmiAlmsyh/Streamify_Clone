import { useLocation, useNavigate, useParams } from "react-router-dom";
import Title from "../components/Title";
import "../style/styles.css";
import ImageList from "../components/ImageList";
import { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";

const Favorites = ({ title, size, url }) => {
  const location = useLocation();
  const { favorites: locationFavorites } = location.state || {};
  const [favorites, setFavorites] = useState(locationFavorites || []);
  const navigate = useNavigate();
  const params = useParams();
  const initialPage = params.id ? Number(params.id) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const itemsPerPage = 20;

  const onPageChange = (page) => {
    setCurrentPage(page);
    navigate(`/${url}/${page}`);
  };

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, [currentPage]);

  const handleFavorite = (movie) => {
    const isDuplicate = favorites.some((fav) => fav.id === movie.id);

    const updatedFavorites = isDuplicate
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [{ ...movie }, ...favorites];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const paginatedFavorites = favorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto">
      <div className="my-4 media">
        <Title title={title} />
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full mt-3 lg:grid-cols-4 xl:gap-4">
            {paginatedFavorites.map((item) => (
              <ImageList
                key={`${item.id}-${item.media_type || "unknown"}`}
                size={size}
                item={item}
                onFavorite={handleFavorite}
                favorites={favorites}
              />
            ))}
          </div>
        ) : (
          <p className="text-center my-4">
            Tidak ada favorite yang ditambahkan!
          </p>
        )}

        
        {favorites.length > itemsPerPage && (
          <div className="flex justify-center items-center my-5">
            <Pagination
              totalPages={Math.ceil(favorites.length / itemsPerPage)}
              showIcons
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;