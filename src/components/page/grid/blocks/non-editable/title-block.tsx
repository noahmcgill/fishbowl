import { type TitleConfig } from "@/store/types";
import React from "react";
import { BlockContainer } from "./block-container";

interface TitleBlockProps {
  blockKey: string;
  config: TitleConfig;
}

export const TitleBlock: React.FC<TitleBlockProps> = ({ blockKey, config }) => {
  return (
    <BlockContainer blockKey={blockKey} isTitle={true}>
      <div className="no-scrollbar title-block w-full min-w-0 overflow-x-auto whitespace-nowrap">
        <div className="text-2xl font-bold text-black" role="textbox">
          {config.title}
        </div>
      </div>
    </BlockContainer>
  );
};
