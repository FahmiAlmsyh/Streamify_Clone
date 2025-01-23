
const OpenModal = ({ children, open }) => {
  return (
    <div
      className={`fixed left-[50%] top-[55%] lg:top-[54%] md:top-[53%] transform -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[90%] md:w-[85%] xl:w-[50%] bg-black rounded-lg z-[9999] transition-all duration-300 max-h-[90%] overflow-y-auto ${open}`}
    >
      {children}
    </div>
  );
};

export default OpenModal;
