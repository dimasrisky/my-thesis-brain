export interface IMetadata {
  source: string;
  pdf: {
    version: string;
    info: {
      PDFFormatVersion: string;
      IsAcroFormPresent: boolean;
      IsXFAPresent: boolean;
      Producer: string;
      ModDate: string;
    };
    metadata: Record<string, any>;
    totalPages: number;
  };
  loc: {
    pageNumber: number;
    lines: {
      from: number;
      to: number;
    };
  };
}
