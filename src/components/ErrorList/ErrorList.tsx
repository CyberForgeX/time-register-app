import React from 'react';

type Error = {
  field: string,
  message: string,
}

type ErrorListProps = {
  errors: Error[],
}

const ErrorList: React.FC<ErrorListProps> = ({ errors }) => {
  return (
    <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-4">
      <ul className="list-disc pl-6">
{errors ? errors.map((error, index) => (
  <li key={index}>{error.message}</li>
)) : null}
      </ul>
    </div>
  );
};

export default ErrorList;