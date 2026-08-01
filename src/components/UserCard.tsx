import React from "react";
import { UserRole } from "../types/index";
import type { User } from "../types/index";

export interface UserCardProps {
  user: User;
  onToggleActive: (userId: number) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onToggleActive }) => {
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleActive(user.id);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return "role-admin";
      case UserRole.Finder:
        return "role-finder";
      case UserRole.Claimer:
        return "role-claimer";
      default:
        return "";
    }
  };

  return (
    <div className={`user-card ${user.isActive ? "active" : "inactive"}`}>
      <div className="user-card-header">
        <div className="user-avatar">{user.name.charAt(0)}</div>
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <span className={`role-badge ${getRoleBadgeColor(user.role)}`}>
            {user.role}
          </span>
        </div>
      </div>
      <div className="user-card-body">
        <p className="user-email">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="user-status">
          <strong>Status:</strong>{" "}
          <span className={`status-text ${user.isActive ? "status-active" : "status-inactive"}`}>
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </p>
      </div>
      <div className="user-card-actions">
        <button className="btn-toggle-active" onClick={handleToggle}>
          Toggle Status
        </button>
      </div>
    </div>
  );
};
