import { Link } from "react-router-dom"

const Back = () => {
  return (
    <Link to={"/"} className="flex items-center gap-1 transform duration-300 text-white hover:text-red-600 mb-4 mt-2 max-w-fit">
        <i className="fa-solid fa-chevron-left"></i>
        <span>Back</span>
        </Link>
  )
}

export default Back