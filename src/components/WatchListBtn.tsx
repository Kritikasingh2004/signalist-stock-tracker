"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { useDebounce } from "@/lib/useDebounce";

const WatchListBtn = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(isInWatchlist);
  const [isLoading, setIsLoading] = useState(false);

  // Sync prop changes with local state
  useEffect(() => {
    setAdded(isInWatchlist);
  }, [isInWatchlist]);

  const label = useMemo(() => {
    if (type == "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const toggleWatchlist = async () => {
    setIsLoading(true);
    try {
      const result = added
        ? await removeFromWatchlist(symbol)
        : await addToWatchlist(symbol, company);

      if (result.success) {
        const newState = !added;
        setAdded(newState);

        toast.success(added ? "Removed from watchlist" : "Added to watchlist", {
          description: `${company} ${
            added ? "removed from" : "added to"
          } your watchlist.`,
        });

        onWatchlistChange?.(symbol, !added);
      } else {
        toast.error("Failed to update watchlist");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedToggle = useDebounce(toggleWatchlist, 120);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    debouncedToggle();
  };

  if (type === "icon") {
    return (
      <button
        disabled={isLoading}
        title={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        aria-label={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
      >
        <Star
          fill={added ? "currentColor" : "none"}
          className={isLoading ? "animate-pulse" : ""}
        />
      </button>
    );
  }
  return (
    <button
      disabled={isLoading}
      className={`watchlist-btn ${added ? "watchlist-remove" : ""}`}
      onClick={handleClick}
    >
      {showTrashIcon && added ? <Trash2 /> : null}
      <span>{label}</span>
    </button>
  );
};
export default WatchListBtn;
