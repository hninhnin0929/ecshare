"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = async (url: RequestInfo, ...args: RequestInit[]): Promise<any> => {
  const res = await fetch(url, ...args);
  return res.json();
};


interface File {
  filename: string;
  size: number;
  url: string;
}

// interface MyFilesProps {
//   files?: File[]; 
// }
export default function MyFiles() {

  const [files, setFiles] = useState<File[]>([]);

  const { data, error, mutate } = useSWR('/api/files', fetcher);
    console.log("Getting files... ", data);

    useEffect(() => {
      if (data) {
        setFiles(data || []);
      }
  }, [data]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Files</h1>
      <div className="grid grid-cols-2 gap-4">
        {files.map((file, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md">
            <p className="font-semibold">{file.filename}</p>
            <p className="text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <p className="text-gray-500">{file.url} </p>
          </div>
        ))}
      </div>
    </div>
  );
}
