export const randomHexColor = () => {
  const r = () => Math.floor(Math.random() * 200);
  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  return `#${toHex(r())}${toHex(r())}${toHex(r())}`;
};
