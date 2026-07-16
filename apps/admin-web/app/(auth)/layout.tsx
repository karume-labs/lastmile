import type React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center px-4">
        {/* Placeholder for Logo */}
        <div className="mb-6 flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
          <span className="text-xl font-bold text-primary">LM</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
