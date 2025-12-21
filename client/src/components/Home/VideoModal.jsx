import React, { useEffect } from "react";
import "./VideoModal.css";
import demoVideo from "./demo.mp4"; // ✅ SAME FOLDER

const VideoModal = ({ onClose }) => {

    useEffect(() => {
        // LOCK background scroll
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="vm-overlay" onClick={onClose}>
            <div
                className="vm-box"
                onClick={(e) => e.stopPropagation()} // 🔥 prevents click-through
            >
                <button className="vm-close-btn" onClick={onClose}>✕</button>

                <video
                    className="vm-player"
                    controls
                    autoPlay
                    playsInline
                >
                    <source src={demoVideo} type="video/mp4" />
                    Your browser does not support video.
                </video>
            </div>
        </div>
    );
};

export default VideoModal;
