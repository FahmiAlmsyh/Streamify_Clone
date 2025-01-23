import { useEffect, useState } from "react";
import CardCelebrities from "../components/CardCelebrities";
import Title from "../components/Title";
import "../style/styles.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Pagination } from "flowbite-react";

const CelebritiesPage = ({ title, url }) => {
  const [data, setData] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const initialPage = params.id ? Number(params.id) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const token = import.meta.env.VITE_REACT_APP_API_KEY;
  const [isLoading, setIsLoading] = useState(true);

  const onPageChange = (page) => {
    setCurrentPage(page);
    navigate(`/${url}/${page}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const url = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}`;

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
    };
    getData();
  }, [currentPage]);
  return (
    <div className="container mx-auto">
      <div className="my-4 media">
        <Title title={title} />

        {isLoading ? (
          <div className="flex justify-center items-center my-10">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-4 w-full">
              {data.map((celeb) => (
                <CardCelebrities key={celeb.id} item={celeb} />
              ))}
            </div>

            <div className="flex justify-center md:text-base xs items-center my-5">
              <Pagination
                totalPages={500}
                showIcons
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CelebritiesPage;
