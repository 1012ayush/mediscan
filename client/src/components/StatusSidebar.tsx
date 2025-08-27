import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function StatusSidebar({ uploads }) {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const { data: allUploads, isLoading: uploadsLoading } = useQuery({
    queryKey: ["/api/uploads"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { toast } = useToast();

  const handleStartAnalysis = () => {
    toast({
      title: "Analysis Started",
      description: "ML processing pipeline will be integrated here for cancer detection.",
    });
  };

  const getRecentActivity = () => {
    if (!allUploads) return [];
    
    return allUploads
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, 5)
      .map(upload => ({
        id: upload.id,
        message: getActivityMessage(upload),
        timestamp: getRelativeTime(upload.uploadedAt),
        status: upload.status,
      }));
  };

  const getActivityMessage = (upload) => {
    switch (upload.status) {
      case 'completed':
        return `Analysis completed for ${upload.originalName}`;
      case 'processing':
        return `Processing started for ${upload.originalName}`;
      case 'uploaded':
        return `File uploaded: ${upload.originalName}`;
      case 'error':
        return `Error processing ${upload.originalName}`;
      default:
        return `Status update for ${upload.originalName}`;
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getActivityIcon = (status) => {
    switch (status) {
      case 'completed': return 'fas fa-check text-emerald-600';
      case 'processing': return 'fas fa-clock text-amber-600';
      case 'uploaded': return 'fas fa-upload text-primary';
      case 'error': return 'fas fa-exclamation-circle text-red-600';
      default: return 'fas fa-circle text-gray-400';
    }
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      {/* Analysis Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-emerald-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Analysis Status</h3>
              <p className="text-sm text-muted-foreground">Current processing overview</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {statsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-6"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Files Uploaded</span>
                <span 
                  className="text-sm font-medium text-foreground"
                  data-testid="stat-uploaded"
                >
                  {stats?.uploaded || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Processing</span>
                <span 
                  className="text-sm font-medium text-amber-600"
                  data-testid="stat-processing"
                >
                  {stats?.processing || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Completed</span>
                <span 
                  className="text-sm font-medium text-emerald-600"
                  data-testid="stat-completed"
                >
                  {stats?.completed || 0}
                </span>
              </div>
              <div className="pt-4 border-t border-border">
                <Button 
                  className="w-full"
                  onClick={handleStartAnalysis}
                  data-testid="button-start-analysis"
                >
                  <i className="fas fa-play mr-2"></i>
                  Start Analysis
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-history text-secondary"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest uploads and results</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <i className="fas fa-clock text-2xl mb-2 block"></i>
              <p className="text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="recent-activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className={`${getActivityIcon(activity.status)} text-xs`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-sm text-foreground"
                      data-testid={`activity-message-${activity.id}`}
                    >
                      {activity.message}
                    </p>
                    <p 
                      className="text-xs text-muted-foreground"
                      data-testid={`activity-timestamp-${activity.id}`}
                    >
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ML Processing Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-purple-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">Machine learning insights</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-brain text-muted-foreground text-2xl"></i>
          </div>
          <h4 className="font-medium text-foreground mb-2">ML Model Integration Pending</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Cancer detection algorithms will be integrated here. The platform is ready for ML training and inference pipelines.
          </p>
          <div className="bg-accent/50 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <i className="fas fa-info-circle mr-1"></i>
              Ready for TensorFlow/PyTorch integration
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
