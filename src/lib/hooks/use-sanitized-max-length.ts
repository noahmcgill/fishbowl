import { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";

/**
 * Custom hook that takes html content and a maxLength, sanitizes the tags and space codes,
 * and returns when the sanitized character limit is > 75% of the maxLength.
 *
 * @param html - html content string
 * @param sanitizedMaxLength - max length to check against
 * @returns The number of characters left (goes into negative) and if the characters
 * should be displayed (> 75% of the maxLength)
 */
export const useMaxLengthFromRichText = (
  html: string,
  sanitizedMaxLength?: number,
) => {
  const sanitizeAndCount = (html: string) =>
    DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }).replace(/&nbsp;/g, " ")
      .length;

  const [charNum, setCharNum] = useState<number>(sanitizeAndCount(html));

  useEffect(() => {
    setCharNum(sanitizeAndCount(html));
  }, [html]);

  return {
    charsLeft: sanitizedMaxLength ? sanitizedMaxLength - charNum : 0,
    displayCharsLeft: sanitizedMaxLength
      ? charNum >= Math.floor(sanitizedMaxLength * 0.75)
      : false,
    isPastMaxLength: sanitizedMaxLength
      ? sanitizedMaxLength - charNum < 0
      : false,
  };
};
