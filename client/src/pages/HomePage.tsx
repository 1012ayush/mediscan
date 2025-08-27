import NavigationHeader from "@/components/NavigationHeader";
import FileUploadArea from "@/components/FileUploadArea";
import UploadProgressList from "@/components/UploadProgressList";
import PatientInfoForm from "@/components/PatientInfoForm";
import StatusSidebar from "@/components/StatusSidebar";
import ResultsPreview from "@/components/ResultsPreview";
import { useState } from "react";

export default function HomePage() {
  const [uploads, setUploads] = useState([]);
  const [patientInfo, setPatientInfo] = useState({});

  const handleFilesUploaded = (newUploads) => {
    setUploads(prev => [...prev, ...newUploads]);
  };

  const handleUploadUpdate = (updatedUpload) => {
    setUploads(prev => prev.map(upload => 
      upload.id === updatedUpload.id ? updatedUpload : upload
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-cloud-upload-alt text-primary"></i>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">MRI Image Upload</h2>
                    <p className="text-sm text-muted-foreground">Upload DICOM or standard image files for analysis</p>
                  </div>
                </div>
              </div>

              <FileUploadArea 
                onFilesUploaded={handleFilesUploaded} 
                patientInfo={patientInfo}
              />
              
              <UploadProgressList 
                uploads={uploads} 
                onUploadUpdate={handleUploadUpdate}
              />
            </div>

            <PatientInfoForm 
              patientInfo={patientInfo} 
              setPatientInfo={setPatientInfo}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <StatusSidebar uploads={uploads} />
          </div>
        </div>

        <ResultsPreview uploads={uploads} />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MediScan. HIPAA Compliant • FDA Guidelines Ready • Secure Medical Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
