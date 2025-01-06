import { Geist } from "next/font/google";
import HeaderAuth from "@/components/header-auth"
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "Recipe App",
  description: "Your recipe collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground relative min-h-screen">
        {/* Background Image Layer */}
        <div className="fixed inset-0 z-[-1] opacity-10 dark:opacity-5 pointer-events-none">
          <Image 
            src="https://c02.purpledshub.com/uploads/sites/41/2019/11/GettyImages-114640440-c-b65ec0e.jpg"  // Replace with your background image
            alt="Subtle kitchen background"
            fill
            quality={50}
            priority
            className="object-cover"
          />
        </div>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative z-10">
            <nav className="w-full border-b p-4 bg-background/70 backdrop-blur-md">
              <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Link href="/" className="font-semibold">
                  Recipe App
                </Link>
                <div className="flex items-center gap-4">
                  <Link href="/recipes" className="hover:text-primary transition-colors">Recipes</Link>
                  <Link href="/my-recipes" className="hover:text-primary transition-colors">My Recipes</Link>
                  <Link href="/create" className="hover:text-primary transition-colors">Create Recipe</Link>
                  <HeaderAuth />
                </div>
              </div>
            </nav>
            <div className="max-w-full mx-auto p-4">
              {children}
            </div>
            <footer className="border-t p-4 text-center text-sm bg-background/70 backdrop-blur-md">
              <p>Recipe App © 2024</p>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
