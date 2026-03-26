import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import {
  Code2,
  Server,
  Layers,
  BrainCircuit,
  Shield,
  Palette,
  BarChart3,
  MonitorSmartphone,
  Video,
  Cloud,
  Cpu,
  Database,
  Wand2,
  Users,
} from "lucide-react";

const categories = [
  { name: "Frontend Developer", icon: MonitorSmartphone, color: "from-blue-500 to-cyan-500" },
  { name: "Backend Developer", icon: Server, color: "from-green-500 to-emerald-500" },
  { name: "Full Stack Developer", icon: Layers, color: "from-violet-500 to-purple-500" },
  { name: "MERN Developer", icon: Code2, color: "from-orange-500 to-amber-500" },
  { name: "Data Scientist", icon: BarChart3, color: "from-pink-500 to-rose-500" },
  { name: "DevOps Engineer", icon: Cloud, color: "from-sky-500 to-blue-500" },
  { name: "ML Engineer", icon: BrainCircuit, color: "from-purple-500 to-fuchsia-500" },
  { name: "AI Engineer", icon: Cpu, color: "from-indigo-500 to-violet-500" },
  { name: "Cybersecurity", icon: Shield, color: "from-red-500 to-orange-500" },
  { name: "Product Manager", icon: Users, color: "from-teal-500 to-cyan-500" },
  { name: "UX/UI Designer", icon: Palette, color: "from-yellow-500 to-orange-500" },
  { name: "Database Admin", icon: Database, color: "from-emerald-500 to-green-500" },
  { name: "Graphics Designer", icon: Wand2, color: "from-fuchsia-500 to-pink-500" },
  { name: "Video Editor", icon: Video, color: "from-rose-500 to-red-500" },
];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchjobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="py-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">
          Explore By <span className="text-primary">Category</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Find your perfect role across 14+ career paths
        </p>
      </div>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent className="-ml-2">
          {categories.map((cat) => (
            <CarouselItem
              key={cat.name}
              className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <button
                onClick={() => searchjobHandler(cat.name)}
                className="w-full p-4 rounded-2xl bg-card border border-border hover-lift text-center group transition-all duration-300"
              >
                <div
                  className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <cat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors leading-tight">
                  {cat.name}
                </p>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Categories;
