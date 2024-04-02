// app>api>files>route.ts


import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {

    try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG5pbiIsInBob25lIjoiMDEwNDMyNjU1NDAiLCJlbWFpbCI6ImhuaW5AZ21haWwuY29tIiwiaWQiOiI2NjAyNGQ2NTlkZTJlOWI3OTcwMWIyOGEifSwiaWF0IjoxNzEyMDQ2MjQ1LCJleHAiOjE3MTIxMzI2NDV9.Cr71axQ8zVkVC3RLWhru9M6ZBkS2HOxS2wZ0_Tz3-yo";

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/files`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
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
        
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG5pbiIsInBob25lIjoiMDEwNDMyNjU1NDAiLCJlbWFpbCI6ImhuaW5AZ21haWwuY29tIiwiaWQiOiI2NjAyNGQ2NTlkZTJlOWI3OTcwMWIyOGEifSwiaWF0IjoxNzEyMDQ2MjQ1LCJleHAiOjE3MTIxMzI2NDV9.Cr71axQ8zVkVC3RLWhru9M6ZBkS2HOxS2wZ0_Tz3-yo";
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/files/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });

        return uploadResponse;
        
      } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json({ error: 'Error uploading files' }, { status: 500 });
      }
};



export const revalidate = 0;