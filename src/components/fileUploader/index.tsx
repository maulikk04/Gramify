import * as React from 'react';
import { FileUploaderRegular, OutputCollectionState } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import { FileEntry } from '@/types';

interface IFileUploaderProps {
    fileEntry: FileEntry;
    onChange: (fileEntry: FileEntry) => void;
    preview:boolean
}

const FileUploader: React.FC<IFileUploaderProps> = ({ fileEntry, onChange, preview}) => {
    const handleUploaderChange = (info: OutputCollectionState) => {
        const files = info.successEntries;
        if (!files.length) return;

        const newFiles = files.map(file => ({
            uuid: file.uuid || '',
            name: file.name || '',
            size: file.size || 0,
            cdnUrl: file.cdnUrl || '',
            source: null
        }));
        
        onChange({
            files: preview ? [...fileEntry.files, ...newFiles] : [newFiles[0]]
        });
    };

    return (
        <div className="w-full space-y-4">
            <FileUploaderRegular
                sourceList="local, url, camera"
                onChange={handleUploaderChange}
                className="uc-light"
                pubkey={import.meta.env.VITE_UPLOADCAREKEY}
                multiple={false}
            />
            {preview && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {fileEntry.files.map((file) => (
                    <div key={file.uuid} className="relative aspect-square">
                        <img
                            src={`${file.cdnUrl}/-/format/webp/-/quality/smart/-/scale_crop/300x300/center/`}
                            alt={file.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                            onClick={() => onChange({
                                files: fileEntry.files.filter(f => f.uuid !== file.uuid)
                            })}
                            className="absolute -right-2 -top-2 w-6 h-6 flex items-center justify-center 
                                     bg-white border-2 border-slate-800 rounded-full 
                                     text-slate-800 hover:bg-slate-100"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default FileUploader; 