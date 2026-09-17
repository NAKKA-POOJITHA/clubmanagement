import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string = 'export.xlsx', sheetName: string = 'Report') {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
}
