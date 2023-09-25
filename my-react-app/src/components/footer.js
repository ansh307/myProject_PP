import React from "react";
 // Import your custom CSS for styling

function Footer() {
  return (
    <div className="footer bg-primary text-light">
      <p className="footerP">&copy; {new Date().getFullYear()} SARASNIYAM. All rights reserved.</p>
      <p className="footerP">created by : ANSH SONI and PARTH SAHU</p>

    </div>
  );
}

export default Footer;
