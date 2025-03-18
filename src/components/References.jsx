import React from "react";
import { FaGoogleDrive, FaYoutube } from "react-icons/fa";
import "../styles/references.css";

const References = () => {
    return (
        <div className="references">
            <a href="https://drive.google.com/drive/folders/1-aDdvUXWqQ5n66hyRjguIQrzmekEmzwi?usp=drive_link" target="_blank" rel="noopener noreferrer">
                <FaGoogleDrive className="reference-icon" />
            </a>
            <a href="https://youtube.com/playlist?list=PLgz65rBM8yUFK0qJv-TYdOOwrJW2dyLLY&si=MwBBWjArK3te7KaR" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="reference-icon" />
            </a>
        </div>
    );
};

export default References;