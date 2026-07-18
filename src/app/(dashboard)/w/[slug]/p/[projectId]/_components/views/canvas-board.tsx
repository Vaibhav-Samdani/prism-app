// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/canvas-board.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, Save, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CanvasBoard({ workspaceId, projectId }: { workspaceId: string | undefined; projectId: string | undefined }) {
  const [Excalidraw, setExcalidraw] = useState<any>(null);
  const [canvasDoc, setCanvasDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const excalidrawRef = useRef<any>(null);

  // 1. Fetch or automatically construct a canvas asset for this project
  useEffect(() => {
  async function initCanvas() {
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}/documents`);
      const data = await res.json();
      
      // Defensive check: ensure data is parsed safely
      const docs = Array.isArray(data) ? data : [];
      let currentCanvas = docs.find((d: any) => d.type === "WHITEBOARD");

      if (!currentCanvas) {
        // Auto-initialize whiteboard record structure
        const createRes = await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            title: "Project Board Canvas", 
            type: "WHITEBOARD", 
            content: [] 
          }),
        });
        currentCanvas = await createRes.json();
      }
      setCanvasDoc(currentCanvas);
    } catch (err) {
      console.error("Failed initializing canvas metadata:", err);
    } finally {
      setLoading(false);
    }
  }

  initCanvas();
  import("@excalidraw/excalidraw").then((comp) => {
    setExcalidraw(() => comp.Excalidraw);
  });
}, [workspaceId, projectId]);

  // 2. Optimized Debounced Auto-save to prevent thread blocking
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const saveCanvasData = useCallback((elements: any[]) => {
    if (!canvasDoc?.id) return;
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(async () => {
      try {
        await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}/documents/${canvasDoc.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: elements }),
        });
      } catch (err) {
        console.error("Auto-save sync failure:", err);
      }
    }, 1500); // Saves 1.5 seconds after user stops drawing
  }, [canvasDoc, workspaceId, projectId]);

  if (loading || !Excalidraw) {
    return (
      <div className="flex w-full h-[calc(100vh-180px)] min-h-[600px] items-center justify-center bg-[#f8f9fa] dark:bg-[#121212] border border-border rounded-lg text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading Canvas Engine...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-180px)] min-h-[600px] border border-border rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Excalidraw 
          ref={(api: any) => { excalidrawRef.current = api; }}
          theme="dark"
          name={canvasDoc?.title || "Prism_Project_Canvas"} 
          initialData={{
            elements: canvasDoc?.content || [],
            appState: { 
              // viewBackgroundColor: "#121212",
              currentItemFontFamily: 1, 
            }
          }}
          gridModeEnabled={true} 
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: true,
              clearCanvas: true,
              loadScene: false, 
              export: { saveFileToDisk: true },
              saveAsImage: true,
              toggleTheme: true, 
            },
          }}
          renderTopRightUI={() => (
            <div className="flex items-center gap-2 pr-4">
              <Button size="sm" variant="secondary" className="h-8 text-xs bg-muted/50 border border-border hover:bg-muted/80 backdrop-blur-md">
                <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
              </Button>
              <Button 
                size="sm" 
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                onClick={() => {
                  if (excalidrawRef.current) {
                    saveCanvasData(excalidrawRef.current.getSceneElements());
                  }
                }}
              >
                <Save className="w-3.5 h-3.5 mr-1.5" /> Force Save
              </Button>
            </div>
          )}
          onChange={(elements: any[]) => {
            // Filter out deleted elements before saving to PostgreSQL
            const activeElements = elements.filter(el => !el.isDeleted);
            if (activeElements.length > 0) {
              saveCanvasData(activeElements);
            }
          }}
        />
      </div>
    </div>
  );
}