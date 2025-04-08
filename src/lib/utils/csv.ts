export const isCsvDataNumeric = (rows: Record<string, string>[]): boolean => {
  if (rows.length === 0) return false;

  const headers = Object.keys(rows[0] ?? []);

  return rows.every((row, i) =>
    headers.every((header) => {
      const value = row[header];
      return (
        value !== undefined && value.trim() !== "" && !isNaN(Number(value))
      );
    }),
  );
};
