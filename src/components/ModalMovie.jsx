import React, { useEffect, useState } from "react";
import axios from "axios";

const ModalMovie = ({ movie, onClose, type }) => {
  const [details, setDetails] = useState(null);
  const [video, setVideo] = useState(null);
  const token = (import.meta.env.VITE_REACT_APP_API_KEY)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!movie?.id) return;

        const url =
          type === "Movie"
            ? `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`
            : `https://api.themoviedb.org/3/tv/${movie.id}/videos?language=en-US`;

        const response = await axios.get(url, {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });
        const trailer = response.data.results.find(
          (video) => video.type === "Trailer"
        );
        setVideo(trailer);
      } catch (error) {
        console.error("Gagal untuk fetch videos:", error);
      }
    };

    if (movie?.id) {
      fetchVideos();
    }
  }, [movie, type]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!movie?.id) return;

        const url =
          type === "Movie"
            ? `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`
            : `https://api.themoviedb.org/3/tv/${movie.id}?language=en-US`;

        const response = await axios.get(url, {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setDetails(response.data);
      } catch (error) {
        console.error("Gagal fetching detail", error);
      }
    };

    if (movie?.id) {
      fetchDetails();
    }
  }, [movie, type]);

  if (!details) {
    return <div className="text-center">Loading...</div>;
  }

  const formattedDateMov = details.release_date
    ? new Date(details.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "N/A";

  const formattedDateTv = details.last_air_date
    ? new Date(details.last_air_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "N/A";

  return (
    <div>
      <span
        onClick={onClose}
        style={{ padding: "3px 10px" }}
        className="absolute z-10 text-lg font-semibold text-white bg-black rounded-full cursor-pointer top-3 right-3"
      >
        <i className="fa-solid fa-xmark"></i>
      </span>

      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${
            details.backdrop_path || ""
          })`,
        }}
        className="relative bg-cover bg-center bg-no-repeat h-[250px] md:h-[450px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
      </div>

      <div className="flex flex-col gap-3 p-5 lg:gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {details.title || details.name || "Unknown"}
            </h1>
            <div className="type"> {type} </div>
          </div>
          <h3 className="text-lg font-medium">
            <span>Genre: </span>
            {details.genres
              ? details.genres.map((genre) => genre.name).join(", ")
              : "Unknown"}
          </h3>
          <p className="text-sm">
            {type === "Movie" ? formattedDateMov : formattedDateTv}
          </p>
        </div>

        <p>{details.overview || "Tidak ada deskripsi yang tersedia"}</p>

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
    </div>
  );
};

export default ModalMovie;
