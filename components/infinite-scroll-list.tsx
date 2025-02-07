// InfiniteScrollList.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Recipe } from '@/types/recipes/recipes';

interface InfiniteScrollListProps {
  fetchMore: () => Promise<Recipe[]>;
  initialItems: Recipe[];
  onItemClick: (item: Recipe) => void;
  loading: boolean;
}

const InfiniteScrollList: React.FC<InfiniteScrollListProps> = ({
  fetchMore,
  initialItems = [],
  onItemClick,
  loading: initialLoading,
}) => {
  const [items, setItems] = useState<Recipe[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const loadMoreItems = useCallback(async () => {
    if (loadingRef.current || !hasMore || initialLoading) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const newItems = await fetchMore();
      setItems((prevItems) => {
        const uniqueNewItems = newItems.filter(
          (newItem) => !prevItems.some((existingItem) => existingItem.id === newItem.id)
        );
        return [...prevItems, ...uniqueNewItems];
      });
      if (newItems.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more items:', error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [fetchMore, hasMore, initialLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loadingRef.current && hasMore && !initialLoading) {
          loadMoreItems();
        }
      },
      { threshold: 0.5 }
    );
    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreItems, hasMore, initialLoading]);

  return (
    <div className="w-full mx-auto h-full overflow-y-auto px-5">
      <h1>User's Recipes:</h1>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick(item)}
          className="p-4 border-b hover:bg-gray-50 cursor-pointer"
        >
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-gray-600 text-sm">{item.description}</p>
        </div>
      ))}

      {hasMore && (
        <div ref={loaderRef} className="p-4 text-center">
          {loading || initialLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent mx-auto" />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollList;
