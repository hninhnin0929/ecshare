import { AiFillFolderAdd } from "react-icons/ai";
import { AiFillFileAdd } from "react-icons/ai";
import React, { useState, useCallback, useEffect } from 'react';
import Modal from 'react-modal';
import ReactDOM from "react-dom";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  console.log("isOpen = ", isOpen);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // create ref for the StyledModalWrapper component
  const modalWrapperRef = React.useRef<HTMLDivElement>(null);

  // check if the user has clicked inside or outside the modal
  // useCallback is used to store the function reference, so that on modal closure, the correct callback can be cleaned in window.removeEventListener
  // const backDropHandler = useCallback(e => {
  //     if (!modalWrapperRef?.current?.contains(e.target)) {
  //         onClose();
  //     }
  // }, []);
  const backDropHandler = useCallback((e: MouseEvent) => {
    if (modalWrapperRef.current && !modalWrapperRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, []);

  useEffect(() => {
    // We wrap it inside setTimeout in order to prevent the eventListener to be attached before the modal is open.
    setTimeout(() => {
      window.addEventListener('click', backDropHandler);
    })
  }, [])

  useEffect(() => {
    // remove the event listener when the modal is closed
    return () => window.removeEventListener('click', backDropHandler);
  }, []);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; // Reset to default
    }
    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [isOpen]);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const fileList = Array.from(e.target.files as FileList);
  //     setFiles(fileList);
  // };

  const handleAddFile = () => {

  };

  const handleAddFolder = () => {
    // Logic to add a folder, such as opening a file picker or selecting a directory
    console.log('Add folder clicked');
  };

  const handleCancel = () => {
    // Logic to cancel upload
    console.log('Cancel clicked');
  };

  const handleUpload = () => {
    // Handle file upload logic here
    console.log('Uploading files:', files);
    // After upload, close the modal
    onClose();
  };

  return (
    <div id="upload-modal" className={`fixed inset-0 ${isOpen ? '' : 'hidden'} flex items-center justify-center bg-gray-800 bg-opacity-50 shadow-lg`}>
      <div ref={modalWrapperRef} className="bg-white rounded-lg overflow-hidden w-96 md:w-3/4 lg:w-1/2">
        <div className="px-6 py-4 flex items-center justify-between bg-blue-500 text-white">
          <h2 className="text-lg font-semibold">Upload Files</h2>
          <button onClick={onClose} className="text-white focus:outline-none">&times;</button>
        </div>
        <div className="px-6 py-4 h-[300px]">
          <ul className="list-disc list-inside mb-4">
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
        <div className="px-6 py-4 flex justify-between items-center bg-gray-100">
          <div className="flex justify-between items-center space-x-6">
            <button onClick={handleAddFile} className="flex text-sm">
              <AiFillFileAdd className="mr-1 w-6 h-6" />
              Add File
            </button>
            <button onClick={handleAddFolder} className="flex text-sm">
              <AiFillFolderAdd className="mr-1 w-6 h-6" />
              Add Folder
            </button>
          </div>
          <div>
            <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-500 focus:outline-none focus:bg-gray-500">Cancel</button>
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Begin Upload</button>
          </div>
        </div>
      </div>
    </div>
  );


};

export default UploadModal;
