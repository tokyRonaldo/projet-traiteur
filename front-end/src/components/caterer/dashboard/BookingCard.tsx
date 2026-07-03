type Booking = {
  title: string;
  date: string;
  guests: number;
  location: string;
  price: string;
  status: "confirmed" | "pending";
};

export default function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="flex justify-between p-4 border rounded-xl bg-white hover:border-red-500">
      <div>
        <h4 className="font-bold">{booking.title}</h4>
        <p className="text-sm text-gray-500">
          {booking.guests} invités • {booking.location}
        </p>
      </div>

      <div className="text-right">
        <span className="text-xs px-2 py-1 rounded bg-gray-100">
          {booking.status}
        </span>
        <p className="font-bold">{booking.price}</p>
      </div>
    </div>
  );
}