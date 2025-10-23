import { Card, CardContent } from "shared/ui";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const PdfViewer = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState<number>();

  return (
    <Card>
      <CardContent className="flex justify-center p-4">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (_, i) => (
            <Page key={`page_${i + 1}`} pageNumber={i + 1} width={600} />
          ))}
        </Document>
      </CardContent>
    </Card>
  );
};

export default PdfViewer;
