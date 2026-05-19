import { redirect } from "next/navigation";

export default function LeaveApprovalsRedirect() {
  redirect("/attendance/leave?tab=team");
}
