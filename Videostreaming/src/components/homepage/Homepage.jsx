import React, { useState, useRef } from "react";
import "./Homepage.css";

function Homepage({ setLoginUser, user }) {
  const [previewImage, setPreviewImage] = useState(null); // State for the preview image
  const [isSeeking, setIsSeeking] = useState(false); // To track progress bar interaction
  const backgroundVideoRef = useRef(null);
  const previewVideoRef = useRef(null); // Ref for the hidden video
  const canvasRef = useRef(null); // Offscreen canvas for extracting frames

  const handleHover = (event) => {
    if (isSeeking) return; // Skip hover behavior when user interacts with progress bar

    const video = backgroundVideoRef.current;
    const previewVideo = previewVideoRef.current;

    if (!previewVideo) return;

    const videoRect = video.getBoundingClientRect();
    const offsetX = event.clientX - videoRect.left;
    const hoverTime = (offsetX / videoRect.width) * video.duration;

    // Seek the hidden video to the hovered time
    previewVideo.currentTime = hoverTime;
    previewVideo.addEventListener(
      "seeked",
      () => {
        // Extract the frame from the hidden video
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
        setPreviewImage(canvas.toDataURL("image/png")); // Set the preview image
      },
      { once: true }
    );

    // Move the preview frame
    const previewFrame = document.querySelector(".preview-frame");
    if (previewFrame) {
      const previewFrameWidth = previewFrame.offsetWidth;
      const newLeft = offsetX - previewFrameWidth / 2; // Center the frame

      // Ensure preview frame stays within the video boundaries
      previewFrame.style.left = `${Math.min(
        Math.max(newLeft, 0),
        videoRect.width - previewFrameWidth
      )}px`;
    }
  };

  const handleMouseLeave = () => {
    setPreviewImage(null); // Clear the preview image
  };

  const handleSeek = (event) => {
    setIsSeeking(true);

    const video = backgroundVideoRef.current;
    const videoRect = video.getBoundingClientRect();
    const offsetX = event.clientX - videoRect.left;
    const newTime = (offsetX / videoRect.width) * video.duration;

    // Update the background video time
    if (video) {
      video.currentTime = newTime;
    }

    setTimeout(() => setIsSeeking(false), 200); // Reset seeking state
  };

  return (
    <div className="homepage">
      {/* Background video */}
      <video
        ref={backgroundVideoRef}
        className="background-video"
        controls
        autoPlay
        loop
        muted
        onMouseMove={handleHover}
        onMouseLeave={handleMouseLeave}
        onClick={handleSeek} // Update video time on click
      >
        <source src="/assets/videoplayback.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video preview frame */}
      {previewImage && (
        <div className="preview-frame">
          <img
            src={previewImage}
            alt="Preview"
            className="preview-image"
          />
        </div>
      )}

      {/* Hidden video for frame extraction */}
      <video
        ref={previewVideoRef}
        className="hidden-video"
        src="/assets/videoplayback.mp4"
        style={{ display: "none" }}
      />

      {/* Offscreen canvas for extracting frames */}
      <canvas
        ref={canvasRef}
        className="offscreen-canvas"
        width="200" // Match preview image size
        height="120"
        style={{ display: "none" }}
      />

      <div className="logout-button" onClick={() => setLoginUser({})}>
        Logout
      </div>
    </div>
  );
}

export default Homepage;
