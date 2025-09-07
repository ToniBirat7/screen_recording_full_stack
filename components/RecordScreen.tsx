"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/constants";
import { useRouter } from "next/navigation";

const RecordScreen = () => {
  const [isOpen, setIsOpen] = useState(false); // Open or Close Choose Dialogue Box

  const videoRef = useRef<HTMLVideoElement>(null); // Reference for the Video that is being recorded

  const closeOverlay = () => {
    setIsOpen(false);
  };

  const router = useRouter(); // Route after recording
  return (
    <div className="record">
      <button className="primary-btn" onClick={() => setIsOpen(true)}>
        <Image src={ICONS.record} alt="record" width={16} height={16}></Image>
        <span>Record a Video</span>
      </button>

      {/* onClick Record Button */}
      {isOpen && (
        <section className="dialog">
          <div className="overlay-record" onClick={closeOverlay}></div>
        </section>
      )}
    </div>
  );
};

export default RecordScreen;
