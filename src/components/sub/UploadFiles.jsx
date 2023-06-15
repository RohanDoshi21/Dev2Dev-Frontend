import React, {useRef, useState} from "react";
import storage from "../../config/firebaseConfig";
import {getDownloadURL, ref, uploadBytesResumable,} from "firebase/storage";

function UploadFiles({downloadUrls, setDownloadUrls}) {

    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState([]);

    // Handle file upload event and update state
    function handleChange(event) {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setProgress((prevProgress) => [
            ...prevProgress,
            ...new Array(selectedFiles.length).fill(0),
        ]);
    }

    const clearFile = (index) => {
        setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles.splice(index, 1);
            return updatedFiles;
        });
        setProgress((prevProgress) => {
            const updatedProgress = [...prevProgress];
            updatedProgress.splice(index, 1);
            return updatedProgress;
        });
        setDownloadUrls((prevUrls) => {
            const updatedUrls = [...prevUrls];
            updatedUrls.splice(index, 1);
            return updatedUrls;
        });
    };

    const handleUpload = () => {
        if (files.length === 0) {
            return;
        }

        files.forEach((file, index) => {
            const storageRef = ref(storage, `/files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    // Update progress for the current file
                    setProgress((prevProgress) => {
                        const updatedProgress = [...prevProgress];
                        updatedProgress[index] = percent;
                        return updatedProgress;
                    });
                },
                (err) => console.log(err),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setDownloadUrls((prevUrls) => [...prevUrls, url]);
                    });
                }
            );

            uploadTask.then(() => {
                // Set progress to 100 after successful upload
                setProgress((prevProgress) => {
                    const updatedProgress = [...prevProgress];
                    updatedProgress[index] = 100;
                    return updatedProgress;
                });
            });
        });
    };

    const fileInputRef = useRef(null); // Reference to the file input element

    return (
        <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center py-10 bg-transparent">
            <input
                id="fileInput"
                type="file"
                onChange={handleChange}
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
            />
            <button
                onClick={() => fileInputRef.current.click()}
                className="bg-[#144272] hover:bg-[#2C74B3] text-white  py-2 px-4 rounded-2xl"
            >
                Select Images
            </button>
            {files.length > 0 && (
                <div className="mt-4 flex flex-wrap">
                    {files.map((file, index) => (
                        <div key={index} className="relative m-2">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-32 h-32 object-cover"
                            />
                            <button
                                className="absolute top-0 right-0 m-1 bg-red-500 rounded-full p-1 flex items-center justify-center"
                                onClick={() => clearFile(index)}
                            >
                                <span className="text-white text-xs">X</span>
                            </button>
                            <div className="w-32 h-2 bg-gray-300 mt-2">
                                <div
                                    style={{width: `${progress[index]}%`}}
                                    className={`h-full ${
                                        progress[index] === 100 ? "bg-green-500" : "bg-blue-500"
                                    } rounded`}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {files.length > 0 && (
                <button
                    onClick={handleUpload}
                    className="bg-[#144272] hover:bg-[#2C74B3] text-white  py-2 px-4 rounded-2xl"
                >
                    Upload Images
                </button>
            )}
        </div>
    );
}

export default UploadFiles;
