export enum TRPCErrorCode {
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  BAD_REQUEST = "BAD_REQUEST",
  UNPROCESSABLE_CONTENT = "UNPROCESSABLE_CONTENT",
}

export const SLUG_COOKIE_NAME = "fishbowl.signup.slug";

export const PROFILE_IMAGE_ACCEPTED_MIMETYPES = [
  "apng",
  "avif",
  "gif",
  "jpeg",
  "png",
  "svg+xml",
  "webp",
];

export const INPUT_FORMATTED_MIMETYPES =
  PROFILE_IMAGE_ACCEPTED_MIMETYPES.reduce((acc, curr, i) => {
    const fullCurr = `image/${curr}`;

    if (i === 0) {
      return fullCurr;
    }

    return `${acc},${fullCurr}`;
  }, "");

export const imageMimeTypeRegex = new RegExp(
  `^image\/(${PROFILE_IMAGE_ACCEPTED_MIMETYPES.join("|")})$`,
);

// URL-safe slug (lowercase letters, numbers, and hyphens)
export const URL_SAFE_SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const METADATA_DOM_PURIFY_CONFIG = {
  ALLOWED_TAGS: ["b", "i", "p", "br", "div"],
};

export const BLOCK_DATA_DOM_PURIFY_CONFIG = {
  ALLOWED_TAGS: ["b", "i", "p"],
};

export const METADATA_TITLE_SANITIZED_MAX_LENGTH = 255;
export const METADATA_DESC_SANITIZED_MAX_LENGTH = 1000;
