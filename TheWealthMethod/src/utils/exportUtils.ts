import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportToCSV = async (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  // In expo-file-system v19+, Paths.document is the recommended way to access the document directory
  const documentDir = FileSystem.Paths.document;
  if (!documentDir) {
    console.error('Document directory is not available');
    return;
  }

  const header = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(obj => 
    Object.values(obj).map(val => 
      typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    ).join(',')
  ).join('\n');

  const csvContent = header + rows;
  
  // Create a File object using the new API
  const file = new FileSystem.File(documentDir, `${filename}.csv`);
  const fileUri = file.uri;
  
  try {
    // The new API's write method is the recommended replacement for writeAsStringAsync
    file.write(csvContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Transaction Data',
        UTI: 'public.comma-separated-values-text',
      });
    } else {
      console.log('Sharing is not available');
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
};
