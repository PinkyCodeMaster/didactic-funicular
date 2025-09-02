import { Navigation } from "@/components/navigation";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-svh">
            <div className="">
                <Navigation />
                {children}
            </div>
        </div>
    );
}