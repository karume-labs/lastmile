"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle2, XCircle } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropzone } from "@/components/ui/dropzone";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Expected Row Structure
export interface BeneficiaryRow {
  fullName: string;
  phoneNumber: string;
  currency: string;
  isProxy: boolean;
}

export const BulkUploadZone = () => {
  const [data, setData] = useState<BeneficiaryRow[]>([]);

  const mutation = useMutation({
    mutationFn: async (payload: BeneficiaryRow[]) => {
      const response = await axios.post("/api/registration/bulk-upload", payload);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(`Successfully uploaded ${res.referenceIds?.length} records!`);
      setData([]); // Reset after successful upload
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Failed to upload the batch.");
    },
  });

  const parseFile = async (file: File) => {
    const isCSV = file.name.endsWith(".csv");

    if (isCSV) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = (results.data as Record<string, unknown>[]).map((row) => ({
            fullName: String(row.FullName || row.fullName || ""),
            phoneNumber: String(row.PhoneNumber || row.phoneNumber || ""),
            currency: String(row.Currency || row.currency || ""),
            isProxy: String(row.IsProxy || row.isProxy).toLowerCase() === "true",
          }));
          setData(parsed);
        },
      });
    } else {
      // Excel parse
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      const parsed = json.map((row) => ({
        fullName: String(row.FullName || row.fullName || ""),
        phoneNumber: String(row.PhoneNumber || row.phoneNumber || ""),
        currency: String(row.Currency || row.currency || ""),
        isProxy: String(row.IsProxy || row.isProxy).toLowerCase() === "true",
      }));
      setData(parsed);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      parseFile(acceptedFiles[0]);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Bulk Upload Beneficiaries</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Dropzone
          options={{
            onDrop: handleDrop,
            accept: {
              "text/csv": [".csv"],
              "application/vnd.ms-excel": [".xls"],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            },
            maxFiles: 1,
          }}
          title="Drag and drop your file here"
          subtitle="Supports .csv, .xls, .xlsx"
        />

        {data.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview ({data.length} rows)</h3>
              <Button onClick={() => mutation.mutate(data)} disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Batch"}
              </Button>
            </div>

            <div className="border rounded-md max-h-100 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Is Proxy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 100).map((row, i) => (
                    <TableRow key={`${row.phoneNumber}-${i}`}>
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.phoneNumber}</TableCell>
                      <TableCell>{row.currency}</TableCell>
                      <TableCell>
                        {row.isProxy ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {data.length > 100 && (
              <p className="text-xs text-muted-foreground text-center">
                Showing first 100 rows. {data.length - 100} more not displayed.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
