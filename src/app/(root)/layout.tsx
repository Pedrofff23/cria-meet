import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Cria meet",
    description: "Crie salas de reunião online com facilidade",
    icons:{
        icon: "/icons/logo.svg",
    }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main>
            <StreamVideoProvider  >{children}</StreamVideoProvider>
        </main>
    );
};

export default RootLayout;
