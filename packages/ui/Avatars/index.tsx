import Avatar from "boring-avatars";
import Image from "next/image";

const colors = ["#00C4B8", "#ccfbf1", "#334155"];

interface PersonAvatarProps {
  personId: string;
}

export const PersonAvatar: React.FC<PersonAvatarProps> = () => {
  return (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <mask id=":r0:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
        <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
      </mask>
      <g mask="url(#:r0:)">
        <rect width="36" height="36" fill="#ccfbf1"></rect>
        <rect
          x="0"
          y="0"
          width="36"
          height="36"
          transform="translate(5 -1) rotate(195 18 18) scale(1)"
          fill="#00C4B8"
          rx="6"></rect>
        <g transform="translate(3 -2) rotate(5 18 18)">
          <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" stroke-linecap="round"></path>
          <rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
          <rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
        </g>
      </g>
    </svg>
  );
};

interface ProfileAvatar {
  userId: string;
  imageUrl?: string | null;
}

export const ProfileAvatar: React.FC<ProfileAvatar> = ({ userId, imageUrl }) => {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        width="40"
        height="40"
        className="h-10 w-10 rounded-full object-cover"
        alt="Avatar placeholder"
      />
    );
  }
  return <Avatar size={40} name={userId} variant="bauhaus" colors={colors} />;
};
