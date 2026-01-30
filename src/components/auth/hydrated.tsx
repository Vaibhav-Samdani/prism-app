"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useEffect, useState } from "react";
import { MorphingSquare } from "@/components/ui/loader";

export default function Hydrated({ children }: { children: React.ReactNode }) {
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by ensuring we only show the loader or content
    // after the component has mounted on the client.
    // Initially (server + first client render), we show the loader (or null).
    // But wait, if we show loader on server, that's fine.

    if ( !hasHydrated) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <MorphingSquare message="Initializing..." />
            </div>
        );
    }

    return <>{children}</>;
}
