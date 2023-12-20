import React, { useRef, useEffect } from 'react';
const Modal = ({ children, onClose }) => {
  const modalRef = useRef();

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={handleOutsideClick}>
      <div ref={modalRef} className="bg-white p-4 rounded-lg shadow-lg  max-h-[90vh] overflow-auto mx-2">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-lg font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
