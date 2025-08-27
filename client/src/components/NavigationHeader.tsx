import { Link, useLocation } from "wouter";

export default function NavigationHeader() {
  const [location] = useLocation();

  const isActive = (path) => {
    if (path === "/" && location === "/") return true;
    return path !== "/" && location.startsWith(path);
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-primary-foreground text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediScan</h1>
              <p className="text-xs text-muted-foreground">MRI Cancer Detection</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors ${
                isActive("/") 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="nav-upload"
            >
              Upload
            </Link>
            <Link 
              href="/results" 
              className={`text-sm font-medium transition-colors ${
                isActive("/results") 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="nav-results"
            >
              Results
            </Link>
            <Link 
              href="/history" 
              className={`text-sm font-medium transition-colors ${
                isActive("/history") 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="nav-history"
            >
              History
            </Link>
            <Link 
              href="#settings" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-settings"
            >
              Settings
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              data-testid="button-notifications"
            >
              <i className="fas fa-bell"></i>
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <i className="fas fa-user text-primary-foreground text-sm"></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
