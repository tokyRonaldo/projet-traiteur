import CatererLayout from "@/components/caterer/CatererLayout";
import DashboardGrid from "@/components/caterer/dashboard/DashboardGrid";
import Bookings from "@/components/caterer/bookings/Bookings";

export default function CatererProfile() {
  return (
    <CatererLayout>
        <Bookings />
    </CatererLayout>
  );
}