import React from "react";
import "./InfoBox.css";
import InfoIcon from "@material-ui/icons/Info";
import RotateIcon from "@material-ui/icons/Cached";
import MoveIcon from "@material-ui/icons/OpenWith";

export default function InfoBox() {
    return (
        <div className="info-box">
            <InfoIcon className="info-icon" />
            <ul className="info">
                <li>
                    <MoveIcon />
                    <span>Right click & drag</span>
                </li>
                <li>
                    <RotateIcon />
                    <span>"R"</span>
                </li>
            </ul>
        </div>
    );
}
