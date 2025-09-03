import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import React from "react";

const Page = async ({ searchParams }: SearchParams) => {
  // Destructure the SeachParams
  const { query, filter, page } = await searchParams;
  return (
    <main className="wrapper page">
      <Header title="All Video" subHeader="Public Library" />
      <h1 className="text-2xl font-karla">Welcome to Loom Clone</h1>

      {/* Dummy Video Card */}

      <section className="video-grid">
        {dummyCards.map((card) => (
          <VideoCard key={card.id} {...card}></VideoCard>
        ))}
      </section>
    </main>
  );
};

export default Page;
