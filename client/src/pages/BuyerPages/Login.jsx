
import { useRedirectIfAuthenticated } from "../../components/hooks/useRedirectIfAuthenticated";
import LoginForm from "../../components/LoginForm";
import { Link } from "react-router-dom";

export default () => {

  useRedirectIfAuthenticated()
  
  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center">
            <Link to="/">
              <span className="text-2xl font-bold">
                local<span className="text-primary">Shop</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold text-primary">
                Welcome back
              </h1>
              <p className="text-gray-600 mt-2">
                Sign in to access your account
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>© 2025 localShop. All rights reserved.</p>
      </footer>
    </div>
  );
};

