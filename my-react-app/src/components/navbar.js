import React from "react";

// import { Navbar, Nav } from "react-bootstrap";

const NavBAR = () => {
   

    // const handleSearchSubmit = (e) => {
    //     e.preventDefault();
    //     fetch(`/api/data?search=${searchQuery}`)
    //       .then((response) => response.json())
    //       .then((data) => {
    //         // Update the UI with the filtered data
    //       })
    //       .catch((error) => {
    //         console.error('Error fetching filtered data:', error);
    //       });
    //   };

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <a href="/data">SARASNIYAM</a>
      </div>
      <div className="navbar-links">
        <a href="/data" className="nav-link">
          <b>VIEW</b>
        </a>
        <a href="/upload" className="nav-link">
          <b>UPLOAD</b>
        </a>
      </div>
     
    </div>
  );
};

export default NavBAR;
