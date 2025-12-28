import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container flex h-auto items-center justify-center py-16 text-center">
      <div className="w-full max-w-xl rounded-xl border border-gray-700 bg-gray-800 p-6 md:p-8">
        <h1 className="text-xl font-semibold text-gray-400 md:text-2xl flex items-center gap-3 justify-center">
          <SearchX className="size-6 text-gray-400" />
          Stock page not found
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          Sorry, this stock data may be unavailable or restricted by our data
          provider. Please try searching for a different stock.
        </p>
        <div className="py-3 w-full">
          <Link href="/">
            <Button className="watchlist-btn w-full">Go Home</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
