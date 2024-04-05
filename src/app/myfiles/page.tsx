"use client";
import React, { useContext } from 'react';
import pdfIcon from '../../../public/icons8-pdf-file-65.png';
import wordIcon from '../../../public/icons8-word-64.png';
import defaultIcon from '../../../public/icons8-file-64.png';
import excelIcon from '../../../public/icons8-excel-48.png';
import { StaticImageData } from 'next/image';
import StaticImage from 'next/image';
import { MdInsertLink } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { format } from 'date-fns';
import { AiOutlineDelete } from "react-icons/ai";
import { FilesContext } from '@/context/filesContext';
import { FileProps } from '@/types/FileProps';

export default function MyFiles() {

  // Access files context
  const filesContext = useContext(FilesContext);
  console.log("filesContext#######", filesContext)
  
  // Check if filesContext is not null
  if (!filesContext) {
    // Handle the case when the context value is null
    return <div>Loading...</div>;
  }

  // Extract files from the context
  const { files } = filesContext;
  const { mutate } = filesContext;

  // Now you can use 'files' in your component
  console.log("files-------", files);

  // to get file extension
  const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  };

  // Function to get icon/image based on file type
  const getFileIcon = (file: FileProps) => {
    const extension = getFileExtension(file.filename);
    if (extension === 'pdf') {
      return pdfIcon;
    } else if (extension === 'doc' || extension === 'docx') {
      return wordIcon;
    } else if (extension === 'xls' || extension === 'xlsx') {
      return excelIcon; // Assuming you have an excel icon defined
    } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'webp') {
      return file.url;
    } else {
      return defaultIcon;
    }
  };

  const handleCopyLink = (link: string) => {
    // to copy the link to clipboard
    navigator.clipboard.writeText(link);
  };

  const handleDownload = (url: string, filename: string) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);

    if (isImageFile(filename)) {
      window.open(url, '_blank');
    } else {
      // Simulate click on the anchor element to trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImageFile = (filename: string) => {
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // Add more image extensions if needed
    const fileExtension = getFileExtension(filename);
    return extensions.includes(fileExtension.toLowerCase());
  };

  // Function to handle file deletion
  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files?fileId=${fileId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      await mutate('/api/files');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Files</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {files.map((file, index) => (
          <div key={index}
            className="bg-gray-100 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-shrink">
              <div>
                <span>
                  {getFileIcon(file) && (
                    <StaticImage
                      src={getFileIcon(file) as StaticImageData}
                      alt="File Icon"
                      width={32}
                      height={32}
                      className="" />
                  )}
                </span>
              </div>
              <div className='grid md:grid-cols-2 gap-1 items-center '>
                <span className='font-semibold text-sm'>
                  {file.filename}
                </span>
                <span className="text-gray-500 text-xs">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              </div>
            </div>
            <div className="md:grid grid-cols-2 gap-1">
              <div className=''>
                <span className='text-gray-500 text-xs'>
                  {format(new Date(file.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </span>
              </div>
              <div className='flex items-center space-x-4 justify-end'>
                <span
                  onClick={() => handleCopyLink(file.url)}
                  className='cursor-pointer'
                  title='Copy share link'>
                  <MdInsertLink size={20} />
                </span>
                <span
                  onClick={() => handleDownload(file.url, file.filename)}
                  className='cursor-pointer'
                  title='Download file'>
                  <MdOutlineFileDownload size={20} />
                </span>
                <span
                  onClick={() => handleDelete(file._id)}
                  className='cursor-pointer'
                  title='Remove your file'>
                  <AiOutlineDelete size={20} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
