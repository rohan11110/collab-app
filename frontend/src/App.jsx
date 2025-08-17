import React from "react";
import Routes from "./Routes";
import { useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  //  useEffect(() => {
  //   const testApi = async () => {
  //     try {
  //       const res = await axios.get("/api/test");
  //       console.log(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   testApi();
  // }, []);
  return (
    <>
    <Routes />
    <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored" 
      />
      </>
  );
}

export default App;
