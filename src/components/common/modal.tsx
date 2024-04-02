import { AiFillFolderAdd } from "react-icons/ai";
import { AiFillFileAdd } from "react-icons/ai";
import React, { useState, useCallback, useEffect } from 'react';
import { MdImage } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';


interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

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

  const handleAddFolder = useCallback(() => {
    const folderInput = document.createElement('input');
    folderInput.type = 'file';
    folderInput.setAttribute('webkitdirectory', ''); // Allow selecting a directory

    folderInput.multiple = false; // Allow selecting only one folder

    folderInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const selectedFolder = target.files ? Array.from(target.files) : [];

      if (selectedFolder) {
        // Get the list of files within the selected folder
        const filesInFolder: File[] = [];
        for (let i = 0; i < selectedFolder.length; i++) {
          const file = selectedFolder[i];
          filesInFolder.push(file);
        }

        // filesInFolder.forEach((file, index) => {
        //   console.log(`File ${index + 1}:`, file.name);
        // });

        // Add files from the selected folder to the list of selected files
        setSelectedFiles((prevFiles: File[]) => [...prevFiles, ...filesInFolder]);
      } else {
        console.log('No folder selected.');
      }

    };

    folderInput.click(); // Trigger click event to open folder selection dialog
  }, [setSelectedFiles]);

  const handleCancel = () => {
    setSelectedFiles([]);
    onClose();
  };

  // const handleUpload = async () => {
  //   console.log("start handle")
  //   try {
  //     if (selectedFiles.length === 0) {
  //       console.error('No files selected for upload');
  //       return;
  //     }
  //     const uploadPromises = [];

  //     for (const file of selectedFiles) {
  //       const uploadData = new FormData();
  //       // uploadData.append('file', file);
  //       uploadData.append('file', file, encodeURIComponent(file.name));
  //       // ${API_GATEWAY_ENDPOINT}
  //       const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG5pbiIsInBob25lIjoiMDEwNDMyNjU1NDAiLCJlbWFpbCI6ImhuaW5AZ21haWwuY29tIiwiaWQiOiI2NjAyNGQ2NTlkZTJlOWI3OTcwMWIyOGEifSwiaWF0IjoxNzExOTQ2MTEzLCJleHAiOjE3MTIwMzI1MTN9.4V4Q70CFXhW4-hU1zKGpol4iPukxgMaRfSU0XZLd78Q";
  //       // const uploadResponse = await fetch(`http://localhost:5001/api/files/upload`, {
  //       //   method: 'POST',
  //       //   body: uploadData,
  //       // });
  //       const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/files/upload`, {
  //         method: "POST",
  //         headers: {
  //           "Authorization": `Bearer ${token}`,
  //         },
  //         body: uploadData,
  //       });
  //       console.log("uploadResponse--------", uploadResponse);

  //       if (!uploadResponse.ok) {
  //         throw new Error(`Upload failed for file: ${file.name}`);
  //       }

  //       // const uploadDataJson = await uploadResponse.json();
  //       // const s3Url = uploadDataJson.url; // Extract S3 pre-signed URL from response

  //       const fileName = encodeURIComponent(file.name);
  //       const s3Url = `${process.env.NEXT_PUBLIC_S3_URL}/tradepay-finance/myfiles/${fileName}`; //logos
  //       console.log("s3Url --------", s3Url);
  //       // Send the file to S3 using the pre-signed URL
  //       uploadPromises.push(fetch(s3Url, {
  //         method: 'PUT',
  //         body: file,
  //       }));
  //     }

  //     // Wait for all file uploads to finish
  //     await Promise.all(uploadPromises);

  //     console.log('Files uploaded successfully!');

  //   } catch (error) {
  //     console.error('Error uploading files:', error);
  //   } finally {
  //     onClose();
  //   }
  // };

  const handleUpload = async () => {
    try {

      if (selectedFiles.length === 0) {
        console.error('No files selected for upload');
        return;
      }
      const uploadPromises = [];

      for (const file of selectedFiles) {
        const uploadData = new FormData();
        uploadData.append('file', file, encodeURIComponent(file.name));


        const uploadResponse = await fetch('/api/files', {
          method: 'POST',
          body: uploadData,
        });

        console.log("uploadResponse--------", uploadResponse);

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for file: ${file.name}`);
        }

        const uploadDataJson = await uploadResponse.json();
        console.log("uploadDataJson-------", uploadDataJson)
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
      // mutate('/api/files');
      // router.push('/myfiles');
      window.location.reload();
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
        <div className="px-6 py-4 h-[300px] overflow-auto">
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
