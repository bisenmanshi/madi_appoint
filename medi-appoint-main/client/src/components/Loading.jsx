import React from "react";
import "../styles/loading.css";
// to show if page is loading or making some request 
function Loading() {
  return (
    <div className="loading">
      <div className="loader">Loading...</div>
    </div>
  );
  
}

export default Loading;
