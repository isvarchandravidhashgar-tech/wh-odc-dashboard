export type ExcelRow = {
  [key: string]: any;
};

export type UploadedFile = {
  name: string;
  data: ExcelRow[];
};