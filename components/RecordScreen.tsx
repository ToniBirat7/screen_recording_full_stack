"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/constants";
import { useRouter } from "next/navigation";
import { useScreenRecording } from "@/lib/hooks/useScreenRecording";

const RecordScreen = () => {
  const router = useRouter(); // Route after recording

  const [isOpen, setIsOpen] = useState(false); // Open or Close Choose Dialogue Box

  const videoRef = useRef<HTMLVideoElement>(null); // Reference for the Video that is being recorded

  // Overlay for closing
  const closeOverlay = () => {
    // If we close the overlay we need to reset the recording
    resetRecording();
    setIsOpen(false);
  };

  // useScreenRecordingHook
  const {
    resetRecording,
    stopRecording,
    startRecording,
    isRecording,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
  } = useScreenRecording();

  // Handle Recording Start
  const handleStart = async () => {
    await startRecording();
  };

  // Handle Record Again
  const recordAgain = async () => {
    resetRecording();
    await startRecording();

    if (recordedVideoUrl && videoRef.current) {
      videoRef.current.src = recordedVideoUrl;
    }
  };

  // Handle Upload
  const goToUpload = () => {
    
  };

  return (
    <div className="record">
      <button className="primary-btn" onClick={() => setIsOpen(true)}>
        <Image src={ICONS.record} alt="record" width={16} height={16}></Image>
        <span>Record a Video</span>
      </button>

      {/* onClick Record Button */}
      {isOpen && (
        <section className="dialog">
          <div className="overlay-record" onClick={closeOverlay} />

          {/* Close Btn */}

          <div className="dialog-content">
            <figure>
              <h3>Screen Recording</h3>
              <button onClick={closeOverlay}>
                <Image
                  src={ICONS.close}
                  alt="Close"
                  width={20}
                  height={20}
                ></Image>
              </button>
            </figure>

            {/* Start Recording Button */}

            <section>
              {/* If the Recording is in Progress */}
              {/* If we've a Recorded Video Show Video */}
              {isRecording ? (
                <article>
                  <div className=""></div>
                  <span>Recording in Progress</span>
                </article>
              ) : recordedVideoUrl ? (
                <video ref={videoRef} src={recordedVideoUrl} controls></video>
              ) : (
                <p>Click record to start capturing your screen</p>
              )}
            </section>

            {/* If there is no Recording display Record Button */}

            <div className="record-box">
              {!isRecording && !recordedVideoUrl && (
                <button onClick={handleStart} className="record-start">
                  <Image
                    src={ICONS.record}
                    alt="record"
                    width={16}
                    height={16}
                  ></Image>
                  Record
                </button>
              )}

              {/* If the Recording is in Progress then Display Stop Recording */}

              {isRecording && (
                <button onClick={stopRecording}>
                  <Image
                    src={ICONS.record}
                    alt="record"
                    height={16}
                    width={16}
                  ></Image>
                  Stop Recording
                </button>
              )}

              {/* If we've recorded the video */}
              {recordedVideoUrl && (
                <>
                  {/* Rerecord button */}
                  <button onClick={recordAgain} className="record-again">
                    Record Again
                  </button>
                  {/* Upload the recorded video */}
                  <button onClick={goToUpload}>
                    <Image
                      src={ICONS.upload}
                      alt="upload"
                      width={16}
                      height={16}
                    ></Image>
                    Continue to Upload
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecordScreen;
