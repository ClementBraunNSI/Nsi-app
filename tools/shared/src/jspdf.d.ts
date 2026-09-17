declare module 'jspdf' {
  export class jsPDF {
    constructor(options?: { unit?: string; format?: string });
    internal: {
      pageSize: { getWidth(): number; getHeight(): number };
    };
    setFontSize(size: number): void;
    text(text: string | string[], x: number, y: number): void;
    splitTextToSize(text: string, maxWidth: number): string[];
    addPage(): void;
    output(type: 'blob'): Blob;
  }
}
