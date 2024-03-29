// app>api>files>route.ts

import { NextResponse } from 'next/server';

export async function GET(){
    
    try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG5pbiIsInBob25lIjoiMDEwNDMyNjU1NDAiLCJlbWFpbCI6ImhuaW5AZ21haWwuY29tIiwiaWQiOiI2NjAyNGQ2NTlkZTJlOWI3OTcwMWIyOGEifSwiaWF0IjoxNzExNjc5MzM3LCJleHAiOjE3MTE3NjU3Mzd9.M4RL2EBJfdzVQJ1c7tynmF1y7Pu_fGUXiWIMROU6pTY";

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
        console.log("response data", data)
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching files:', error);
    }
}
