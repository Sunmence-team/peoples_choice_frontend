import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import api from "../../helpers/api";
import type { SearchableInputProps } from "../../lib/interfaces";

// Example usage
/*
  <SearchableInput
    endpoint="/your endpoint"
    placeholder="your placeholder..."
    onSelect={handleStaffSelect}
    displayKey="name" // the key on each object for it to display
    dataKey="data" // the data to be search for in the response. Use . for nested responses E.g (data.data)
    initialValue={akey} // optional but works
    className="w-full md:text-base text-sm border-gray-300 rounded-lg indent-3 h-12 border outline-0"
  />
*/

const SearchableInput = <T extends object>({
  endpoint,
  onSelect,
  onInputChange,
  displayKey = "name" as keyof T,
  queryParam = "search",
  label,
  placeholder = "Search...",
  className = "",
  inputContClassName = "",
  dataKey,
  initialValue = "",
  showIcon = true,
  fetchOnEmpty = false,
  disabled = false,
}: SearchableInputProps<T>) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSelecting = useRef(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (disabled || !endpoint) {
        setResults([]);
        setLoading(false);
        return;
      }

      if (isSelecting.current) {
        isSelecting.current = false;
        return;
      }

      if (!fetchOnEmpty && (!query || query.trim().length === 0)) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(endpoint, {
          params: { [queryParam]: query },
        });

        // Determine where the array is located
        let data = response.data;
        if (dataKey) {
          // Traverse the data object if dataKey contains dots (e.g. "data.results")
          const keys = dataKey.split(".");
          for (const key of keys) {
            if (data && data[key]) {
              data = data[key];
            } else {
              data = [];
              break;
            }
          }
        } else if (data.data && Array.isArray(data.data)) {
          // Common Laravel common resource pattern response.data.data
          data = data.data;
        }

        if (Array.isArray(data)) {
          let finalResults = data;
          if (query && query.trim().length > 0) {
            const q = query.trim().toLowerCase();
            const clientFiltered = data.filter((item) => {
              const dVal = String(item[displayKey] || "").toLowerCase();
              const itemObj = item as {
                code?: string;
                iso_code?: string;
                currency?: string;
              };
              const codeVal = String(
                itemObj.code || itemObj.iso_code || itemObj.currency || ""
              ).toLowerCase();
              return dVal.includes(q) || codeVal.includes(q);
            });
            if (clientFiltered.length > 0) {
              finalResults = clientFiltered;
            }
          }
          setResults(finalResults);
          setShowDropdown(true);
        } else {
          setResults([]);
          console.warn("SearchableInput: API response is not an array", data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, fetchOnEmpty, endpoint, queryParam, dataKey, disabled]);

  const handleSelect = (item: T) => {
    isSelecting.current = true;
    setQuery(String(item[displayKey] || ""));
    setShowDropdown(false);
    onSelect(item);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={`flex items-center ${
          inputContClassName ? inputContClassName : "h-12.5 px-2"
        }`}
      >
        <div className="pointer-events-none">
          {loading ? (
            <FaSpinner className="animate-spin text-gray-400 ms-2" />
          ) : (
            showIcon && <FaSearch className="text-gray-400" />
          )}
        </div>

        <input
          type="text"
          disabled={disabled}
          className="h-full indent-2 outline-0 w-full placeholder-gray-400 focus:outline-none text-xs sm:text-xs text-primary transition duration-150 ease-in-out bg-transparent disabled:cursor-not-allowed disabled:text-gray-400"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            if (disabled) return;
            const value = e.target.value;
            setQuery(value);
            onInputChange?.(value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (!disabled) setShowDropdown(true);
          }}
        />
      </div>

      {showDropdown &&
        !disabled &&
        (results.length > 0 ||
          error ||
          (query && results.length === 0 && !loading)) && (
          <div className="absolute z-10 index-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base border border-black/15 overflow-auto focus:outline-none sm:text-sm">
            {error && (
              <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-red-500">
                {error}
              </div>
            )}

            {!error && results.length === 0 && !loading && (
              <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">
                No results found.
              </div>
            )}

            {results.map((item, index) => {
              const itemObj = item as {
                id?: string | number;
                code?: string;
                iso_code?: string;
                currency?: string;
              };
              const subLabel =
                itemObj.code ||
                (itemObj.iso_code && itemObj.currency
                  ? `${itemObj.iso_code} • ${itemObj.currency}`
                  : itemObj.currency || itemObj.iso_code);

              return (
                <div
                  key={`result_${itemObj.id ?? itemObj.iso_code ?? itemObj.code ?? index}`}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary/5 group duration-500 transition-all flex items-center justify-between"
                  onClick={() => handleSelect(item)}
                >
                  <span className="block truncate font-normal group-hover:font-semibold duration-100 transition-all">
                    {String(item[displayKey])}
                  </span>
                  {subLabel && (
                    <span className="ml-2 text-[10px] text-gray-400 font-mono shrink-0">
                      ({subLabel})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default SearchableInput;
