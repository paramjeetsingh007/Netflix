import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Homepage.css";

function Homepage({ setLoginUser, user }) {
  const [previewTime, setPreviewTime] = useState(null); // State to track the preview time
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Set video progress from user data
      videoRef.current.currentTime = user.videoProgress || 0;
    }
  }, [user]);

  const handleLogout = async () => {
    if (videoRef.current) {
      // Save current video progress to the backend
      const progress = videoRef.current.currentTime;
      await axios.post("http://localhost:9002/save-progress", {
        email: user.email,
        videoProgress: progress,
      });
    }
    setLoginUser({});
  };

  const handleHover = (event) => {
    const video = videoRef.current;
    const videoRect = video.getBoundingClientRect();
    const offsetX = event.clientX - videoRect.left;
    const newTime = (offsetX / videoRect.width) * video.duration;

    setPreviewTime(newTime); // Update the preview time based on hover position

    // Ensure preview video plays when hovering
    const previewVideo = previewVideoRef.current;
    if (previewVideo) {
      previewVideo.currentTime = newTime;
      previewVideo.play(); // Start playing the preview video
    }

    // Move the preview frame based on hover position
    const previewFrame = document.querySelector('.preview-frame');
    if (previewFrame) {
      const previewFrameWidth = previewFrame.offsetWidth;
      const newLeft = offsetX - previewFrameWidth / 2; // Center the frame on the hover
      previewFrame.style.left = `${Math.min(
        Math.max(newLeft, 0),
        videoRect.width - previewFrameWidth
      )}px`; // Prevent the frame from going outside the video
    }
  };

  const handleMouseLeave = () => {
    setPreviewTime(null); // Hide the preview when the mouse leaves the video

    // Pause the preview video when the mouse leaves
    const previewVideo = previewVideoRef.current;
    if (previewVideo) {
      previewVideo.pause();
    }
  };

  return (
    <div className="homepage">
      <video
        ref={videoRef}
        className="background-video"
        controls
        autoPlay
        loop
        muted
        onMouseMove={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <source src="/assets/videoplayback.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video preview frame */}
      {previewTime !== null && (
        <div className="preview-frame">
          <video
            ref={previewVideoRef}
            className="preview-video"
            src="/assets/videoplayback.mp4"
            currentTime={previewTime}
            muted
            loop
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div className="logout-button" onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
}

export default Homepage;
