import React from 'react';

interface Request {
  id: string;
  clientName: string;
  clientInitials: string;
  eventType: string;
  date: string;
  serviceName: string;
  status: 'PENDING' | 'CONFIRMED';
  serviceBg: string;
  serviceColor: string;
}

const RequestsTable: React.FC = () => {
  const requests: Request[] = [
    {
      id: '1',
      clientName: 'Julianne Devis',
      clientInitials: 'JD',
      eventType: 'Personal Celebration',
      date: 'Nov 12, 2023',
      serviceName: 'Wedding Excellence',
      status: 'PENDING',
      serviceBg: 'bg-[#ffdad4]',
      serviceColor: 'text-[#bf3a2b]',
    },
    {
      id: '2',
      clientName: 'TechLoom Inc.',
      clientInitials: 'TL',
      eventType: 'Quarterly Meeting',
      date: 'Oct 28, 2023',
      serviceName: 'Corporate Lunch',
      status: 'CONFIRMED',
      serviceBg: 'bg-[#c1e8ff]',
      serviceColor: 'text-[#005876]',
    },
    {
      id: '3',
      clientName: 'Marcus Rivera',
      clientInitials: 'MR',
      eventType: 'Dinner Party',
      date: 'Dec 05, 2023',
      serviceName: 'Custom Menu',
      status: 'PENDING',
      serviceBg: 'bg-[#ffdad4]',
      serviceColor: 'text-[#bf3a2b]',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-[#333333]">Recent Client Requests</h3>
        <a className="text-sm font-bold text-[#bf3a2b] underline" href="#">See All Requests</a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#bf3a2b]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FFF8F2] text-xs font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-8 py-4">Client</th>
                <th className="px-8 py-4">Event Date</th>
                <th className="px-8 py-4">Service</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#fce3de] flex items-center justify-center font-bold text-[#bf3a2b]">
                        {req.clientInitials}
                      </div>
                      <div>
                        <p className="font-bold text-[#333333]">{req.clientName}</p>
                        <p className="text-xs text-slate-400">{req.eventType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 font-medium">{req.date}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 ${req.serviceBg} ${req.serviceColor} text-xs font-bold rounded-full`}>
                      {req.serviceName}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`flex items-center gap-1.5 text-xs font-black ${
                      req.status === 'CONFIRMED' ? 'text-emerald-600' : 'text-[#F39C12]'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        req.status === 'CONFIRMED' ? 'bg-emerald-600' : 'bg-[#F39C12]'
                      }`}></span>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="px-4 py-2 bg-white border border-[#e1bfb9] text-[#333333] text-sm font-bold rounded-lg hover:border-[#bf3a2b] hover:text-[#bf3a2b] transition-all active:scale-95">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RequestsTable;