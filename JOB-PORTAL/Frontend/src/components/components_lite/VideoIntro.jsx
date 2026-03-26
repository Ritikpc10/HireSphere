import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Video,
  Play,
  Square,
  Upload,
  Trash2,
  Clock,
  Eye,
  RefreshCw,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

const VideoIntro = () => {
  const { user } = useSelector((store) => store.auth);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [stream, setStream] = useState(null);
  const [timer, setTimer] = useState(0);
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setVideoURL(URL.createObjectURL(blob));
      stopCamera();
    };
    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= 59) {
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const resetVideo = () => {
    setVideoURL(null);
    setTimer(0);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s) => `0:${s.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Video Introduction</h1>
            <p className="text-sm text-muted-foreground">Record a 60-second intro to stand out from the crowd</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden bg-black aspect-video relative">
              {videoURL ? (
                <video
                  src={videoURL}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover mirror"
                  style={{ transform: "scaleX(-1)" }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                  <Camera className="h-16 w-16 mb-4" />
                  <p className="text-sm">Click "Start Camera" to begin</p>
                </div>
              )}

              {/* Recording Timer */}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-mono">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  {formatTime(timer)} / 1:00
                </div>
              )}

              {/* Timer Progress Bar */}
              {isRecording && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div
                    className="h-full bg-red-500 transition-all duration-1000"
                    style={{ width: `${(timer / 60) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {!stream && !videoURL && (
                <Button onClick={startCamera} className="bg-primary">
                  <Camera className="h-4 w-4 mr-2" /> Start Camera
                </Button>
              )}
              {stream && !isRecording && (
                <>
                  <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white">
                    <Play className="h-4 w-4 mr-2" /> Record
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>Cancel</Button>
                </>
              )}
              {isRecording && (
                <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white">
                  <Square className="h-4 w-4 mr-2" /> Stop Recording
                </Button>
              )}
              {videoURL && (
                <>
                  <Button onClick={() => toast.success("Video saved to your profile!")} className="bg-primary">
                    <Upload className="h-4 w-4 mr-2" /> Save to Profile
                  </Button>
                  <Button variant="outline" onClick={resetVideo}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Re-record
                  </Button>
                  <Button variant="destructive" onClick={resetVideo}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-100" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" /> Tips for a Great Intro
              </h3>
              <div className="space-y-3">
                {[
                  "Start with your name and professional background",
                  "Mention your key skills and experience",
                  "Talk about what you're looking for",
                  "Show enthusiasm and personality",
                  "Keep it under 60 seconds",
                  "Good lighting and a clean background",
                  "Speak clearly and confidently",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                <strong className="text-primary">Pro Tip:</strong> Profiles with video introductions get <strong>3x more recruiter views</strong> and <strong>2x more interview calls</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoIntro;
