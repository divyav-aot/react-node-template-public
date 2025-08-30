import React from "react";
import { Link } from "react-router";
import logo from "../../assets/images/logo-banner.png";

const Navigation: React.FC = () => {
  return (
    <nav>
      <Link to="/" className="brand">
        <img
          src={logo}
          alt="Go to the Government of British Columbia website"
        />
      </Link>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/states">States</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
