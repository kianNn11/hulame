import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const toastClasses = `toast ${type} toast-show`;

  return (
    <div className={toastClasses}>
      <div className="toast-content">
        {message}
      </div>
    </div>
  );
};

export default Toast;
