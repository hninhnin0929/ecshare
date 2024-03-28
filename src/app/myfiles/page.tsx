"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import pdfIcon from '../../../public/icons8-pdf-file-65.png';
import wordIcon from '../../../public/icons8-word-64.png';
import defaultIcon from '../../../public/icons8-file-64.png';
import excelIcon from '../../../public/icons8-excel-48.png';
import { StaticImageData } from 'next/image';
import StaticImage from 'next/image';
import { MdInsertLink } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";


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

  // to get file extension
  const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  };

  // Function to get icon/image based on file type
  const getFileIcon = (file: File) => {
    const extension = getFileExtension(file.filename);
    if (extension === 'pdf') {
      console.log("pdfIcon..........", pdfIcon);
      return pdfIcon;
    } else if (extension === 'doc' || extension === 'docx') {
      console.log("wordIcon..........", wordIcon);
      return wordIcon;
    } else if (extension === 'xls' || extension === 'xlsx') {
      console.log("excelIcon..........", excelIcon);
      return excelIcon; // Assuming you have an excel icon defined
    } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
      console.log("file.url..........", file.url);
      return file.url;
    } else {
      console.log("defaultIcon..........", defaultIcon);
      return defaultIcon;
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Files</h1>
      <div className="grid grid-cols-2 gap-4">
        {files.map((file, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md flex justify-between">
            {/* <div>
            {getFileIcon(file) && (
              <img src={getFileIcon(file) as string} alt="File Icon" className="w-8 h-8 mr-2" />
            )}
            </div> */}
            <div className="font-semibold flex space-x-4">
              <span>
                {getFileIcon(file) && (
                  <StaticImage src={getFileIcon(file) as StaticImageData} alt="File Icon" width={32} height={32} className="" />
                )}
              </span>
              <span>{file.filename}</span>
              <span className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
            </div>
            <div className="flex space-x-4">
              <span><MdInsertLink size={24} /></span>
              <span><MdOutlineFileDownload size={24} /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
