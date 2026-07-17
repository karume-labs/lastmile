"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle2, XCircle } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Expected Row Structure
export interface BeneficiaryRow {
  fullName: string;
  phoneNumber: string;
  currency: string;
  amount?: number;
  preferredLanguage: string;
  isProxy: boolean;
}

export interface BulkUploadZoneProps {
  onSuccess?: () => void;
  className?: string;
}

export const BulkUploadZone = ({ onSuccess, className }: BulkUploadZoneProps = {}) => {
  const queryClient = useQueryClient();
  const [data, setData] = useState<BeneficiaryRow[]>([]);
  const [programmeTitle, setProgrammeTitle] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("KES");

  const mutation = useMutation({
    mutationFn: async (payload: {
      programmeTitle: string;
      targetCurrency: string;
      records: BeneficiaryRow[];
    }) => {
      const response = await axios.post("/api/registration/bulk-upload", payload);
      return response.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["programmes"] });
      toast.success(`Successfully uploaded ${res.referenceIds?.length} records!`);
      setData([]); // Reset after successful upload
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Failed to upload the batch.");
    },
  });

  const parseFile = async (file: File) => {
    const isCSV = file.name.endsWith(".csv");

    const REQUIRED_COLUMNS = ["phonenumber", "amount"];

    const validateHeaders = (headers: string[]) => {
      const normalizedHeaders = headers.map((h) => h.toLowerCase().replace(/[\s_]/g, ""));
      for (const col of REQUIRED_COLUMNS) {
        if (
          !normalizedHeaders.includes(col) &&
          !normalizedHeaders.includes(col.replace("phonenumber", "phone"))
        ) {
          return false;
        }
      }
      return true;
    };

    const mapRow = (row: Record<string, unknown>): BeneficiaryRow => {
      const normalizedRow: Record<string, unknown> = {};
      for (const key in row) {
        const normalizedKey = key.toLowerCase().replace(/[\s_]/g, "");
        normalizedRow[normalizedKey] = row[key];
      }

      return {
        fullName: String(normalizedRow.fullname || normalizedRow.name || ""),
        phoneNumber: String(normalizedRow.phonenumber || normalizedRow.phone || ""),
        currency: String(normalizedRow.currency || "KES"),
        amount: normalizedRow.amount ? Number(normalizedRow.amount) : undefined,
        preferredLanguage: String(
          normalizedRow.preferredlanguage || normalizedRow.language || "en",
        ).toLowerCase(),
        isProxy: String(normalizedRow.isproxy).toLowerCase() === "true",
      };
    };

    if (isCSV) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!validateHeaders(results.meta.fields || [])) {
            toast.error("Invalid file: Missing required columns (phoneNumber, amount).");
            setData([]);
            return;
          }
          const parsed = (results.data as Record<string, unknown>[]).map(mapRow);
          setData(parsed);
        },
      });
    } else {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      if (json.length > 0 && !validateHeaders(Object.keys(json[0]))) {
        toast.error("Invalid file: Missing required columns (phoneNumber, amount).");
        setData([]);
        return;
      }

      const parsed = json.map(mapRow);
      setData(parsed);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      parseFile(acceptedFiles[0]);
    }
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle>Bulk Upload Beneficiaries</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="programmeTitle">Programme Title</Label>
            <Input
              id="programmeTitle"
              placeholder="e.g. Kenya Relief Q3"
              value={programmeTitle}
              onChange={(e) => setProgrammeTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetCurrency">Target Currency</Label>
            <Select value={targetCurrency} onValueChange={(val) => { if (val) setTargetCurrency(val); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KES">KES — Kenyan Shilling (Turkana)</SelectItem>
                <SelectItem value="SSP">SSP — South Sudanese Pound</SelectItem>
                <SelectItem value="ETB">ETB — Ethiopian Birr (Southern Ethiopia)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
          subtitle="Required columns: fullName, phoneNumber, currency, amount. Optional: preferredLanguage, isProxy"
        />

        {data.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview ({data.length} rows)</h3>
              <Button
                onClick={() => {
                  const recordsWithAmount = data.map(record => ({
                    ...record,
                    amount: record.amount || 0
                  }));
                  mutation.mutate({ programmeTitle, targetCurrency, records: recordsWithAmount as any });
                }}
                disabled={mutation.isPending || !programmeTitle}
              >
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
                    <TableHead>Amount</TableHead>
                    <TableHead>Is Proxy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 100).map((row, i) => (
                    <TableRow key={`${row.phoneNumber}-${i}`}>
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.phoneNumber}</TableCell>
                      <TableCell>{row.currency}</TableCell>
                      <TableCell>{row.amount || 0}</TableCell>
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
