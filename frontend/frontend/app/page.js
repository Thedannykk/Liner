"use client";
import { useState } from "react";

export default function Home() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");
    const [downloadLink, setDownloadLink] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadFile = async () => {
        if (!selectedFile) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:3001/upload/", {
                method: "POST",
                body: formData,
                redirect: "follow",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setMessage("File processed successfully! You can download it below.");
            
            if (data.download_url) {
                setDownloadLink(data.download_url);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setMessage("Error uploading file.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>Welcome to LineExpander</h1>
            <input type="file" onChange={handleFileChange} accept=".docx" />
            <button 
                onClick={uploadFile} 
                style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}>
                Upload Resume
            </button>
            <p>{message}</p>

            {downloadLink && (
                <a 
                    href={downloadLink} 
                    download 
                    style={{ display: "block", marginTop: "10px", fontSize: "18px", color: "blue" }}>
                    Download Expanded Resume
                </a>
            )}
        </div>
    );
}
