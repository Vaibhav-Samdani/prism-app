"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
// Import your custom logout hook from wherever it lives
import { useLogout } from "@/hooks/use-logout"; // <-- Update this path to match your project!

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function LogoutConfirmItem() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  
  const logout = useLogout();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Execute your custom logout logic
      await logout();
      
      router.push("/sign-in?redirect=%2Fdashboard"); // Redirect to the login page after logout
      toast.success("Successfully logged out.");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 1. The Menu Item */}
      <DropdownMenuItem
        className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        onSelect={(e) => {
          // Prevent the dropdown from closing immediately, which would unmount our modal
          e.preventDefault(); 
          setIsOpen(true);
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </DropdownMenuItem>

      {/* 2. The Confirmation Modal */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Sign out of Prism?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You will be securely signed out of your account and returned to the login screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={isLoggingOut} className="mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Prevent closing until logout is done
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                "Sign out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}