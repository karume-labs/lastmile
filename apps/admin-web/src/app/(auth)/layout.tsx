const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center px-4">{children}</div>
    </div>
  );
};

export default AuthLayout;
