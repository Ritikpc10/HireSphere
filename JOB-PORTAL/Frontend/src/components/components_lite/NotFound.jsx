import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Navbar from "./Navbar";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] md:text-[14rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradientShift leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 text-[10rem] md:text-[14rem] font-black text-primary/5 leading-none select-none animate-pulseScale">
            404
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-3 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mb-8 opacity-0 animate-fadeSlideIn delay-100" style={{ animationFillMode: "forwards" }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-wrap gap-3 justify-center opacity-0 animate-fadeSlideIn delay-200" style={{ animationFillMode: "forwards" }}>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
          >
            <Home className="h-4 w-4 mr-2" /> Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
          <Button variant="outline" onClick={() => navigate("/Jobs")}>
            <Search className="h-4 w-4 mr-2" /> Browse Jobs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
