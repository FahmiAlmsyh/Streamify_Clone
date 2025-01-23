import { Card } from "flowbite-react";
import "../style/celeb.css"
const CardCelebrities = ({ item }) => {
  return (
    <Card
      className="max-w-sm bg-black text-white mt-3"
      renderImage={() => (
        
        <img
          width={500}
          height={500}
          src={"https://image.tmdb.org/t/p/w500" + item.profile_path}
          alt={item.name}
          
          className="rounded-t-lg object-cover md:h-80 h-40 object-center"
        />
      )}
    >
      <h5 className="text-2xl font-bold tracking-tight text-white">
        {item.name}
        <p className="text-sm font-medium">Popularity: {item.popularity}</p>
      </h5>

      <p className="font-base text-xs text-gray-300">
        {item.known_for.map((movie, index) => (
          <span key={index} className="my-1">
            {movie.title || movie.name}
            {index !== item.known_for.length - 1 && ", "}
          </span>
        ))}
      </p>
    </Card>
  );
};

export default CardCelebrities;
