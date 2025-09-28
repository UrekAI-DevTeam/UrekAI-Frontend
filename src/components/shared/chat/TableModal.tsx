import React from 'react';
import { X, FileText } from 'lucide-react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableData: Record<string, Array<Record<string, string | number>>>;
}

export const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, tableData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Data Tables</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {Object.entries(tableData).map(([filename, rows]) => {
              if (!rows || rows.length === 0) return null;
              
              const headers = Object.keys(rows[0]);
              
              return (
                <div key={filename} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{filename}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          {headers.map((header) => (
                            <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {rows.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {headers.map((header) => (
                              <td key={header} className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                                {row[header]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};