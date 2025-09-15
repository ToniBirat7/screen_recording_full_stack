import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
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

  console.log(`Videos`);
  console.log(videos);

  console.log("Thubnail URL");
  // console.log(videos[0].video.thumbnailUrl);

  query ? console.log(query) : console.log(false);

  return (
    <main className="wrapper page">
      <Header title="All Video" subHeader="Public Library" />
      <h1 className="text-2xl font-karla">Welcome to Loom Clone</h1>

      {/* Display all the videos with Video and User Metadata */}
      {
        // Check if video length is valid
        videos?.length > 0 ? (
          <section className="video-grid">
            {videos.map(({ video, user }) => (
              <VideoCard
                key={video.id}
                {...video}
                duration={video.duration ?? undefined}
                thumbnail={video.thumbnailUrl}
                userImg={user?.image || ""}
                username={user?.name || "Guest"}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            icon="/assets/icons/video.svg"
            title="No Videos Found"
            description="Try adjusting your search"
          ></EmptyState>
        )
      }
    </main>
  );
};

export default Page;
