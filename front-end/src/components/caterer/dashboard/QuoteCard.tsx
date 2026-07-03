type Quote = {
  name: string;
  status: string;
  event: string;
  price: string;
};

export default function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <div className="p-4 border-b hover:bg-gray-50">
      <div className="flex justify-between">
        <p className="font-bold">{quote.name}</p>
        <span className="text-xs">{quote.status}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>{quote.event}</span>
        <span>{quote.price}</span>
      </div>
    </div>
  );
}