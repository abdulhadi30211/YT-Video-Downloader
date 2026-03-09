import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10 text-foreground">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-4">
          <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
          <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
            <span>Return to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
