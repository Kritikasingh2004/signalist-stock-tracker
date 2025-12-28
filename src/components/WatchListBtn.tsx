"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
    if (type == "icon") return "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const addedRef = useRef(added);
  addedRef.current = added;

  const toggleWatchlist = async () => {
    setIsLoading(true);
    try {
      const result = addedRef.current
        ? await removeFromWatchlist(symbol)
        : await addToWatchlist(symbol, company);

      if (result.success) {
        const newState = !addedRef.current;
        setAdded(newState);

        toast.success(
          addedRef.current ? "Removed from watchlist" : "Added to watchlist",
          {
            description: `${company} ${
              addedRef.current ? "removed from" : "added to"
            } your watchlist.`,
          },
        );

        onWatchlistChange?.(symbol, newState);
      } else {
        toast.error("Item already in watchlist");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update watchlist",
      );
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
