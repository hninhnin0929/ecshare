// app>api>files>route.ts


import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/files`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch files: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ files: data }, { status: 201 });
    } catch (error) {
        console.error("Error in post get api........", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const POST = async (request: NextRequest) => {
    try {
        const formData = await request.formData();
        // const files = formData.getAll('file'); 
        
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/files/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
          body: formData,
        });

        return uploadResponse;
        
      } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json({ error: 'Error uploading files' }, { status: 500 });
      }
};

export const DELETE = async (request: NextRequest) => {

    try {
        const fileId: string = request.nextUrl.searchParams.get("fileId") || "";

        const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/files/${fileId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        });

        return deleteResponse;
        
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
    }
};

export const revalidate = 0;