
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg font-mono">
      <header className="border-b border-terminal-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-terminal-accent text-xl">task-tracker</h1>
          <button
            className="px-4 py-2 text-terminal-fg hover:text-terminal-accent transition-colors"
          >
            logout
          </button>
        </div>
      </header>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
};

export default Layout;
