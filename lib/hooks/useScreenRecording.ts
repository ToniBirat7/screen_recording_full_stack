import { useState, useRef, useEffect } from "react";
import {
  getMediaStreams,
  createAudioMixer,
  setupRecording,
  cleanupRecording,
  createRecordingBlob,
  calculateRecordingDuration,
} from "@/lib/utils";

// Custom hook that encapsulates screen + audio recording logic
export const useScreenRecording = () => {
  // React state object for UI: whether recording, final blob/url, duration
  const [state, setState] = useState<BunnyRecordingState>({
    isRecording: false,
    recordedBlob: null, // Final Blob
    recordedVideoUrl: "", // Blob URL for Video Element Source
    recordingDuration: 0,
  });

  // Refs hold mutable objects that persist across renders but don't cause re-renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // the MediaRecorder instance
  const streamRef = useRef<ExtendedMediaStream | null>(null); // the combined MediaStream used by the recorder, single mixed audio from multiple streams
  const chunksRef = useRef<Blob[]>([]); // array to collect data available Blobs
  const audioContextRef = useRef<AudioContext | null>(null); // WebAudio AudioContext (used to mix audio)
  const startTimeRef = useRef<number | null>(null); // timestamp when recording started (for duration calculation)

  // Cleanup effect: runs on unmount and when recordedVideoUrl changes
  useEffect(() => {
    // Clean Up
    return () => {
      // Ensure any active recording stopped and resources freed on unmount
      stopRecording();
      // Revoke the object URL to free memory if we created one
      if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
      // Close the audio context if it exists (returns a Promise)
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close().catch(console.error);
      }

      audioContextRef.current = null;
    };
    // NOTE: dependency on state.recordedVideoUrl makes this run if URL changes and on unmount
  }, [state.recordedVideoUrl]);

  // Called when MediaRecorder stops — packages chunks into a blob/url and updates state
  const handleRecordingStop = () => {
    // createRecordingBlob bundles chunks into a Blob and returns an object URL
    const { blob, url } = createRecordingBlob(chunksRef.current);
    // Use system time to compute rough duration
    const duration = calculateRecordingDuration(startTimeRef.current);

    setState((prev) => ({
      ...prev,
      recordedBlob: blob,
      recordedVideoUrl: url,
      recordingDuration: duration,
      isRecording: false, // ensure UI reflects stopped status
    }));
  };

  // Start a new recording. `withMic` controls whether we also request microphone.
  const startRecording = async (withMic = true) => {
    try {
      // If something is already recording, stop/cleanup first
      stopRecording();

      // Ask browser for display (and mic) streams
      const { displayStream, micStream, hasDisplayAudio } =
        await getMediaStreams(withMic);

      // create an empty MediaStream that will contain the final video and single audio track that we feed into MediaRecorder
      const combinedStream = new MediaStream() as ExtendedMediaStream;

      // Add video tracks from the display stream (this is the actual screen content)
      displayStream
        .getVideoTracks()
        .forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));

      // As we'll have two kinds of Audio Tracks i.e. Browser Tab and Microphone and we want only one track so that the audio becomes consistent throught the video therefore we'll have to mix these audio into single track
      audioContextRef.current = new AudioContext();
      const audioDestination = createAudioMixer(
        audioContextRef.current,
        displayStream,
        micStream,
        hasDisplayAudio
      );

      // The audioDestination is a MediaStreamAudioDestinationNode (it has a .stream with audio tracks).
      // Add its audio tracks to the combined stream. That gives us a single, mixed audio track.
      audioDestination?.stream
        .getAudioTracks()
        .forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));

      // We lose some info after mixing, but incase if we need the two separate tracks in the future, for that we save the original streams
      // Save original streams for later cleanup. This is a custom property on the stream.
      combinedStream._originalStreams = [
        displayStream,
        ...(micStream ? [micStream] : []),
      ];
      // Assign the StreamRef to the combinedStream
      streamRef.current = combinedStream; // Save the combinedstream into StreamRef

      // Logger to check what's being recorded
      console.log(
        "combinedStream tracks:",
        combinedStream
          .getTracks()
          .map((t) => ({ kind: t.kind, label: t.label, id: t.id }))
      );

      // Create media recorder and attach handlers for future blob events
      mediaRecorderRef.current = setupRecording(combinedStream, {
        onDataAvailable: (e) => e.data.size && chunksRef.current.push(e.data), // Push the Raw Frames -> Encoded Frames -> Playableformat -> Blob into the chunkRef Array
        onStop: handleRecordingStop,
      });

      // Reset chunk buffers if any from past and set the start time
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      // Start the recorder; pass a timeslice of 1000ms to receive periodic dataavailable events
      mediaRecorderRef.current.start(1000);

      // Update UI state
      setState((prev) => ({ ...prev, isRecording: true }));
      return true;
    } catch (error) {
      // If any step fails (permission denied, etc.), log and return false
      console.error("Recording error:", error);
      return false;
    }
  };

  // Stop Recording and free resources
  const stopRecording = () => {
    cleanupRecording(
      mediaRecorderRef.current,
      streamRef.current,
      streamRef.current?._originalStreams
    );
    // Clear ref to combined stream
    streamRef.current = null;
    // Set UI state to reflect stopped (note: handleRecordingStop will set the recorded blob/url)
    setState((prev) => ({ ...prev, isRecording: false }));
  };

  // Reset clears recorded data and revokes URLs
  const resetRecording = () => {
    stopRecording();
    if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
    setState({
      isRecording: false,
      recordedBlob: null,
      recordedVideoUrl: "",
      recordingDuration: 0,
    });
    startTimeRef.current = null;
  };

  // Export state and controls
  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
