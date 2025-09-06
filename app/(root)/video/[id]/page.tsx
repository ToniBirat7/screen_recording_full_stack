import VideoPlayer from "@/components/VideoPlayer";
import { getVideoById } from "@/lib/action/video";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: Params) => {
  // Get the promise from params
  const { id } = await params;
  console.log("Video Id", id);

  // get videoId and UserId
  const { user, video } = await getVideoById(id);

  console.log("Func", await getVideoById(id));

  console.log("Video", video);
  console.log("User", video);

  // check for video
  if (!video) redirect("/404");

  return (
    <main className="wrapper page">
      <h1 className="text-2xl">{video.title}</h1>
      <section className="video-details">
        <div className="content">
          <VideoPlayer videoId={id}></VideoPlayer>
        </div>
      </section>
    </main>
  );
};

export default page;
