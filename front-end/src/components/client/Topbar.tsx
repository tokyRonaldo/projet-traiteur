'use client';

export default function Topbar() {
  return (
    <header className="sticky top-0 bg-surface border-b border-outline-variant px-6 py-4 flex justify-between items-center">

      <div className="w-full max-w-xl relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500">
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-2 rounded-full border"
          placeholder="Search events, quotes, or caterers..."
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined">notifications</span>
        <span className="material-symbols-outlined">shopping_cart</span>

        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuArG7XMgs1-Gg_GvN6IqJC5OTINohRgyllrTNr79XJ2SW82m3hCgAJAvp2xKGFtH2k-oGRp_S1S9i_b7nKwNAiv_YEuYOfLtnxFe0Timi4-fNPhbXjdHSp7SbtM5n5yY3Xobx8N-WKijddtJxnncnGmizNEku8drnD5XMOFM38RQXNkq22cOryUBNokWopA4ZFO1wnRW-gM7L6wBAQb3w9wbAmPIKtAKz1hvNn4Bw58RXrifTK5k3kRtMa-RMr3YughUa4WZLa4bChM"
          className="w-10 h-10 rounded-full object-cover border"
          alt="user"
        />
      </div>
    </header>
  );
}