import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const VideoCard = ({ peer }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Handle the incoming stream from the peer
    const handleStream = (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    };

    // Attach event listeners
    peer.on("stream", handleStream);
    peer.on("track", (track, stream) => {
      // Additional handling if needed
    });

    // Clean up event listeners on unmount
    return () => {
      peer.off("stream", handleStream);
    };
  }, [peer]);

  return <Video playsInline autoPlay ref={ref} />;
};

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

export default VideoCard;
