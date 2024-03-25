import React from 'react';

interface File {
  name: string;
  size: number;
}

interface MyFilesProps {
  files?: File[]; // Make files prop optional
}

export default function MyFiles({ files = [] }: MyFilesProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Files</h1>
      <div className="grid grid-cols-2 gap-4">
        {files.map((file, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md">
            <p className="font-semibold">{file.name}</p>
            <p className="text-gray-500">{file.size} bytes</p>
          </div>
        ))}
      </div>
    </div>
  );
}
