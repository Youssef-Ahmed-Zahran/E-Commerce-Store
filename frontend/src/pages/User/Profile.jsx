// src/pages/User/Profile.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const data = { username, email };
      if (password) data.password = password;

      const res = await updateProfile(data).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-3xl shadow-2xl p-8">
              <h1 className="text-3xl font-bold text-white mb-8 text-center">
                Update Profile
              </h1>

              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loadingUpdateProfile}
                    className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg"
                  >
                    {loadingUpdateProfile ? (
                      <span className="flex items-center justify-center">
                        <Loader size="sm" />
                        <span className="ml-2">Updating...</span>
                      </span>
                    ) : (
                      "Update"
                    )}
                  </button>

                  <Link
                    to="/user-orders"
                    className="flex-1 text-center py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    My Orders
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-white">{username}</h3>
              <p className="text-gray-400">{email}</p>
              <p className="mt-4 text-sm text-emerald-400">
                {userInfo.isAdmin ? "System Admin" : "Regular User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
