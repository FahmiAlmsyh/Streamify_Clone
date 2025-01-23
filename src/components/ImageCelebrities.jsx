const ImageCelebrities = ({ item }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer shrink-0 mt-3">
      <div className="w-48 h-auto overflow-hidden relative group rounded-full">
      <img
        src={"https://image.tmdb.org/t/p/w500" + item.profile_path}
        className="object-cover w-full h-48 rounded-full group-hover:scale-105 duration-300 ease-in-out"
        alt={item.name}
      />

      <div className="absolute w-full h-full bg-[#000]/50 top-0 group-hover:opacity-100 opacity-0 duration-300 ease-in-out"></div>
      </div>

      <h1 className="mt-5 text-lg font-bold">{item.name}</h1>
      <h3 className="text-base font-medium ">Pop: {item.popularity}</h3>
    </div>
  );
};

export default ImageCelebrities;