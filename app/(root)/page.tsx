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

      {/* Display all the videos with Video and User Metadata */}
      {
        // Check if video length is valid
        videos?.length > 0 ? (
          <section className="video-grid">
            {videos.map((_, item) => (
              <p>{}</p>
            ))}
          </section>
        ) : (
          <div>EMPTY</div>
        )
      }
    </main>
  );
};

export default Page;
