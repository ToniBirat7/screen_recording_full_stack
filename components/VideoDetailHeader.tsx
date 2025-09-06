"use client";

import { daysAgo } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const [copy, setCopy] = useState(false);

  // Handle Copy
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`);
    console.log(
      "Copied URL is : ",
      `${window.location.origin}/video/${videoId}`
    );
    setCopy(true);
  };

  // UseEffect to Change the Checked Logo After Sometime
  useEffect(() => {
    const changeChecked = setTimeout(() => {
      if (copy) setCopy(false);
    }, 2000); // After 2 Seconds

    // CleanUp Timeout Function
    return clearTimeout(changeChecked);
  }, [copy]);
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
      <aside className="cta">
        <button onClick={handleCopyLink}>
          <Image
            src={copy ? "/assets/images/checked.png" : "/assets/icons/link.svg"}
            alt="copy"
            width={24}
            height={24}
          />
        </button>
      </aside>
    </header>
  );
};

export default VideoDetailHeader;
