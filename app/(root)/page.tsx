import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import { getAllVideos } from "@/lib/action/video";
import React from "react";

const Page = async ({ searchParams }: SearchParams) => {
  // Destructure the SeachParams
  const { query, filter, page } = await searchParams;

  // Load all the Video and User Metadata
  const { videos, pagination } = await getAllVideos(
    query,
    filter,
    Number(page) || 1
  );

  return (
    <main className="wrapper page">
      <Header title="All Video" subHeader="Public Library" />
      <h1 className="text-2xl font-karla">Welcome to Loom Clone</h1>

      {/* Dummy Video Card */}

      {/* Display all the videos with Video and User Metadata */}
      {}
    </main>
  );
};

export default Page;
