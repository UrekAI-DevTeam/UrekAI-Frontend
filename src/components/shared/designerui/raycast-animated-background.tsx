import { cn } from "@/utils/cn";
import { useState, useEffect } from "react";
import "./raycast-animated-background.css";
import dynamic from "next/dynamic";

// Dynamically import UnicornScene to avoid SSR issues
const UnicornScene = dynamic(() => import("unicornstudio-react"), {
  ssr: false,
});

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 1920, // Default fallback width
    height: 1080, // Default fallback height
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { ...windowSize, isClient };
};

export const Component = ({ variant = 'dark' }: { variant?: 'light' | 'dark' }) => {
  const { width, height, isClient } = useWindowSize();

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className={cn(
        "w-full h-full animate-pulse",
        variant === 'light' 
          ? "bg-white" 
          : "bg-black"
      )} />
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center w-full h-full overflow-hidden",
        variant === 'light'
          ? "bg-white"
          : "bg-black"
      )}
    > 
      <UnicornScene 
        production={true} 
        projectId="cbmTT38A0CcuYxeiyj5H" 
        width={width} 
        height={height} 
        className="unicorn-transparent"
      />
    </div>
  );
};
