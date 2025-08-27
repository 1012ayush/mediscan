import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function UploadProgressList({ uploads, onUploadUpdate }) {
  const { refetch } = useQuery({
    queryKey: ["/api/uploads"],
    enabled: false,
  });

  // Poll for upload status updates
  useEffect(() => {
    if (uploads.length === 0) return;

    const pollInterval = setInterval(async () => {
      try {
        const result = await refetch();
        if (result.data) {
          // Update each upload with latest status
          uploads.forEach(upload => {
            const updated = result.data.find(u => u.id === upload.id);
            if (updated && updated.status !== upload.status) {
              onUploadUpdate(updated);
            }
          });
        }
      } catch (error) {
        console.error('Error polling upload status:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [uploads, refetch, onUploadUpdate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'fas fa-check-circle';
      case 'processing': return 'fas fa-clock';
      case 'uploaded': return 'fas fa-cloud-upload-alt';
      case 'error': return 'fas fa-exclamation-circle';
      default: return 'fas fa-file';
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case 'uploaded': return '33%';
      case 'processing': return '66%';
      case 'completed': return '100%';
      case 'error': return '100%';
      default: return '0%';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'processing': return 'bg-amber-500';
      case 'uploaded': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (uploads.length === 0) return null;

  return (
    <div className="px-6 pb-6 space-y-3" data-testid="upload-progress-list">
      {uploads.map((upload) => (
        <div 
          key={upload.id} 
          className="bg-accent/50 border border-border rounded-lg p-4"
          data-testid={`upload-item-${upload.id}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <i className={`${getStatusIcon(upload.status)} text-primary`}></i>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground" data-testid={`upload-filename-${upload.id}`}>
                  {upload.originalName}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`upload-filesize-${upload.id}`}>
                  {(upload.fileSize / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </div>
            <Badge 
              className={getStatusColor(upload.status)}
              data-testid={`upload-status-${upload.id}`}
            >
              <i className={`${getStatusIcon(upload.status)} mr-1`}></i>
              {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
            </Badge>
          </div>
          
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(upload.status)}`}
              style={{ width: getProgressWidth(upload.status) }}
              data-testid={`upload-progress-${upload.id}`}
            ></div>
          </div>

          {upload.status === 'completed' && upload.results && (
            <div className="mt-3 p-3 bg-card border border-border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Analysis Complete</span>
                <span className="text-sm text-muted-foreground">
                  {upload.results.confidenceScore?.toFixed(1)}% confidence
                </span>
              </div>
              {upload.results.anomaliesDetected && (
                <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Potential anomalies detected - requires medical review
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
