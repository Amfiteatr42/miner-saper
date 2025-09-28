import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ onClose, children, title = '', className = '' }) => {
  const [fadeType, setFadeType] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    setFadeType('in');
    function closeOnESC(e) {
      if (e.key === 'Escape') {
        setFadeType('out');
        return;
      }
    }
    document.body.addEventListener('keydown', closeOnESC);
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';

    return () => {
      document.body.removeEventListener('keydown', closeOnESC);
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = 'unset';
    };
  }, []);

  function closeOnBackdropClick(e) {
    if (e.currentTarget === e.target) {
      setFadeType('out');
    }
  }

  function transitionEnd(e) {
    if (e.propertyName !== 'opacity' || fadeType === 'in') return;
    if (fadeType === 'out') {
      onClose();
    }
  }

  return createPortal(
    <div
      className={`win-bg fixed inset-0 z-2000 flex items-center opacity-0 justify-center duration-300 bg-black/50 transition-opacity overflow-y-auto ${
        fadeType === 'in' ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={closeOnBackdropClick}
      onTransitionEnd={transitionEnd}
    >
      <div
        ref={modalRef}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[max(-50%,-48vh)]
 bg-white rounded-lg shadow-xl w-11/12 md:w-full max-w-md md:mx-4 transition-all overflow-hidden  ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 pb-0">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          <button
            onClick={() => setFadeType('out')}
            className="p-1 w-10 h-10 cursor-pointer ml-auto rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            &#10005;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};
