'use client';

export default function BookingTable() {
  const data = [
    {
      name: 'Saffron Hearth',
      date: 'Sep 12',
      guests: 24,
      total: '$1450',
      status: 'Completed',
    },
    {
      name: 'Terra Kitchen',
      date: 'Aug 28',
      guests: 40,
      total: '$2100',
      status: 'Completed',
    },
  ];

  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Caterer</th>
            <th>Date</th>
            <th>Guests</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t cursor-pointer hover:bg-gray-50">
              <td className="p-3 font-bold">{item.name}</td>
              <td>{item.date}</td>
              <td>{item.guests}</td>
              <td>{item.total}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}