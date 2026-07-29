import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");

      setProfile(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    setLoadingProfile(true);

    try {
      const response = await api.put("/profile", {
        name,
        email,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));

      setProfile(response.data.user);

      toast.success("Profile updated successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoadingPassword(true);

    try {
      await api.put("/profile/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
    } finally {
      setLoadingPassword(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };
  const formatRole = (role: string) => {
  if (role === "USER") return "Utilisateur";
  if (role === "ADMIN") return "Admin";
  return role;
};

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <div className="card">
        <h3 style={{ margin: 0 }}>Profile Management</h3>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Manage your personal information and account password.
        </p>
      </div>

      {profile && (
        <div className="profile-grid">
          <div className="card profile-summary-card">
            <div className="profile-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <h2>{profile.name}</h2>
            <p>{profile.email}</p>

            <div className="profile-info-list">
              <div>
                <span>Role</span>
                <strong>{formatRole(profile.role)}</strong>
              </div>

              <div>
                <span>Account created</span>
                <strong>{formatDate(profile.createdAt)}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={updateProfile} className="card">
            <h3>Update Profile</h3>

            <div className="form-grid grid-2">
              <div>
                <label>Name</label>
                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <button
                type="submit"
                className="primary-button"
                disabled={loadingProfile}
              >
                {loadingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <form onSubmit={changePassword} className="card">
        <h3>Change Password</h3>

        <div className="form-grid grid-3">
          <div>
            <label>Current password</label>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label>New password</label>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <button
            type="submit"
            className="primary-button"
            disabled={loadingPassword}
          >
            {loadingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
