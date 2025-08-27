import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function ResultsPage() {
  const { data: uploads, isLoading } = useQuery({
    queryKey: ["/api/uploads"],
  });

  const completedUploads = uploads?.filter(upload => upload.status === "completed") || [];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analysis Results</h1>
          <p className="text-muted-foreground">AI-powered MRI cancer detection results</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : completedUploads.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-bar text-muted-foreground text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Results Yet</h3>
              <p className="text-muted-foreground">
                Upload MRI files to see analysis results here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedUploads.map((upload) => (
              <Card key={upload.id} className="hover:shadow-md transition-shadow" data-testid={`result-card-${upload.id}`}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      upload.results?.anomaliesDetected ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></div>
                    <span className="truncate" data-testid={`result-filename-${upload.id}`}>
                      {upload.originalName}
                    </span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {upload.results?.anomaliesDetected ? 'Requires Review' : 'No Anomalies Detected'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence</span>
                      <span className="font-medium" data-testid={`result-confidence-${upload.id}`}>
                        {upload.results?.confidenceScore?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          upload.results?.anomaliesDetected ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${upload.results?.confidenceScore || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {upload.results?.findings?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Findings:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {upload.results.findings.map((finding, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <button 
                      className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors"
                      data-testid={`button-view-scan-${upload.id}`}
                    >
                      <i className="fas fa-expand-alt mr-2"></i>View Scan
                    </button>
                    <button 
                      className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded-lg hover:bg-secondary/90 transition-colors"
                      data-testid={`button-download-report-${upload.id}`}
                    >
                      <i className="fas fa-download mr-2"></i>Report
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
