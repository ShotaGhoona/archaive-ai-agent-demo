"use client";

import { Message } from "../../../types/types";
import { SearchResult } from "../types";
import { formatSearchResults } from "../utils/formatUtils";

interface SearchResultMessageProps {
  searchResults: SearchResult | null;
}

export const createSearchResultMessage = ({ 
  searchResults
}: SearchResultMessageProps): Message | null => {
  if (!searchResults) return null;
  
  const formattedResult = formatSearchResults(searchResults);
  if (!formattedResult) return null;
  
  return {
    id: 'search-result',
    content: formattedResult,
    sender: 'ai',
    timestamp: new Date()
  };
};