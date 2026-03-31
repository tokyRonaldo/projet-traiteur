import CatererSearchCard from '../ui/CatererSearchCard';

const caterers = [
  {
    name: "Gourmet Gala Events",
    rating: 4.9,
    priceLevel: "$$$",
    cuisines: ["French", "Molecular"],
    location: "Upper East Side, NYC",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCCZEDqzlfjQz_NwKxUBCCB8SRgSts_WzDkP0PJeIfIKm-i2eztVf78VrwpFKA3d0kDH5No1thy3MiEwUtNmYkbeLQCWwd9VdmtKJH1ezAcQiOkzzJLhHmt8kJEilS3Cf9WrsFBeQQPTxiRPqASaG-kEJ_aFTiaJYj_3e6W6EPIZsA0Xjj0iTg5e1gbyVLlNFAMuPSt3SK0qvzrj7PMrsKauYtdGPIA5uM9sJoc0G_JGYKvYpnFaa8yZmWGofSUxMsAkzp2hU-3ZGj",
  },
  {
    name: "The Green Kitchen",
    rating: 4.7,
    priceLevel: "$$",
    cuisines: ["Vegan", "Organic"],
    location: "Brooklyn, NY",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVh0i_95VQoiegYlHVaXt25c-Di0hEVJrRcOqPeAJVe4xFWfqbcL2VoiJ987AhwYyy5vxsZ3XmSX97ziypK2XCqFaaMnYJzj95lI2qKbXKkbNZAUZNBDPEhrxMWvcpmzt25qUFP0r3KdXh5g2NKn900kXPoRAnIsipdrDA2RN-Bn2TqlMkNr0z7VAKxc5Tx9WzWnS9WAugL-MHbaLPSGgJAcwJ9TjDHll3pbfESlphfE5p1dJ_MMhPToEEr4q86MdpHbwSkwX3maZ8",
  },
  // Ajoute les 4 autres cartes de la même manière...
  {
    name: "Mama Rosa's Italian",
    rating: 4.8,
    priceLevel: "$$",
    cuisines: ["Italian", "Family Style"],
    location: "Queens, NY",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWNkVPr8fBd6IjYjXVIQSfdCSEN-1MbilbWcfbRkfFZtdBjnDN89W79PqCdwMSbM6lEE7AykQyUpVAGa_3xoBTaXOyNdc69fBo9806ZE2WqEqB2cO64LdLbo84PU_cZOgKbmyq-SdvPLrKH2Zj-tHM_CvF23_SK77kMBBghJxQHDLt6zim3ya-zs3h0NRTz0o2zBOymGOZZQkvpDCQOFUkrYIIt_1Wdzb_8auLdHzd6eQykP64MMC0vkVNI7nqBsPFnHqk4bDztbQf",
  },
  {
    name: "Zesty Taco Co.",
    rating: 4.5,
    priceLevel: "$",
    cuisines: ["Mexican", "Street Food"],
    location: "Jersey City, NJ",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcqtqpQCrHCWKkJ4jt9gD05eei3V5x4tsu7UkUn_Z9qWRIdsSEvmNlAewLQkqF3PUg0zGxxJhj-n4jIcuYj5ajlcNM11UXXqCi4wdcUY9qdNb5BN2qw3xkh89FCo2FvyTqLQ773AyfG_NbNhoX_h0_Q20gHozqQNgNCVHf9aMrSn5S3AU0DgfMxwx5Qkzu5kuSE0VKOocbhid4A3NsykfatdGOa4Kgp8SUsvqGkjrNzn7NVEVxhgnrBEj6U15zpBZoLWNCghuQZNsc",
  },
  {
    name: "Zen Sushi Arts",
    rating: 5.0,
    priceLevel: "$$$$",
    cuisines: ["Japanese", "Fine Dining"],
    location: "Manhattan, NY",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7ZPnw_75kBqiT8xYK5tGv3jtJ8aqXwvIl1jOn-9y2q8YZRCbQI60nf1OX3vhioIJXtIieJzZlHLX99Co4RpMK8IeD5Efuz6MjoKdmadh_Nwh9tvywARFCUtg4U_rsAutoLX9WzP-8pDmX35X5OOXfDIbceHNa923cbdd5zfKiqCAoGN3zVKFspr5Yf6ArB6hTbiC8iLKFYBOy3_Z7FlxaF_XRctEvC-y6mWitXFdPJep9sjEUNL58RPf6uQcIGfNhE_GaxPBpMv67",
  },
  {
    name: "Urban Bites Co.",
    rating: 4.6,
    priceLevel: "$$",
    cuisines: ["Fusion", "Appetizers"],
    location: "Astoria, NY",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI5M6zsjMxNQmHLlR7fh6NRkBstb_FpuuHKnevT-VPRsdmttTptDaRdmfCYIJuePn1CuHIUIgRhuYKcodSqnlXvJ1HUhGN-BwQZfXjWQsoBXZTH8qledH0Ir_RBKaHGXdmq0QFFHuq6V6g6xjZW6q75oUzvHYDMtT_UNgYIlS_4qZfJB41w-a3-7oz496PCI1Ilu_Sqk5bigawdwEC-BIRGPQUJg2va62eG-H-MJPlT6uANzJRgb50z9vHSOPH6SjswVvStwirYSdJ",
  },
];

export default function CatererGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {caterers.map((caterer, index) => (
        <CatererSearchCard key={index} {...caterer} />
      ))}
    </div>
  );
}