import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "../../components/ui/button";

const ProfileDropdown = ({ user, onSignOut }) => {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={profileRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setShowProfile(!showProfile);
        }}
      >
        <User className="h-6 w-6" />
      </Button>

      {showProfile && (
        <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3 border-b pb-2 mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
              <User />
            </div>
            <h3 className="text-sm font-medium text-gray-800">
              {user?.username || "Guest"}
            </h3>
          </div>

          <div className="mt-2">
            <Button
              onClick={onSignOut}
              className="block w-full text-left text-sm text-accent hover:text-primary hover:bg-gray-100 px-3 py-2 rounded-md transition"
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
