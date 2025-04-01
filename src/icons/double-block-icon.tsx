import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  stroke?: string;
}

export const DoubleBlockIcon: React.FC<IconProps> = ({ stroke = "white" }) => {
  return (
    <svg
      width="24"
      height="12"
      viewBox="0 0 24 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="10"
        rx="2.5"
        stroke={stroke}
        strokeLinejoin="round"
      />
    </svg>
  );
};
