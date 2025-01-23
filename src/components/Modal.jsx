import { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ movie }) => {
  const [openModal, setOpenModal] = useState(false);
  const [video, setVideo] = useState(null);
  const [details, setDetails] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const formattedDate = new Date(movie.release_date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  );

  const token = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    const fetchVideos = async () => {
      setIsModalLoading(true);
      try {
        const url = `https://api.themoviedb.org/3/movie/${movie.id}/videos`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const trailer = response.data.results.find(
          (video) => video.type === "Trailer"
        );
        setVideo(trailer);
      } catch (error) {
        console.log("Gagal fetching videos", error);
      } finally {
        setIsModalLoading(false);
      }
    };

    const fetchDetails = async () => {
      setIsModalLoading(true); // Start loading
      try {
        const url = `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDetails(response.data);
      } catch (error) {
        console.log("Gagal fetching details:", error);
      } finally {
        setIsModalLoading(false);
      }
    };

    if (movie.id && openModal) {
      fetchVideos();
      fetchDetails();
    }
  }, [movie, openModal]);

  
  return (
    <>
      <button
        onClick={() => setOpenModal(!openModal)}
        className="flex items-center gap-2 p-3 font-semibold text-black duration-300 ease-in-out bg-white rounded-lg px-7 active:scale-90"
      >
        <i className="fa-solid fa-play"></i>
        <span>Play</span>
      </button>

      <div
        className={`fixed left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[85%] sm:w-[90%] lg:w-[50%] bg-black rounded-lg z-[9999] transition-all duration-300 max-h-[90%] overflow-y-auto ${
          openModal
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-50 pointer-events-none"
        }`}
      >
        <span
          onClick={() => setOpenModal(!openModal)}
          style={{ padding: "3px 10px" }}
          className="absolute z-10 text-lg font-semibold text-white bg-black rounded-full cursor-pointer top-3 right-3 "
        >
          <i className="fa-solid fa-xmark"></i>
        </span>

        {isModalLoading ? (
          <div className="flex justify-center items-center text-white">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w500${
                  movie.backdrop_path || ""
                })`,
              }}
              className="relative bg-cover bg-center bg-no-repeat h-[250px] lg:h-[450px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
            </div>

            <div className="flex flex-col gap-3 p-5 text-white lg:gap-5">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{movie.title}</h1>
                  <div className="type ">Movie</div>
                </div>
                <h3 className="text-lg font-medium">
                  <span>Genre: </span>
                  {details?.genres &&
                    details.genres.map((genre) => genre.name).join(", ")}
                  <p className="text-sm">{formattedDate}</p>
                </h3>
              </div>

              <p>{movie.overview || "Tidak ada deskripsi yang tersedia"}</p>

              {video && (
                <div className="mt-5">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-md">{video.name}</h3>
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Modal;
