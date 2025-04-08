export const isCsvDataNumeric = (data: string[][]): boolean => {
  if (data.length <= 1) {
    return true;
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    if (!row) {
      continue;
    }

    for (const cell of row) {
      if (isNaN(Number(cell))) {
        return false; // Return false if any cell is not a number
      }
    }
  }

  return true;
};
