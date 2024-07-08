import React from 'react';
import './Table.css';

interface TableComponentProps {
  columns: string[];
  data: { [key: string]: React.ReactNode }[];
}

const Table: React.FC<TableComponentProps> = ({ columns, data }) => {
  const renderCellContent = (content: React.ReactNode) => {
    if (React.isValidElement(content)) {
      return content;
    }
    if (typeof content === 'object' && content !== null) {
      return JSON.stringify(content);
    }
    return content;
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{renderCellContent(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
