import { Avatar, Dropdown, Navbar } from "flowbite-react";
import "../style/styles.css";
import logo from "../assets/logo.svg";
import profile from "../assets/profile.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
const Nav = ({ favorites }) => {
  const location = useLocation();
  const navigate = useNavigate()
  const goToFavorites = () => {
    console.log("Navigating with favorites:", favorites);
    navigate("/Favorites/1", { state: { favorites } });
  };
  return (
    <Navbar className="sticky top-0 z-50 px-4 text-white bg-black">
      <Navbar.Brand href="/">
        <img src={logo} className="w-24 h-12" alt="" />
      </Navbar.Brand>

      <div className="flex items-center gap-3 md:order-2">
        <SearchModal />
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="User settings" img={profile} rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Fahmi Alamsyah</span>
            <span className="block text-sm font-medium truncate">
              alamsyahf100@gmail.com
            </span>
          </Dropdown.Header>
          {/* <Dropdown.Item>Account</Dropdown.Item>
          <Dropdown.Item onClick={goToFavorites}>Favorites</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item> */}
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          href="/"
          active={location.pathname === "/"}
          className={`text-base border-b border-gray-100 md:border-0 ${
            location.pathname === "/"
              ? "bg-red-600 text-white md:text-red-600"
              : "hover:bg-red-600 text-white md:hover:text-red-600"
          }`}
        >
          Home
        </Navbar.Link>

        <Navbar.Link
          href="/Serial"
          active={location.pathname.startsWith("/Serial")}
          className={`text-base border-b border-gray-100 md:border-0 ${
            location.pathname.startsWith("/Serial")
              ? "bg-red-600 md:text-red-600 text-white"
              : "hover:bg-red-600 text-white md:hover:text-red-600"
          }`}
        >
          TV Shows
        </Navbar.Link>

        <Navbar.Link
          active={location.pathname.startsWith("/Movies")}
          className={`text-base border-b border-gray-100 md:border-0 ${
            location.pathname.startsWith("/Movies")
              ? "bg-red-600 md:text-red-600 text-white"
              : "hover:bg-red-600 text-white md:hover:text-red-600"
          }`}
          href="/Movies"
        >
          Movies
        </Navbar.Link>
        <Navbar.Link
          active={location.pathname.startsWith("/Celebrities")}
          className={`text-base border-b border-gray-100 md:border-0 ${
            location.pathname.startsWith("/Celebrities")
              ? "bg-red-600 md:text-red-600 text-white"
              : "hover:bg-red-600 text-white md:hover:text-red-600"
          }`}
          href="/Celebrities/1"
        >
          Celebrities
        </Navbar.Link>
        <Navbar.Link
          active={location.pathname.startsWith("/Favorites")}
          className={`text-base border-b border-gray-100 md:border-0 ${
            location.pathname.startsWith("/Favorites")
              ? "bg-red-600 md:text-red-600 text-white"
              : "hover:bg-red-600 text-white md:hover:text-red-600"
          }`}
          href="/Favorites/1"
        >
          Favorites
        </Navbar.Link>
       
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
