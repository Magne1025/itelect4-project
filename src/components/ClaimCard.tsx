import React from "react";
import { ClaimStatus } from "../types/index";
import type { Claim } from "../types/index";

export interface ClaimCardProps {
  claim: Claim;
  itemName: string;
  claimerName: string;
  onApprove: (claimId: number) => void;
  onReject: (claimId: number) => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({
  claim,
  itemName,
  claimerName,
  onApprove,
  onReject,
}) => {
  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.Pending:
        return "claim-pending";
      case ClaimStatus.Approved:
        return "claim-approved";
      case ClaimStatus.Rejected:
        return "claim-rejected";
      case ClaimStatus.Completed:
        return "claim-completed";
      default:
        return "";
    }
  };

  const handleApprove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onApprove(claim.id);
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onReject(claim.id);
  };

  return (
    <div className="claim-card">
      <div className="claim-card-header">
        <h4>Claim for {itemName}</h4>
        <span className={`claim-status-tag ${getStatusColor(claim.status)}`}>
          {claim.status.toUpperCase()}
        </span>
      </div>
      <div className="claim-card-body">
        <p className="claim-message">
          <strong>Message:</strong> "{claim.message}"
        </p>
        <p className="claim-claimer">
          <strong>Submitted by:</strong> {claimerName}
        </p>
        <p className="claim-date">
          <strong>Date:</strong> {new Date(claim.createdAt).toLocaleDateString()}
        </p>
      </div>
      {claim.status === ClaimStatus.Pending && (
        <div className="claim-card-actions">
          <button className="btn-approve" onClick={handleApprove}>
            Approve
          </button>
          <button className="btn-reject" onClick={handleReject}>
            Reject
          </button>
        </div>
      )}
    </div>
  );
};
