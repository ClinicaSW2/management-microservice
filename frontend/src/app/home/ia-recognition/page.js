'use client';

import { useState } from 'react';
import axios from 'axios';

export default function DragDropComponent() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [predictedLabels, setPredictedLabels] = useState([]);
    const [confidenceScores, setConfidenceScores] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        setErrorMessage(null);
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(URL.createObjectURL(file));
            uploadImage(file);
        } else {
            setErrorMessage("Please drop a valid image file.");
        }
    };

    const handleFileChange = (event) => {
        setErrorMessage(null);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(URL.createObjectURL(file));
            uploadImage(file);
        } else {
            setErrorMessage("Please select a valid image file.");
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const endpoint = process.env.NEXT_PUBLIC_IA_RECOGNITION_URL;
            const response = await axios.post(endpoint + '/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { predicted_labels, confidence_scores } = response.data;
            setPredictedLabels(predicted_labels);
            setConfidenceScores(confidence_scores);
        } catch (error) {
            setErrorMessage("Error in API: " + error.response?.data?.error || error.message);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div className="drag-drop-container" onDragOver={handleDragOver} onDrop={handleDrop}>
            <h1>Upload an Image for Prediction</h1>

            <div className="drop-zone">
                {selectedImage ? (
                    <img src={selectedImage} alt="Selected" className="preview-image" />
                ) : (
                    <p>Drag and drop an image here, or click to select</p>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {predictedLabels.length > 0 && (
                <div className="results">
                    <h2>Prediction Results</h2>
                    <ul>
                        {predictedLabels.map((label, index) => (
                            <li key={index}>
                                {label}: {confidenceScores[index]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <style jsx>{`
                .drag-drop-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 20px;
                }
                .drop-zone {
                    width: 300px;
                    height: 300px;
                    border: 2px dashed #4caf50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .preview-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                input[type='file'] {
                    position: absolute;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
                .error-message {
                    color: red;
                    margin-top: 10px;
                }
                .results {
                    margin-top: 20px;
                }
                ul {
                    padding: 0;
                    list-style: none;
                }
            `}</style>
        </div>
    );
}
