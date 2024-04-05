"use client";
import { FileProps } from '@/types/FileProps';
import { FilesContextProps } from '@/types/FilesContextProps';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = async (url: RequestInfo, ...args: RequestInit[]): Promise<any> => {
  const res = await fetch(url, ...args);
  return res.json();
};

// Create context
const FilesContext = createContext<FilesContextProps | null>(null);
console.log("FilesContext----", FilesContext)

// Define provider component
const FilesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [files, setFiles] = useState<FileProps[]>([]);

  const { data, error } = useSWR('/api/files', fetcher);
  console.log("Getting files... ", data);

  useEffect(() => {
    if (data) {
      setFiles(data.files || []);
    }
  }, [data]);

  return (
    <FilesContext.Provider value={{ files, setFiles, mutate }}>
      {children}
    </FilesContext.Provider>
  );
};

export { FilesContext, FilesProvider };
