import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserInfo.css";
import API_URL from "../config";

import profileIcon1 from "../images/profileIcon1.jpg";
import profileIcon2 from "../images/profileIcon2.jpg";
import profileIcon3 from "../images/profileIcon3.jpg";
import profileIcon4 from "../images/profileIcon4.jpg";
import profileIcon5 from "../images/profileIcon5.jpg";
import profileIcon6 from "../images/profileIcon6.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const icons = {
  profileIcon1,
  profileIcon2,
  profileIcon3,
  profileIcon4,
  profileIcon5,
  profileIcon6,
};

function UserInfo() {
  const [userData, setUserData] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState("profileIcon1");
  const [tempIcon, setTempIcon] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(API_URL + "/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserData(data);
        setSelectedIcon(data.avatar || "profileIcon1");
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const openPopup = () => {
    setTempIcon(selectedIcon);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveIcon = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch(API_URL + "/user/update-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: tempIcon }),
      });

      setSelectedIcon(tempIcon);
      setUserData((prev) => ({ ...prev, avatar: tempIcon }));
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <div className="user-info-container">
      {!userData ? (
        <p>Loading...</p>
      ) : (
        <div>
          {userData.isAdmin && (
            <button
              className="approve-users-button"
              onClick={() => navigate("/ApproveUser")}
            >
              Approve Users
            </button>
          )}
          <h2>Info</h2>
          <h3>Hi, {userData.username}!</h3>
          <p>Email: {userData.email}</p>
          <div className="profile-container">
            <img src={icons[selectedIcon]} alt="User Icon" className="profile-pic" />
            <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" onClick={openPopup} />
          </div>

          <div className="button-container">
            <button className="button logout-button" onClick={handleLogout}>
              Logout
            </button>
            <button className="back-to-button" onClick={handleBackToDashboard}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup">
          <h3>Select an Icon</h3>
          <div className="icon-selection">
            {Object.keys(icons).map((icon) => (
              <img
                key={icon}
                src={icons[icon]}
                alt={icon}
                className={`icon ${tempIcon === icon ? "selected-icon" : ""}`}
                onClick={() => setTempIcon(icon)}
              />
            ))}
          </div>
          <br />
          <button className="button" onClick={handleSaveIcon}>
            Save
          </button>
          <button className="button" onClick={closePopup}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
