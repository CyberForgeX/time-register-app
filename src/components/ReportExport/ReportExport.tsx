import { useState } from "react";
import styles from "./ReportExport.module.css";

type ReportExportProps = {
  data: any[]; // replace `any` with the type of your data
  onExport: (reportData: any) => void; // function to handle exporting the data
};

const ReportExport: React.FC<ReportExportProps> = ({ data, onExport }) => {
  const [reportFormat, setReportFormat] = useState<"csv" | "pdf">("csv");

  const handleExportClick = () => {
    // use a library or API to generate the report in the desired format
    // and pass the generated data to `onExport` callback
    const reportData = generateReport(reportFormat, data);
    onExport(reportData);
  };

  const generateReport = (format: "csv" | "pdf", data: any[]): any => {
    // generate the report in the desired format and return the data
    if (format === "csv") {
      // generate CSV data
      const csvData = data
        .map((row) => Object.values(row).join(","))
        .join("\n");
      return csvData;
    } else {
      // generate PDF data
      const pdfData = {}; // replace with your PDF generation code
      return pdfData;
    }
  };

  return (
    <div className={styles.reportExport}>
      <h3 className={styles.title}>Generate Report or Export Data</h3>
      <div className={styles.formatSelect}>
        <label htmlFor="formatSelect" className={styles.label}>
          Report Format:
        </label>
        <select
          id="formatSelect"
          value={reportFormat}
          onChange={(e) => setReportFormat(e.target.value as "csv" | "pdf")}
          className={styles.select}
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <button onClick={handleExportClick} className={styles.exportBtn}>
        Export Data
      </button>
    </div>
  );
};

export default ReportExport;
