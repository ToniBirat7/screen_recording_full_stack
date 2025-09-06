"use client";

import { daysAgo } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const VideoDetailHeader = ({
  title,
  createdAt,
  userImg,
  username,
  videoId,
  ownerId,
  visibility,
  thumbnailUrl,
}: VideoDetailHeaderProps) => {
  const router = useRouter();
  return (
    <header className="detail-header">
      <aside className="user-info">
        <h1>{title}</h1>
        <figure>
          <button onClick={() => router.push(`/profile/${ownerId}`)}>
            <Image
              src={userImg || ""}
              alt="User"
              width={24}
              height={24}
              className="rounded-full"
            />
            <h2>{username ?? "Guest"}</h2>
          </button>
          <figcaption>
            <span className="mt-1">*</span>
            <p>{daysAgo(createdAt)}</p>
          </figcaption>
        </figure>
      </aside>
    </header>
  );
};

export default VideoDetailHeader;
