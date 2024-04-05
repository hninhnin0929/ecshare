"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { Button } from '../common/button'
import { MdOutlineFileUpload } from 'react-icons/md'
import UploadModal from '../common/modal';
import { FilesProvider } from '@/context/filesContext';

const Header = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <FilesProvider>
            <nav className='flex justify-between items-center bg-blue-600 px-8 py-4'>
                <div>
                    Logo
                </div>
                <div className='flex items-center space-x-6 ml-auto'>
                    <Button
                        variant="link"
                        size="lg"
                        className=" hover:bg-blue-600 text-white font-semibold py-3 px-6 flex items-center space-x-2 hover:no-underline"
                        onClick={() => setModalIsOpen(true)}>
                        <MdOutlineFileUpload className="w-6 h-6" />
                        <span>UPLOAD</span>
                    </Button>
                    <Link className='text-white mr-6' href={"/"}>SIGN UP</Link>
                    <Link className='text-white' href={"/"}>LOG IN</Link>
                </div>
                {modalIsOpen && <UploadModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />}
            </nav>
        </FilesProvider>

    )
}

export default Header