"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { apiFetch, withErrorHandling, getEnv } from "../utils";
import { BUNNY } from "@/constants";
import { db } from "@/drizzle/db";
import { videos } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import aj from "@/arcjet";
import { fixedWindow, request } from "@arcjet/next";

// Keys and Links
const VIDEO_STREAM_BASE_URL = BUNNY.STREAM_BASE_URL;
const THUMBNAIL_STORAGE_BASE_URL = BUNNY.STORAGE_BASE_URL;
const THUMBNAIL_CDN_URL = BUNNY.CDN_URL;
const BUNNY_LIBRARY_ID = getEnv("BUNNY_LIBRARY_ID");
const ACCESS_KEY = {
  streamAccessKey: getEnv("BUNNY_STREAM_ACCESS_API_KEY"),
  StorageAccessKey: getEnv("BUNNY_STORAGE_ACCESS_KEY"),
};

// Revalidate Paths
const revalidatePaths = (paths: string[]) => {
  paths.forEach((path) => {
    revalidatePath(path);
  });
};

// Helper Functions

// Get the Session Id
const getSessionUserId = async (): Promise<string> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unauthenticated");

  return session.user.id;
};

// ArcJet Validator, with fingerprint
const validateWithArcjet = async (fingerprint: string) => {
  // Implement Rate Limiting based on User ID
  const rateLimit = aj.withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m", // Minutes
      max: 1, // Max # of req per window
      characteristics: ["fingerprint"], // Characteristics Based on Fingerprint
    })
  );

  // Request
  const req = await request();

  // Create Decision
  const decision = await rateLimit.protect(req, { fingerprint }); // Protect the request that the user is trying with fingerprint constraint

  // Request is deined if the constraint is Violated
  if (decision.isDenied()) {
    throw new Error("Rate Limit Exceeded");
  }
};

// Server Actions
// Wrap with withErrorHandling function to avoid error for Video
export const getVideoUploadURL = withErrorHandling(async () => {
  // Current User from Session
  const sessionId = await getSessionUserId();

  console.log("AccessKey in server:", ACCESS_KEY.streamAccessKey);
  console.log(`The User Session id is : ${sessionId}`);

  // Api call to Bunny to get the Video Upload URL
  const videoResponse = await apiFetch<BunnyVideoResponse>(
    `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos`,
    {
      method: "POST",
      bunnyType: "stream",
      body: {
        title: "Temporary File",
        collectionId: "",
      },
    }
  );

  // Uploaded Video URL
  const uploadUrl = `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoResponse.guid}`;

  console.log("Upload URL");

  // return
  return {
    videoID: videoResponse.guid,
    uploadUrl,
    accessKey: ACCESS_KEY.streamAccessKey,
  };
});

// Wrap with withErrorHandling function to avoid error for Thumbnail, accepts VideoId
export const getThumbnailUploadURL = withErrorHandling(
  async (videoId: string) => {
    // Current User from Session
    await getSessionUserId();

    const fileName = `${Date.now()}-${videoId}-thumbnail`;
    const uploadUrl = `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${fileName}`;
    const cdnUrl = `${THUMBNAIL_CDN_URL}/thumbnails/${fileName}`;

    return {
      uploadUrl,
      cdnUrl,
      accessKey: ACCESS_KEY.StorageAccessKey,
    };
  }
);

// Save the Video URLs along with added metadata in our Database, Accepts videoDetails parameter that stores the form data
export const saveVideoDetails = withErrorHandling(
  async (videoDetails: VideoDetails) => {
    // Get the user
    const userId = await getSessionUserId();

    // Validate the Request with ArcJet Validation Function
    await validateWithArcjet(userId);

    // Use Video Details to Update the Title and Other Metadata in Bunny CDN
    await apiFetch(
      `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoDetails.videoId}`,
      {
        method: "POST",
        bunnyType: "stream",
        body: {
          title: videoDetails.title,
          description: videoDetails.description,
        },
      }
    );

    // Insert in the Database, with videos schema
    await db.insert(videos).values({
      ...videoDetails,
      videoUrl: `${BUNNY.EMBED_URL}/${BUNNY_LIBRARY_ID}/${videoDetails.videoId}`,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // After the insert we've to revalidate the path to make sure the user sees the latest change i.e. see the uploaded video in the UI not the older cache

    // Revalidate the home page after we insert the video
    revalidatePaths(["/"]);

    // Return VideoId
    return {
      videoID: videoDetails.videoId,
    };
  }
);

// Fecth all the metadata for all the videos of user
export const getAllVideos = withErrorHandling(
  async (
    searchQuery: string = "", // Query String for Search
    sortFilter?: string,
    pageNumber: number = 1, // Page Numb for Pagination
    pageSize: number = 8 // 8 Videos per page
  ) => {
    // Get Current User Id
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user.id;
  }
);
