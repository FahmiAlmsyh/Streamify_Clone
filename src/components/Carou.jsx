import { Carousel } from "flowbite-react";
import "../style/styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";

const Carou = () => {
  const [data, setData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const token = import.meta.env.VITE_REACT_APP_API_KEY;
  const [isLoading, setIsLoading] = useState(true);
  async function getData() {
    try {
      setIsLoading(true);
      const url =
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2";

      const response = await axios(url, {
        method: "GET",
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
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <Carousel slide={false}>
          {data.slice(0, 5).map((movie) => {
            return (
              <div
                key={movie.id}
                className="relative flex items-end justify-center h-screen bg-center bg-no-repeat bg-cover cursor-default"
                style={{
                  backgroundImage: `url("https://image.tmdb.org/t/p/w500${movie.backdrop_path}")`,
                }}
              >
                <div className="absolute inset-0 bg-black/50"></div>

                <div
                  className="absolute text-white w-full max-w-screen-2xl px-5 lg:px-10 mb-[15%] md:mb-[5%] flex flex-col gap-3 lg:gap-5 z-10"
                  style={{ width: "100%", bottom: "0", paddingLeft: "6%" }}
                >
                  <h1 className="text-2xl lg:text-4xl lg:w-[50%] font-bold">
                    {movie.title}
                  </h1>
                  <p>Click &quot;Play&quot; to see Detail</p>

                  <div className="flex items-center gap-3">
                    <Modal movie={movie} />
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      )}

      {selectedMovie && <Modal movie={selectedMovie} />}
    </div>
  );
};

export default Carou;
