import React from "react";
import { ItemStatus } from "../types/index";
import type { Item } from "../types/index";

export interface ItemCardProps {
  item: Item;
  onClaim: (itemId: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClaim }) => {
  const getStatusClass = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.Open:
        return "status-open";
      case ItemStatus.Claimed:
        return "status-claimed";
      case ItemStatus.Closed:
        return "status-closed";
      default:
        return "";
    }
  };

  const handleClaimClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClaim(item.id);
  };

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h3 className="item-title">{item.title}</h3>
        <span className={`item-status-badge ${getStatusClass(item.status)}`}>
          {item.status.toUpperCase()}
        </span>
      </div>
      <div className="item-card-body">
        <p className="item-desc">{item.description}</p>
        <div className="item-details">
          <p>
            <strong>📍 Location:</strong> {item.location}
          </p>
          <p>
            <strong>📅 Reported:</strong> {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="item-card-footer">
        {item.status === ItemStatus.Open ? (
          <button className="btn-claim" onClick={handleClaimClick}>
            Claim Item
          </button>
        ) : (
          <span className="btn-claim-disabled">Unavailable</span>
        )}
      </div>
    </div>
  );
};
