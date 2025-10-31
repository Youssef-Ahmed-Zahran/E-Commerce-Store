// src/pages/Admin/UserList.jsx
import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editingName, setEditingName] = useState(null);
  const [editingEmail, setEditingEmail] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const startEditName = (id, username) => {
    setEditingName(id);
    setNameValue(username);
  };

  const startEditEmail = (id, email) => {
    setEditingEmail(id);
    setEmailValue(email);
  };

  const cancelEdit = () => {
    setEditingName(null);
    setEditingEmail(null);
    setNameValue("");
    setEmailValue("");
  };

  const validateUsername = (name) => {
    if (!name.trim()) return toast.error("Username required"), false;
    if (name.trim().length < 3) return toast.error("Min 3 chars"), false;
    if (name.trim().length > 30) return toast.error("Max 30 chars"), false;
    return true;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return toast.error("Email required"), false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Invalid email"), false;
    return true;
  };

  const saveName = async (id) => {
    if (!validateUsername(nameValue)) return;
    try {
      await updateUser({ userId: id, username: nameValue.trim() }).unwrap();
      toast.success("Username updated");
      cancelEdit();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const saveEmail = async (id) => {
    if (!validateEmail(emailValue)) return;
    try {
      await updateUser({ userId: id, email: emailValue.trim() }).unwrap();
      toast.success("Email updated");
      cancelEdit();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <AdminMenu />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              User Management
            </h1>
            <p className="text-gray-400 mt-1">
              {isLoading
                ? "Loading..."
                : error
                ? "Error"
                : `${users?.length || 0} users`}
            </p>
          </div>

          {/* Loading / Error */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            /* User Cards */
            <div className="space-y-5">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* User Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">ID:</span>
                        <code className="text-xs text-gray-400 font-mono">
                          {user._id}
                        </code>
                      </div>

                      {/* Username */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Name:</span>
                        {editingName === user._id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={nameValue}
                              onChange={(e) => setNameValue(e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                              autoFocus
                            />
                            <button
                              onClick={() => saveName(user._id)}
                              className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all"
                            >
                              <FaCheck className="w-3 h-3" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {user.username}
                            </span>
                            <button
                              onClick={() =>
                                startEditName(user._id, user.username)
                              }
                              className="p-1.5 text-gray-400 hover:text-emerald-400 transition-colors"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Email:</span>
                        {editingEmail === user._id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="email"
                              value={emailValue}
                              onChange={(e) => setEmailValue(e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                              autoFocus
                            />
                            <button
                              onClick={() => saveEmail(user._id)}
                              className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all"
                            >
                              <FaCheck className="w-3 h-3" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${user.email}`}
                              className="text-emerald-400 hover:underline text-sm"
                            >
                              {user.email}
                            </a>
                            <button
                              onClick={() =>
                                startEditEmail(user._id, user.email)
                              }
                              className="p-1.5 text-gray-400 hover:text-emerald-400 transition-colors"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Admin Status */}
                    <div className="flex justify-center">
                      <div
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          user.isAdmin
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.isAdmin ? (
                          <span className="flex items-center gap-1.5">
                            <FaCheck /> Admin
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <FaTimes /> User
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                          title="Delete user"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
