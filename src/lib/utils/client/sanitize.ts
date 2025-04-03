import { type ContentEditableEvent } from "react-contenteditable";
import DOMPurify from "isomorphic-dompurify";

export const sanitizeAndSetContentNoLineBreaks = (
  e: ContentEditableEvent,
  config: Record<string, unknown>,
  setter: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const rawContent = e.target.value
    .replace(/<div>\s*<br\s*\/?>\s*<\/div>/g, " ")
    .replace(/<br\s*\/?>/g, " ");

  const sanitizedContent =
    rawContent === "" ? null : DOMPurify.sanitize(rawContent, config);
  setter(sanitizedContent);
};
