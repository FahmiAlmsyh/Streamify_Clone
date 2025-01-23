import { Link } from "react-router-dom";
import "../style/styles.css";
const ImageCard = ({ item, type, onClick, size, onFavorite, favorites }) => {
  const truncateText = (text, charLimit) => {
    if (!text) return "";
    return text.length > charLimit
      ? text.substring(0, charLimit) + "..."
      : text;
  };

  const isFavorited = Array.isArray(favorites) && favorites.some((fav) => fav.id === item.id);

  return (
    <div className="relative cursor-pointer mt-3">
      <div
        className={` ${
          size === "Full" ? "w-full" : "w-80"
        } group h-40 md:h-full overflow-hidden relative rounded`}
        onClick={onClick}
      >
        <img
          src={"https://image.tmdb.org/t/p/w500" + item.backdrop_path}
          className="object-cover w-full h-full group-hover:scale-105 duration-300 ease-in-out "
          alt={item.title}
        />
        <div className="absolute w-full h-full bg-[#000]/50 top-0 group-hover:opacity-100 opacity-0 duration-300 ease-in-out"></div>
      </div>

      {type && <Link to={type === "TV Show" ? "/Serial" : "/Movies"} className="absolute top-1 type right-1">{type}</Link>}

      <div className="absolute bottom-0 left-0 w-full p-2 overflow-hidden text-white rounded-b bg-gradient-to-t from-black to-transparent">
        <h3 className="text-xs md:text-sm font-semibold">
          {truncateText(item.name || item.title, 33)}
        </h3>

        <div
        onClick={() => onFavorite(item)}
        className={`absolute bottom-1 right-1 love rounded-full ${isFavorited ? "favorited" : ""}`}
      >
        <i className={`fa-solid ${isFavorited ? "fa-heart-broken" : "fa-heart"}`}></i>
      </div>
      </div>
    </div>
  );
};

export default ImageCard;
