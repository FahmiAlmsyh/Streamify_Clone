import axios from "axios";
import { Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Title = ({ title, showLink, dropdown, onGenreChange, link }) => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const token = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    const getGenres = async () => {
      try {
        let url = "";
        if (title === "TV Shows") {
          url ="https://api.themoviedb.org/3/genre/tv/list?language=en";
        } else {
          url ="https://api.themoviedb.org/3/genre/movie/list?language=en";
        }
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

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <span
          style={{
            backgroundColor: "red",
            height: "2rem",
            width: "0.2rem",
          }}
        ></span>
        <h2 className="text-2xl font-medium">{title}</h2>
      </div>
      {showLink && (
        <Link to={link} className="flex items-center">
          <span>See More</span>
          <span className="ms-1">
            <i className="fa-solid fa-chevron-right"></i>
          </span>
        </Link>
      )}
      {dropdown && (
        <Dropdown label="Genre" inline>
          {genres &&
            genres.map((genre) => (
              <Dropdown.Item
                key={genre.id}
                onClick={() => onGenreChange(genre.id, genre.name)}
              >
                {genre.name}
              </Dropdown.Item>
            ))}
        </Dropdown>
      )}
    </div>
  );
};

export default Title;
