// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/canvas-board.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CanvasBoard() {
  const [Excalidraw, setExcalidraw] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the library only after the component mounts on the client.
    // We use a thunk () => comp.Excalidraw because React state setters execute functions.
    import("@excalidraw/excalidraw").then((comp) => {
      setExcalidraw(() => comp.Excalidraw);
    });
  }, []);

  if (!Excalidraw) {
    return (
      <div className="flex w-full h-[calc(100vh-180px)] min-h-[600px] items-center justify-center bg-[#f8f9fa] dark:bg-[#121212] border border-border rounded-lg text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading Canvas Engine...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-180px)] min-h-[600px] border border-border rounded-lg overflow-hidden">
      {/* Absolute inset-0 forces the canvas to stay exactly within this box */}
      <div className="absolute inset-0">
        <Excalidraw 
  theme="dark"
  // 1. Better Naming: Exports will now be named "Prism_Project_Canvas.png" instead of "Untitled"
  name="Prism_Project_Canvas" 
  
  // 2. Initial State Upgrades
  initialData={{
    appState: { 
      viewBackgroundColor: "#ffffff",
      currentItemFontFamily: 1, // 1=Virgil (Handwritten), 2=Helvetica, 3=Cascadia
    }
  }}
  
  // 3. Precision & Focus Modes
  gridModeEnabled={true} // Engineers/Designers love starting with a grid
  zenModeEnabled={false} // Set to true if you want to hide all UI for a full-screen focus mode
  
  // 4. Expanded UI Options
  UIOptions={{
    canvasActions: {
      changeViewBackgroundColor: true,
      clearCanvas: true,
      loadScene: false, 
      export: { saveFileToDisk: true },
      saveAsImage: true,
      toggleTheme: true, // Let users toggle light/dark within the canvas itself
    },
  }}

  // 5. THE KILLER FEATURE: Inject custom React components into Excalidraw's UI
  renderTopRightUI={() => (
    <div className="flex items-center gap-2 pr-4">
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-8 text-xs bg-muted/50 border border-border hover:bg-muted/80 backdrop-blur-md"
      >
        <Share2 className="w-3.5 h-3.5 mr-1.5" />
        Share
      </Button>
      <Button 
        size="sm" 
        className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        onClick={() => {
          // Trigger your Prisma database save here
          console.log("Saving to Prism DB...");
        }}
      >
        <Save className="w-3.5 h-3.5 mr-1.5" />
        Save Canvas
      </Button>
    </div>
  )}

  // 6. Real-time Collaboration & Auto-save Hook
  onChange={(elements, appState) => {
    // This fires every time a user draws something. 
    // PRO TIP: Wrap this in a lodash debounce (e.g., 2000ms) 
    // to auto-save to your Next.js API route without frying your database!
    console.log("Elements changed:", elements.length);
  }}
/>
      </div>
    </div>
  );
}