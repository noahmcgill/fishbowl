export const isCsvDataNumeric = (rows: Record<string, string>[]): boolean => {
  if (rows.length === 0) return false;

  const headers = Object.keys(rows[0] ?? []);

  return rows.every((row) =>
    headers.every((header) => {
      const value = row[header]; // guaranteed to be string | undefined
      return (
        value !== undefined && value.trim() !== "" && !isNaN(Number(value))
      );
    }),
  );
};
