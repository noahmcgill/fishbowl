export const randomHexColor = () => {
  const r = () => Math.floor(Math.random() * 200);
  return `rgba(${r()}, ${r()}, ${r()}, 0.6)`;
};
