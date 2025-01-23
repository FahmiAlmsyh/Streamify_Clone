import { Link } from "react-router-dom";
import "../style/styles.css";

const ImageList = ({ item, type, onClick, size, onFavorite, favorites }) => {
  const truncateText = (text, charLimit) => {
    if (!text) return "";
    return text.length > charLimit
      ? text.substring(0, charLimit) + "..."
      : text;
  };

  const isFavorited =
    Array.isArray(favorites) && favorites.some((fav) => fav.id === item.id);

  return (
    <div className="relative shrink-0 overflow-hidden cursor-pointer rounded mt-3">
      <div onClick={onClick} className="relative group h-full">
        <img
          className={`${
            size === "Full" ? "w-full" : "w-72"
          } h-full group-hover:scale-105 duration-300 ease-in-out object-fill`}
          src={"https://image.tmdb.org/t/p/w500" + item.poster_path}
          style={{ objectFit: "fill" }}
          alt={item.title}
        />
        <div className="absolute w-full h-full bg-[#000]/50 top-0 group-hover:opacity-100 opacity-0 duration-300 ease-out"></div>
      </div>

      {item.media_type ? (
        <Link
          to={item.media_type === "tv" ? "/Serial" : "/Movies"}
          className="absolute type top-1 right-1"
        >
          {item.media_type}
        </Link>
      ) : type ? (
        <Link
          to={type === "TV Show" ? "/Serial" : "/Movies"}
          className="absolute type top-1 right-1"
        >
          {type}
        </Link>
      ) : (
        <div className="absolute type top-1 right-1 hidden"></div>
      )}

      <div className="absolute bottom-0 left-0 w-full p-2 overflow-hidden text-white rounded-b bg-gradient-to-t from-black to-transparent">
        <h3 className="text-xs md:text-sm font-semibold">
          {truncateText(item.title || item.name, 38)}
        </h3>

        <div
          onClick={() => onFavorite(item)}
          className={`absolute bottom-1 right-1 love rounded-full ${
            isFavorited ? "favorited" : ""
          }`}
        >
          <i
            className={`fa-solid ${
              isFavorited ? "fa-heart-broken" : "fa-heart"
            }`}
          ></i>{" "}
        </div>
      </div>
    </div>
  );
};

export default ImageList;
