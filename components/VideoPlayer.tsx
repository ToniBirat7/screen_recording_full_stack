import { createIframeLink } from "@/lib/utils";
import React from "react";

const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
  return (
    <div className="video-player">
      <iframe
        loading="lazy"
        src={createIframeLink(videoId)}
        title="Video Player"
        style={{ border: 0, zIndex: 50 }}
        allowFullScreen
        allow="accelerometer; gyroscope; autoplay; encrypted-media picture-in-picture"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
