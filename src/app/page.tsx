"use client";
import React, { useState, useEffect } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';
import { Button } from '@/components/common/button';
import UploadModal from '@/components/common/modal';
import Link from 'next/link';

export default function Home() {

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">ECShare: Collaborative File Sharing System</h1>
      <div>
        <Link href={"/myfiles"}>
          <Button
            variant="default"
            size="xl"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center space-x-2 transition duration-300 ease-in-out"
          >
            <MdOutlineFileUpload className="w-6 h-6" />
            <span>UPLOAD FILES NOW</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
