import { useState } from "react";
import Navbar from "../Navbar";
import { faCircleExclamation, faFile, faFilePdf, faFileWord } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BASE_API_URL } from "../constants";

const UploadView = () => {

    const [checkFile, setCheckFile] = useState(null);
    const [referenceFile, setReferenceFile] = useState(null);
    const [checkFileIcon, setCheckFileIcon] = useState();
    const [referenceFileIcon, setReferenceFileIcon] = useState();

    const submitCheckFile = (e) => {
        const file = e.target.files[0];

        setCheckFile(file);
        const tokens = file.name.split('.');

        if (tokens[tokens.length - 1] == 'pdf') {
            setCheckFileIcon(faFilePdf)
        } else {
            setCheckFileIcon(faFileWord)
        }
    }

    const openCheckFile = () => {
        document.getElementById('check-file').click();
    }

    const onCheckDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            const tokens = files[i].name.split(".");
            const extension = tokens[tokens.length - 1];

            if (extension == "pdf") {
                setCheckFile(files[i]);
                setCheckFileIcon(faFilePdf)
                break;
            } else if (extension == "docx") {
                setCheckFile(files[i]);
                setCheckFileIcon(faFileWord)
                break;
            }
        };

        onCheckDragLeave(e);
    }

    const onCheckDragOver = (e) => {
        e.preventDefault();
        e.target.classList.add("bg-slate-100");
    }

    const onCheckDragLeave = (e) => {
        e.target.classList.remove("bg-slate-100");
    }

    const submitReferenceFile = (e) => {
        const file = e.target.files[0];

        setReferenceFile(file);
        const tokens = file.name.split('.');

        if (tokens[tokens.length - 1] == 'pdf') {
            setReferenceFileIcon(faFilePdf)
        } else {
            setReferenceFileIcon(faFileWord)
        }
    }

    const openReferenceFile = () => {
        document.getElementById('reference-file').click();
    }

    const onReferenceDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            const tokens = files[i].name.split(".");
            const extension = tokens[tokens.length - 1];

            if (extension == "pdf") {
                setReferenceFile(files[i]);
                setReferenceFileIcon(faFilePdf)
                break;
            } else if (extension == "docx") {
                setReferenceFile(files[i]);
                setReferenceFileIcon(faFileWord)
                break;
            }
        };

        onReferenceDragLeave(e);
    }

    const onReferenceDragOver = (e) => {
        e.preventDefault();
        e.target.classList.add("bg-slate-100");
    }

    const onReferenceDragLeave = (e) => {
        e.preventDefault();
        e.target.classList.remove("bg-slate-100");
    }

    const process = async () => {
        if (checkFile == null) {
            toggleModal();
        } else {
            //const checkText = getParagraph();
            //const referenceText = getParagraph();
            const checkText = '';
            const referenceText = referenceFile == null ? '' : 'getParagraph()';

            const url = BASE_API_URL + '/api/plagiarism_check';

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Type': 'application/json'
                },
                body: JSON.stringify({
                    checkText: checkText,
                    referenceText: referenceText
                })
            })

            const data = await res.json();

            console.log(data);
        }
    }

    const toggleModal = () => {
        document.getElementById('error-modal').classList.toggle('hidden');
    }

    return (
        <div className="w-full h-full flex flex-col relative">
            <Navbar />

            <div className="grow w-full h-full flex flex-col items-center justify-center px-10 py-12 md:px-20 lg:px-32 z-10">
                <div className="w-full grow grid grid-cols-2">
                    <div className="col px-6 flex flex-col">
                        <div className="text-2xl font-medium mb-12 text-center">Upload file here</div>

                        <div className="grow flex flex-col border border-slate-300 shadow-md rounded-lg flex flex-col items-center justify-center" onDrop={e => onCheckDrop(e)} onDragOver={e => onCheckDragOver(e)} onDragLeave={e => onCheckDragLeave(e)}>
                            {
                                checkFile == null ?
                                    <FontAwesomeIcon icon={faFile} className="text-5xl text-slate-600" />
                                    :
                                    <>
                                        <FontAwesomeIcon icon={checkFileIcon} className="text-5xl text-slate-600" />
                                        <div className="text-red-500">{checkFile.name}</div>
                                    </>
                            }

                            <div className="font-medium mt-4 text-xl">Drag your files here </div>
                            <div className="text-sm">(.pdf, .docx)</div>
                            <button className="btn btn-blue mt-5" onClick={openCheckFile}>Import files</button>

                            <input id="check-file" type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => submitCheckFile(e)} />
                        </div>
                    </div>

                    <div className="col px-6 flex flex-col">
                        <div className="text-2xl font-medium mb-12 text-center">
                            Upload reference here
                            <span className="text-xs font-normal text-red-500 ms-2">*Optional</span>
                        </div>

                        <div className="grow flex flex-col border border-slate-300 shadow-md rounded-lg flex flex-col items-center justify-center" onDrop={e => onReferenceDrop(e)} onDragOver={e => onReferenceDragOver(e)} onDragLeave={e => onReferenceDragLeave(e)}>
                            {
                                referenceFile == null ?
                                    <FontAwesomeIcon icon={faFile} className="text-5xl text-slate-600" />
                                    :
                                    <>
                                        <FontAwesomeIcon icon={referenceFileIcon} className="text-5xl text-slate-600" />
                                        <div className="text-red-500">{referenceFile.name}</div>
                                    </>
                            }
                            <div className="font-medium mt-4 text-xl">Drag your files here </div>
                            <div className="text-sm">(.pdf, .docx)</div>
                            <button className="btn btn-blue mt-5" onClick={openReferenceFile}>Import files</button>

                            <input id="reference-file" type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => submitReferenceFile(e)} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center mt-8">
                    <span className="text-sm text-red-600">
                        If reference file is not selected, we will check plagiarism based on our references library
                    </span>
                    <div>
                        <button className='btn btn-green px-10 mt-4' onClick={process}>Process</button>
                    </div>
                </div>
            </div>

            <div id='error-modal' className="hidden fixed top-0 left-0 w-full h-full z-20 bg-slate-50/60 flex items-center justify-center">
                <div className="w-96 h-48 bg-slate-50 border border-gray-500 rounded shadow-lg flex flex-col justify-center">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500 text-4xl" />
                    <div className="mt-5">Check File cannot be empty</div>
                    <div className="mt-5">
                        <button className="btn btn-blue" onClick={toggleModal}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadView;