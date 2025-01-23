import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ScrollButton from "./ScrollButton";
import Title from "./Title";
import ImageCelebrities from "./ImageCelebrities";

const Celebrities = ({ title, link, url }) => {
  const [data, setData] = useState([]);
  const token = (import.meta.env.VITE_REACT_APP_API_KEY)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true)
        const url =
          "https://api.themoviedb.org/3/person/popular?language=en-US&page=1";

        const response = await axios(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              `Bearer ${token}`,
          },
        });

        setData(response.data.results);
      } catch (error) {
        console.log(error);
      } finally{
        setIsLoading(false)
      }
    };

    getData();
  }, [title]);
  return (
    <div
      className="container mx-auto "
      style={{ borderBottom: "1px solid rgba(255, 255, 255, .15)" }}
    >
      <div className="my-14 media">
        <Title title={title} showLink={link} link={url}/>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <p>Loading...</p>
          </div>
        ) : (

        <ScrollButton>
        {data.map((celebrity) => {
              return <ImageCelebrities key={celebrity.id} item={celebrity} />;
            })}
        </ScrollButton>
        )}
      </div>
    </div>
  );
};

export default Celebrities;