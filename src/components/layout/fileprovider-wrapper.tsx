// MyFilesLayout.tsx
import React, { ReactNode } from 'react';
import { FilesProvider } from '@/context/filesContext';

const FilesProviderWrapper: React.FC<{ children: ReactNode }>= ({ children }) => {
    console.log("Children:", children);
    return (
        <FilesProvider>
            {children}
        </FilesProvider>
    );
};

export default FilesProviderWrapper;
