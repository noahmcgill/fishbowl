import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  stroke?: string;
}

export const SingleBlockIcon: React.FC<IconProps> = ({ stroke }) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="-0.5"
        y="0.5"
        width="10"
        height="10"
        rx="2.5"
        transform="matrix(-1 0 0 1 11 0)"
        stroke={stroke ?? "white"}
        strokeLinejoin="round"
      />
    </svg>
  );
};
