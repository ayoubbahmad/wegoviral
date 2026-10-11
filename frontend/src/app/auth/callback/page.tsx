import { Suspense } from "react";
import { AuthCallbackContainer } from "@/containers/Auth/Callback";

export default function AuthCallbackPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <Suspense>
                <AuthCallbackContainer />
            </Suspense>
        </div>
    );
}
