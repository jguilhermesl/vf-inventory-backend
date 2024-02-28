export const generateProductCode = (name: string) => {
  const parts = name.split(" ");
  const code = parts[0].slice(0, 3).toUpperCase() + parts[1].slice(0, 3).toUpperCase() + parts[parts.length - 1].slice(parts[parts.length - 1].length - 3, parts[parts.length - 1].length).toUpperCase();
  return code;
}