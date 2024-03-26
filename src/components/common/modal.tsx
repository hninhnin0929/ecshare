import { AiFillFolderAdd } from "react-icons/ai";
import { AiFillFileAdd } from "react-icons/ai";
import React, { useState, useCallback, useEffect } from 'react';
import Modal from 'react-modal';
import ReactDOM from "react-dom";
import { MdImage } from "react-icons/md";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // create ref for the StyledModalWrapper component
  const modalWrapperRef = React.useRef<HTMLDivElement>(null);

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

  const handleAddFile = useCallback(() => {
    // Open file selection dialog
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*/*'; // Accept all file types
    fileInput.multiple = true; // Allow selecting multiple files

    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const newFiles = target.files ? Array.from(target.files) : [];
      setSelectedFiles((prevFiles: File[]) => [...prevFiles, ...newFiles]);
    };

    fileInput.click(); // Trigger click event to open file selection dialog
  }, [setSelectedFiles]);

  const handleAddFolder = () => {
    // Logic to add a folder, such as opening a file picker or selecting a directory
    console.log('Add folder clicked');
  };

  const handleCancel = () => {
    // Logic to cancel upload
    console.log('Cancel clicked');
  };

  // const handleUpload = () => {
  //   // Handle file upload logic here
  //   console.log('Uploading files:', files);
  //   // After upload, close the modal
  //   onClose();
  // };
  const handleUpload = async () => {
    console.log("start handle")
    try {
      const uploadPromises = [];

      for (const file of selectedFiles) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        // ${API_GATEWAY_ENDPOINT}
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG5pbiIsImVtYWlsIjoiaG5pbkBnbWFpbC5jb20iLCJpZCI6IjY2MDI0ZDY1OWRlMmU5Yjc5NzAxYjI4YSJ9LCJpYXQiOjE3MTE0MzMzMDEsImV4cCI6MTcxMTQzNDIwMX0.cDb1CCQcm2FX9ocbYSEumWY3wKbxsh9B0kFhGSFzoyI";
        // const uploadResponse = await fetch(`http://localhost:5001/api/files/upload`, {
        //   method: 'POST',
        //   body: uploadData,
        // });
        const uploadResponse = await fetch(`http://localhost:5001/api/files/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}` 
          },
          body: uploadData,
        });
        console.log("uploadResponse--------", uploadResponse);

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for file: ${file.name}`);
        }

        // const uploadDataJson = await uploadResponse.json();
        // const s3Url = uploadDataJson.url; // Extract S3 pre-signed URL from response

        const fileName = encodeURIComponent(file.name);
        const s3Url = `${process.env.NEXT_PUBLIC_S3_URL}/tradepay-finance/myfiles/${fileName}`; //logos
        console.log("s3Url --------", s3Url);
        // Send the file to S3 using the pre-signed URL
        uploadPromises.push(fetch(s3Url, {
          method: 'PUT',
          body: file,
        }));
      }

      // Wait for all file uploads to finish
      await Promise.all(uploadPromises);

      console.log('Files uploaded successfully!');

    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      onClose();
    }
  };

  return (
    <div id="upload-modal" className={`fixed inset-0 ${isOpen ? '' : 'hidden'} flex items-center justify-center bg-gray-800 bg-opacity-50 shadow-lg`}>
      <div ref={modalWrapperRef} className="bg-white rounded-lg overflow-hidden w-96 md:w-3/4 lg:w-1/2">
        <div className="px-6 py-4 flex items-center justify-between bg-blue-500 text-white">
          <h2 className="text-lg font-semibold">
            {selectedFiles.length > 0 ? `Selected ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}` : 'Upload Files'}
          </h2>
          <button onClick={onClose} className="text-white focus:outline-none">&times;</button>
        </div>
        <div className="px-6 py-4 h-[300px]">
          <ul className="list-none list-inside mb-4">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center mb-2">
                <MdImage className="w-6 h-6 mr-2" />
                <span>{file.name}</span>
                <span className="text-gray-500 ml-2">
                  {(file.size / 1024).toFixed(2)} KB {/* Convert bytes to KB */}
                </span>
              </li>
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
