"use client";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";

interface UserProfileImageProps {
  imageUrl: string | null;
  title: string | null;
}

export const UserProfileImage: React.FC<UserProfileImageProps> = ({
  imageUrl,
  title,
}) => {
  return (
    <div className="relative h-32 w-32 md:h-48 md:w-48">
      <Avatar className={`h-full w-full`}>
        <AvatarImage
          src={imageUrl || undefined}
          alt={`Profile image for ${title}`}
        />
        <AvatarFallback
          className={`bg-zinc-50 ${imageUrl ? "border-0" : "border-2"} ${imageUrl ? "" : "border-dashed"} ${imageUrl ? "" : "border-zinc-300"}`}
        >
          <div className="gap- flex flex-col items-center">
            <p className="font-medium text-zinc-600">{title}</p>
          </div>
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
