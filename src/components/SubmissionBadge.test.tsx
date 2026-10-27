import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubmissionBadge } from "./SubmissionBadge";
import { ClaimStatus } from "../types/index";
import type { ApiClaim } from "../types/index";

const sampleClaim: ApiClaim = {
  id: "claim-101",
  itemId: "item-001",
  claimerId: "user-001",
  message: "I lost my ID card here yesterday.",
  contactNumber: "09123456789",
  status: ClaimStatus.Pending,
  createdAt: "2026-10-20T10:00:00.000Z",
};

describe("SubmissionBadge", () => {
  it("shows the item name and status for pending claim", () => {
    render(
      <SubmissionBadge
        claim={sampleClaim}
        itemName="Student ID Card"
        claimerName="Juan Dela Cruz"
        onApprove={() => {}}
        onReject={() => {}}
      />,
    );

    expect(screen.getByText("Claim for Student ID Card")).toBeInTheDocument();
    expect(screen.getByText(ClaimStatus.Pending)).toBeInTheDocument();
  });

  it("changes status display when claim is approved", () => {
    const approvedClaim: ApiClaim = {
      ...sampleClaim,
      status: ClaimStatus.Approved,
    };

    render(
      <SubmissionBadge
        claim={approvedClaim}
        itemName="Student ID Card"
        claimerName="Juan Dela Cruz"
        onApprove={() => {}}
        onReject={() => {}}
      />,
    );

    expect(screen.getByText(ClaimStatus.Approved)).toBeInTheDocument();
  });
});
