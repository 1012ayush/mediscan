import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function FileUploadArea({ onFilesUploaded, patientInfo }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = ['application/dicom', 'image/jpeg', 'image/png', 'image/jpg'];
    const allowedExtensions = ['.dcm', '.jpg', '.jpeg', '.png'];
    
    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return !allowedTypes.includes(file.type) && !allowedExtensions.includes(extension);
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: `Please upload only DICOM, JPEG, or PNG files. ${invalidFiles.length} file(s) rejected.`,
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes (50MB limit)
    const oversizedFiles = files.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File Too Large", 
        description: `Files must be under 50MB. ${oversizedFiles.length} file(s) rejected.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      if (patientInfo && Object.keys(patientInfo).length > 0) {
        formData.append('patientInfo', JSON.stringify(patientInfo));
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onFilesUploaded(result.uploads);
      
      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully and queued for processing.`,
      });

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAreaClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="p-6">
      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary bg-muted/20 hover:bg-primary/5'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleAreaClick}
        data-testid="upload-area"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            {isUploading ? (
              <i className="fas fa-spinner fa-spin text-primary text-2xl"></i>
            ) : (
              <i className="fas fa-file-medical text-primary text-2xl"></i>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {isUploading ? 'Uploading files...' : 'Drop MRI files here'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Supports DICOM (.dcm), JPEG (.jpg), PNG (.png) files up to 50MB each
            </p>
            <button 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
              data-testid="button-select-files"
            >
              <i className="fas fa-plus mr-2"></i>
              {isUploading ? 'Uploading...' : 'Select Files'}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum 10 files per upload • All data encrypted and HIPAA compliant
          </p>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        multiple 
        accept=".dcm,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        data-testid="file-input"
      />
    </div>
  );
}
