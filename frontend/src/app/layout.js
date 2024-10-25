import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import SessionAuthProvider from "@/context/session-auth-provider";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gestion oftalmologica",
  description: "Sistema de gestion oftalomologica",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container"> 
          <SessionAuthProvider>
            <Navbar></Navbar>
            {children}
          </SessionAuthProvider>
        </main>
      </body>
    </html>
  );
}
