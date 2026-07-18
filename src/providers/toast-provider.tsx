'use client';

import React from "react";
import { Bounce, ToastContainer } from "react-toastify";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default ToastProvider;
