import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ResultsPreview({ uploads }) {
  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const processingUploads = uploads.filter(upload => upload.status === 'processing');

  if (uploads.length === 0) return null;

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-bar text-emerald-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
                <p className="text-sm text-muted-foreground">AI-powered cancer detection findings</p>
              </div>
            </CardTitle>
            <Link href="/results">
              <Button variant="ghost" size="sm" data-testid="button-view-all-results">
                View All <i className="fas fa-arrow-right ml-1"></i>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {completedUploads.length === 0 && processingUploads.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-hourglass-half text-muted-foreground text-2xl"></i>
              </div>
              <h4 className="font-medium text-foreground mb-2">Waiting for Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Results will appear here once files are processed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {completedUploads.slice(0, 2).map((upload) => (
                  <div 
                    key={upload.id}
                    className={`border rounded-lg p-4 ${
                      upload.results?.anomaliesDetected 
                        ? 'bg-amber-50 border-amber-200' 
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                    data-testid={`result-preview-${upload.id}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        upload.results?.anomaliesDetected 
                          ? 'bg-amber-100' 
                          : 'bg-emerald-100'
                      }`}>
                        <i className={`${
                          upload.results?.anomaliesDetected 
                            ? 'fas fa-exclamation-triangle text-amber-600' 
                            : 'fas fa-shield-alt text-emerald-600'
                        }`}></i>
                      </div>
                      <div>
                        <h4 className={`font-medium ${
                          upload.results?.anomaliesDetected 
                            ? 'text-amber-900' 
                            : 'text-emerald-900'
                        }`}>
                          {upload.results?.anomaliesDetected 
                            ? 'Requires Review' 
                            : 'No Anomalies Detected'}
                        </h4>
                        <p className={`text-sm ${
                          upload.results?.anomaliesDetected 
                            ? 'text-amber-700' 
                            : 'text-emerald-700'
                        }`}>
                          {upload.originalName}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={upload.results?.anomaliesDetected ? 'text-amber-700' : 'text-emerald-700'}>
                          Confidence Score
                        </span>
                        <span className={`font-medium ${
                          upload.results?.anomaliesDetected ? 'text-amber-900' : 'text-emerald-900'
                        }`}>
                          {upload.results?.confidenceScore?.toFixed(1)}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${
                        upload.results?.anomaliesDetected ? 'bg-amber-200' : 'bg-emerald-200'
                      }`}>
                        <div 
                          className={`h-2 rounded-full ${
                            upload.results?.anomaliesDetected ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${upload.results?.confidenceScore || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {processingUploads.slice(0, 1).map((upload) => (
                  <div 
                    key={upload.id}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                    data-testid={`processing-preview-${upload.id}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-exclamation-triangle text-amber-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-900">Processing in Progress</h4>
                        <p className="text-sm text-amber-700">{upload.originalName}</p>
                      </div>
                    </div>
                    <div className="text-sm text-amber-700">
                      Estimated completion: 2-3 minutes
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {/* Medical image preview placeholder */}
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="w-full h-48 bg-secondary/10 rounded-lg flex items-center justify-center mb-3">
                    <div className="text-center">
                      <i className="fas fa-image text-muted-foreground text-3xl mb-2"></i>
                      <p className="text-sm text-muted-foreground">MRI Scan Preview</p>
                      <p className="text-xs text-muted-foreground">DICOM viewer integration ready</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      data-testid="button-view-full-scan"
                    >
                      <i className="fas fa-expand-alt mr-2"></i>View Full Scan
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1" 
                      size="sm"
                      data-testid="button-download-report"
                    >
                      <i className="fas fa-download mr-2"></i>Download Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
