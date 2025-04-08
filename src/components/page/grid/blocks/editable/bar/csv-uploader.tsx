import React, { useState } from "react";
import Papa, { type ParseResult } from "papaparse";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isCsvDataNumeric } from "@/lib/utils/csv";

export type CsvRow = string[];

interface CsvUploaderProps {
  onUpload: (data: CsvRow[]) => Promise<void>;
}

// @todo: set max rows

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onUpload }) => {
  const [data, setData] = useState<CsvRow[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: false,
      skipEmptyLines: true,
      complete: (result: ParseResult<CsvRow>) => {
        if (!isCsvDataNumeric(data)) {
          toast.error("Some of the data points given are non-numeric.");

          setData([]);
          return;
        }

        setData(result.data);
      },
      error: () => {
        toast.error(
          "There was an error processing your CSV file. It might be a formatting issue.",
        );
        setData([]);
      },
    });
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col space-y-4 overflow-y-scroll">
      <div className="flex flex-col justify-items-center gap-2">
        <p>
          Please select a <b>.csv</b> file from your computer. For bar charts,
          CSV headers will be interpreted as series names, and the first cell of
          each row will be interpreted as x-axis labels. All other cell values
          must be numeric.
        </p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
          Label,Series 1,Series 2,Series 3 <br />
          January,30,45,60 <br />
          February,35,50,65 <br />
          March,40,55,70 <br />
          April,50,60,80 <br />
        </pre>
        <Card className="mt-2 p-3">
          <Label htmlFor="csv-upload">Select CSV File</Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="h-[38px] cursor-pointer text-zinc-500 file:mr-5 file:cursor-pointer file:rounded-md file:px-3 file:py-1 file:font-medium file:text-zinc-700 file:transition-all file:duration-200 hover:file:bg-zinc-100"
            onChange={handleFileChange}
          />
        </Card>
      </div>

      <div className="flex w-full justify-end">
        <Button onClick={() => onUpload(data)} disabled={data.length < 1}>
          Add
        </Button>
      </div>
    </div>
  );
};
