import React, { useState, useEffect } from "react";
import {
  FaAngleDown,
  FaSearch,
  FaBars,
  FaGlobe,
  FaTimes,
} from "react-icons/fa";
import "./sass/index.css";
import logo from "../../images/logo.png";

const navData = [
  {
    Shipping: [
      "Ship Quick & Simple",
      "Shipping Tools",
      "Get Transit Times",
      "Schedule & Manage Pickups",
      "Packaging & Shipping Supplies",
      "ALL SHIPPING SERVICES",
    ],
  },
  {
    Tracking: [
      "Advanced Shipment Tracking",
      "Track by Email",
      "Track by Mobile",
      "ALL TRACKING SERVICES",
    ],
  },
  { Support: ["Customs Tools", "Locations", "CONTACT US"] },
  { Account: ["My Profile", "Address Book", "OPEN AN ACCOUNT"] },
];

const Nav = () => {
  const [location, setLocation] = useState();

  // fetch user location from local storage if already saved else query the GeoApify API
  useEffect(() => {
    let location = sessionStorage.getItem("location");
    if (location) {
      setLocation(location);
    } else {
      var requestOptions = {
        method: "GET",
      };

      fetch(
        "https://api.geoapify.com/v1/ipinfo?&apiKey=4a05d7b0302849b49a8fd2b8ac34bbaa",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setLocation(result.country.iso_code);
          sessionStorage.setItem("location", result.country.iso_code);
        })
        .catch((err) => console.error(err.response));
    }
  }, []);

  const globe = (
    <>
      <span className="d-flex aic lang">
        <FaGlobe /> {location || "..."}
      </span>
    </>
  );

  return (
    <>
      {/* overlay for large screen dropdown */}
      <div
        className="navoverlay"
        onClick={({ currentTarget: c }) => {
          // this is set to open within the nav element
          c.classList.remove("open");

          // nav element
          c.nextElementSibling
            .querySelector("li.active")
            ?.classList.remove("active");
          c.nextElementSibling
            .querySelector(".searchicon")
            ?.classList.remove("open");
        }}
      ></div>

      {/* navbar */}
      <nav>
        <div className="inner d-flex aic jcc">
          <img src={logo} alt={"logo"} />

          {/* globe */}
          {globe}

          {/* toggle */}
          <button
            aria-label="dropdown toggle"
            className="d-flex aic toggle"
            onClick={({ currentTarget: c }) => {
              // sets nav position to fixed
              c.parentElement.parentElement.classList.toggle("fixed");
              c.classList.toggle("open");
            }}
          >
            <FaBars className="svgbars" />
            <FaTimes className="svgclose" />
          </button>

          {/* dropdown */}
          <div className="dropdown">
            <ul className="mainul">
              {navData.map((it, id) => {
                return (
                  <li
                    key={id}
                    className="p-rel"
                    onClick={({ currentTarget: c }) => {
                      // close other active elements
                      let activeLi = c.parentElement.querySelector("li.active");
                      // check if active li is current target
                      activeLi !== c && activeLi?.classList.remove("active");

                      // toggle overlay
                      if (activeLi === null || activeLi !== c) {
                        document
                          .querySelector(".navoverlay")
                          .classList.add("open");
                      } else {
                        document
                          .querySelector(".navoverlay")
                          .classList.remove("open");
                      }

                      c.classList.toggle("active");

                      // close search form
                      c.parentElement.parentElement
                        .querySelector(".searchicon")
                        .classList.remove("open");
                    }}
                  >
                    {Object.keys(it)[0]} <FaAngleDown />
                    <ul>
                      {Object.values(it)[0].map((item, ind) => (
                        <li
                          key={ind}
                          onClick={() => {
                            let nav = document.querySelector("nav");
                            nav.classList.remove("fixed");
                            nav
                              .querySelector("button.toggle")
                              .classList.remove("open");
                          }}
                        >
                          <a href="#">{item}</a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>

            {/* globe */}
            {globe}

            {/* search icon */}
            <button
              aria-label="search toggle"
              className="searchicon d-flex aic jcc"
              onClick={({ currentTarget: c }) => {
                let overlay = document.querySelector(".navoverlay");
                c.classList.toggle("open");

                // toggle overlay
                c.classList.contains("open")
                  ? overlay.classList.add("open")
                  : overlay.classList.remove("open");

                c.parentElement
                  .querySelector("li.active")
                  .classList.remove("active");
              }}
            >
              <FaSearch className="search" /> <FaTimes className="close" />
            </button>

            {/* search from */}
            <form className="searchform">
              <input
                type="search"
                name="search"
                placeholder="Enter your tracking number"
              />
              <button type="submit" className="d-flex aic jcc">
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
