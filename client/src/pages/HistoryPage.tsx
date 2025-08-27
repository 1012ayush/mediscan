import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function HistoryPage() {
  const { data: uploads, isLoading } = useQuery({
    queryKey: ["/api/uploads"],
  });

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

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload History</h1>
          <p className="text-muted-foreground">Track all your MRI uploads and their processing status</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="w-20 h-6 bg-muted rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !uploads || uploads.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-history text-muted-foreground text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Upload History</h3>
              <p className="text-muted-foreground">
                Your uploaded files will appear here once you start using the platform.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <Card key={upload.id} className="hover:shadow-md transition-shadow" data-testid={`history-item-${upload.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`${getStatusIcon(upload.status)} text-primary`}></i>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate" data-testid={`history-filename-${upload.id}`}>
                        {upload.originalName}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span data-testid={`history-size-${upload.id}`}>
                          {(upload.fileSize / (1024 * 1024)).toFixed(1)} MB
                        </span>
                        <span data-testid={`history-upload-date-${upload.id}`}>
                          {new Date(upload.uploadedAt).toLocaleDateString()}
                        </span>
                        {upload.patientInfo?.patientId && (
                          <span data-testid={`history-patient-id-${upload.id}`}>
                            Patient: {upload.patientInfo.patientId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge 
                        className={getStatusColor(upload.status)}
                        data-testid={`history-status-${upload.id}`}
                      >
                        <i className={`${getStatusIcon(upload.status)} mr-1 text-xs`}></i>
                        {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                      </Badge>
                      
                      {upload.status === 'completed' && upload.results && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {upload.results.confidenceScore?.toFixed(1)}% confidence
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {upload.results.anomaliesDetected ? 'Requires review' : 'Normal'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {upload.status === 'completed' && upload.results?.findings?.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="text-sm font-medium text-amber-900 mb-2">Findings:</h4>
                      <ul className="text-sm text-amber-800 space-y-1">
                        {upload.results.findings.map((finding, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-1 h-1 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
