import { Modal } from "flowbite-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  const token = (import.meta.env.VITE_REACT_APP_API_KEY)

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setQuery("");
    setSuggestions([]);
  };

  const handleSearch = (value) => {
    setSelectedIndex(0);
    setQuery(value);
  
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
  
    setIsLoading(true);
    
    clearTimeout(window.debounceTimeout);
    
    window.debounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${value}&include_adult=false&language=en-US&page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setSuggestions(data.results || []);
      } catch (error) {
        console.error("Gagal fetching data:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };
  

  const handleSuggestionClick = (item) => {
    const title = item.title || item.name;
    const type = item.media_type === "movie" ? "Movie" : "TV Show";
    navigate(`/Search?title=${title}&type=${type}`);
    handleCloseModal();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSuggestionClick(suggestions[selectedIndex]);
      setTimeout(() => {
        handleCloseModal();
      }, 0);

      setSelectedIndex(0);
    } else if (e.key === "ArrowDown") {
      if (selectedIndex < suggestions.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        scrollToSelectedItem(selectedIndex + 1);
      } else {
        setSelectedIndex(0);
        scrollToSelectedItem(0);
      }
    } else if (e.key === "ArrowUp") {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
        scrollToSelectedItem(selectedIndex - 1);
      }
    }
  };

  const scrollToSelectedItem = (index) => {
    const suggestionElement = suggestionsRef.current.children[index];
    if (suggestionElement) {
      suggestionElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  return (
    <>
      <div>
        <i
          onClick={handleOpenModal}
          className="text-2xl cursor-pointer fa-solid fa-magnifying-glass"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleOpenModal();
          }}
        ></i>
        <Modal show={openModal} position="center" onClose={handleCloseModal}>
          <Modal.Body
            className="flex items-center"
            style={{ borderBottom: "0.1px solid #666" }}
          >
            <div className="space-y-6 w-full">
              <div className="flex items-center gap-2">
                <i
                  style={{ color: "black" }}
                  className="fa-solid fa-magnifying-glass"
                ></i>
                <input
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 text-black"
                  style={{
                    borderColor: "none",
                    borderWidth: "0px",
                    outline: "none",
                    boxShadow: "none",
                  }}
                />
                <i
                  onClick={handleCloseModal}
                  className="fa-solid fa-xmark"
                  style={{ color: "black", cursor: "pointer" }}
                ></i>
              </div>
            </div>
          </Modal.Body>
          <Modal.Body className="p-2">
            <div
              className="space-y-6 max-h-72 overflow-y-auto"
              ref={suggestionsRef}
            >
              {isLoading && (
                <p className="text-black text-center">Loading...</p>
              )}
              {!isLoading &&
                suggestions.map((item, index) => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    style={{
                      listStyleType: "none",
                      padding: "15px",
                      borderRadius: "10px",
                    }}
                    className={`text-black cursor-pointer list hover:bg-red-600 hover:text-white ${
                      selectedIndex === index ? "bg-red-600 text-white" : ""
                    }`}
                  >
                    {item.title || item.name} ({item.media_type})
                  </li>
                ))}
              {!isLoading && suggestions.length === 0 && query && (
                <p className="text-black text-center">
                  Tidak ada hasil untuk "{query}"
                </p>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default SearchModal;
