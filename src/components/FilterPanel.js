/**
 * FilterPanel.js
 * Component for filtering and searching events
 * - Key search with prioritized fields (title > description > location > tags > date)
 * - Location, tags, and date range hard filters
 * - Fuzzy search with relevance sorting
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Pressable } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import Fuse from 'fuse.js';
import TimeSlot from "./TimeSlot";
import { formatDate } from "../utils";

export default function FilterPanel({ 
  data, 
  onFilteredDataChange 
}) {
  // Filter states
  const [keyFilter, setKeyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [filterSlot, setFilterSlot] = useState({ start: null, end: null });
  const [dateFilterState, setDateFilterState] = useState({ value: "", y: 0, valid: true });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Applied filter states (used for actual filtering)
  const [appliedKeyFilter, setAppliedKeyFilter] = useState("");
  const [appliedLocationFilter, setAppliedLocationFilter] = useState([]);
  const [appliedTagsFilter, setAppliedTagsFilter] = useState([]);
  const [appliedFilterSlot, setAppliedFilterSlot] = useState({ start: null, end: null });

  // Options for filters derived from data
  const [locations, setLocations] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // Deduplicate very similar items using fuzzy matching
  const deduplicateSimilar = useCallback((items, threshold = 0.2) => {
    if (items.length === 0) return items;
    
    const deduplicated = [];
    const used = new Set();
    
    items.forEach(item => {
      if (used.has(item)) return;
      
      const fuse = new Fuse(items, {
        threshold: threshold,
        minMatchCharLength: 1
      });
      
      const similar = fuse.search(item).map(result => result.item);
      
      // Add the original item
      deduplicated.push(item);
      
      // Mark all similar items as used
      similar.forEach(similarItem => used.add(similarItem));
      used.add(item);
    });
    
    return deduplicated;
  }, []);

  // Derive unique locations and tags when data loads
  useEffect(() => {
    const rawLocs = Array.from(new Set(data.map((e) => e.Location)));
    const deduplicatedLocs = deduplicateSimilar(rawLocs, 0.15); // Very strict for locations
    setLocations(deduplicatedLocs);
    
    const tags = new Set();
    data.forEach((e) => {
      e.Tags?.split(",").forEach((t) => tags.add(t.trim()));
    });
    const rawTags = Array.from(tags).filter((t) => t);
    const deduplicatedTags = deduplicateSimilar(rawTags, 0.2); // Slightly more lenient for tags
    setAllTags(deduplicatedTags);
  }, [data, deduplicateSimilar]);

  // Apply filters function
  const applyFilters = useCallback(() => {
    setAppliedKeyFilter(keyFilter);
    setAppliedLocationFilter(locationFilter);
    setAppliedTagsFilter(tagsFilter);
    setAppliedFilterSlot(filterSlot);
  }, [keyFilter, locationFilter, tagsFilter, filterSlot]);

  // Filtered events (using applied filters) - memoized for performance
  const filteredData = useMemo(() => {
    console.log("filteredData recalculated at", new Date().toISOString(), "data length:", data.length);
    
    // Step 1: Apply hard filters first (location, tags, time) - these remove events completely
    let hardFilteredEvents = data.filter((e) => {
      // Apply location hard filter
      if (appliedLocationFilter.length > 0) {
        const selectedLocation = appliedLocationFilter[0];
        const locationFuse = new Fuse([e.Location], {
          threshold: 0.3, // Stricter threshold for locations
          minMatchCharLength: 1
        });
        const locationMatch = locationFuse.search(selectedLocation).length > 0 || e.Location === selectedLocation;
        if (!locationMatch) return false;
      }
      
      // Apply date range hard filter
      if (appliedFilterSlot.start) {
        if (new Date(e.Date) < appliedFilterSlot.start) return false;
      }
      if (appliedFilterSlot.end) {
        if (new Date(e.Date) > appliedFilterSlot.end) return false;
      }
      
      // Apply tags hard filter
      if (appliedTagsFilter.length > 0) {
        const eventTags = (e.Tags || "").split(",").map((t) => t.trim());
        const anyMode = appliedTagsFilter.includes("__ANY__");
        const selectedTags = appliedTagsFilter.filter((tag) => tag !== "__ANY__");
        
        if (selectedTags.length > 0) {
          // Use fuzzy matching for tags
          const tagFuse = new Fuse(eventTags, {
            threshold: 0.3, // Stricter threshold for tags
            minMatchCharLength: 1
          });
          
          if (anyMode) {
            // OR semantics: any of selectedTags should fuzzy match
            const hasMatch = selectedTags.some(selectedTag =>
              tagFuse.search(selectedTag).length > 0 || eventTags.includes(selectedTag)
            );
            if (!hasMatch) return false;
          } else {
            // AND semantics: all selectedTags should fuzzy match
            const allMatch = selectedTags.every(selectedTag =>
              tagFuse.search(selectedTag).length > 0 || eventTags.includes(selectedTag)
            );
            if (!allMatch) return false;
          }
        }
      }
      return true;
    });
    
    // Step 2: Apply key filter for sorting/relevance (if specified)
    if (appliedKeyFilter) {
      // Add searchable date strings to each event for time-based searches
      const dataWithSearchableDates = hardFilteredEvents.map(event => ({
        ...event,
        searchableDate: formatDate(event.Date), // Full formatted date for searching
        searchableMonth: event.Date.toLocaleDateString("en-us", { month: "long" }), // "August"
        searchableMonthShort: event.Date.toLocaleDateString("en-us", { month: "short" }), // "Aug"
        searchableDay: event.Date.toLocaleDateString("en-us", { weekday: "long" }), // "Monday"
        searchableYear: event.Date.getFullYear().toString(), // "2024"
        searchableMonthDay: event.Date.toLocaleDateString("en-us", { month: "long", day: "numeric" }), // "August 23"
        searchableMonthDayShort: event.Date.toLocaleDateString("en-us", { month: "short", day: "numeric" }) // "Aug 23"
      }));

      const fuse = new Fuse(dataWithSearchableDates, {
        keys: [
          { name: 'Title', weight: 0.5 },               // Event name (50% - highest priority)
          { name: 'Description', weight: 0.25 },        // Event description (25% - second priority)
          { name: 'Location', weight: 0.1 },            // Event location (10% - third priority)
          { name: 'Tags', weight: 0.1 },                // Event tags (10% - fourth priority)
          { name: 'searchableDate', weight: 0.015 },    // Full date string (5% total for all date fields)
          { name: 'searchableMonthDay', weight: 0.015 }, // "August 23"
          { name: 'searchableMonthDayShort', weight: 0.01 }, // "Aug 23"
          { name: 'searchableMonth', weight: 0.005 },   // "August"
          { name: 'searchableMonthShort', weight: 0.003 }, // "Aug"
          { name: 'searchableDay', weight: 0.001 },     // "Monday"
          { name: 'searchableYear', weight: 0.001 }     // "2024"
        ],
        threshold: 0.6, // More lenient threshold for sorting (0.4 was too restrictive)
        includeScore: true,
        minMatchCharLength: 1
      });
      const results = fuse.search(appliedKeyFilter);
      return results.map(result => result.item);
    }
    
    // Step 3: If no key filter, return hard-filtered events as-is
    return hardFilteredEvents;
  }, [data, appliedKeyFilter, appliedLocationFilter, appliedFilterSlot, appliedTagsFilter]);

  // Update TextField display when filter slot changes
  useEffect(() => {
    if (filterSlot.start && filterSlot.end) {
      const startStr = filterSlot.start.toLocaleDateString() + ' ' + filterSlot.start.toLocaleTimeString();
      const endStr = filterSlot.end.toLocaleDateString() + ' ' + filterSlot.end.toLocaleTimeString();
      setDateFilterState(prev => ({ ...prev, value: `${startStr} - ${endStr}` }));
    } else {
      setDateFilterState(prev => ({ ...prev, value: "" }));
    }
  }, [filterSlot]);

  // Notify parent component when filtered data changes
  useEffect(() => {
    onFilteredDataChange(filteredData);
  }, [filteredData, onFilteredDataChange]);

  return (
    <View style={styles.filters}>
      <TextInput
        style={styles.input}
        placeholder="Enter keywords..."
        value={keyFilter}
        onChangeText={setKeyFilter}
      />
      {/* Location filter via single-select MultiSelect */}
      <MultiSelect
        items={locations.map((loc) => ({ id: loc, name: loc }))}
        uniqueKey="id"
        single={true}
        onSelectedItemsChange={(selectedItems) => {
          if (locationFilter.length > 0 && selectedItems[0] === locationFilter[0]) {
            setLocationFilter([]);
          } else {
            setLocationFilter(selectedItems);
          }
        }}
        selectedItems={locationFilter}
        selectText="Select Location"
        searchInputPlaceholderText="  Search Locations..."
        hideSubmitButton={true}
        styleMainWrapper={styles.multiSelectWrapper}
        styleListContainer={styles.multiSelectList}
        styleTextDropdown={styles.multiSelectText}
        styleTextDropdownSelected={styles.multiSelectText}
        styleDropdownMenuSubsection={styles.multiSelectDropdown}
        fixedHeight={false}
      />
      {/* Date range filter */
      <Pressable style={styles.dateFilterBox} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateFilterText}>
          {dateFilterState.value || "Filter by date & time"}
        </Text>
      </Pressable>
      }
      {showDatePicker && (
        <TimeSlot 
          slot={filterSlot} 
          onChange={(newSlot) => {
            setFilterSlot(newSlot);
            setShowDatePicker(false);
          }}
          selectRange={true}
          autoOpen={true}
        />
      )}
      {/* Tag filter via multi-select, includes special option for any-match mode */}
      <MultiSelect
        items={[{ id: '__ANY__', name: '*Match any' },
               ...allTags.map((tag) => ({ id: tag, name: tag }))]}
        uniqueKey="id"
        onSelectedItemsChange={setTagsFilter}
        selectedItems={tagsFilter}
        selectText="Select Tags"
        searchInputPlaceholderText="  Search Tags..."
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        hideSubmitButton={true}
        styleMainWrapper={styles.multiSelectWrapper}
        styleListContainer={styles.multiSelectList}
        styleTextDropdown={styles.multiSelectText}
        styleTextDropdownSelected={styles.multiSelectText}
        styleDropdownMenuSubsection={styles.multiSelectDropdown}
        fixedHeight={false}
      />
      {/* Apply Filters Button */}
      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 0,
    height: 40,
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#666',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  // react-native-multiple-select styles
  multiSelectWrapper: {
    marginBottom: 10,
  },
  multiSelectList: {
    maxHeight: 120,
    marginBottom: 0,
  },
  multiSelectText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    paddingLeft: 5,
    lineHeight: 20,
  },
  multiSelectDropdown: {
    height: 40,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateFilterBox: {
    height: 40,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  dateFilterText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
  },
  applyButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'black',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 40,
    marginTop: 5,
    marginBottom: 20,
  },
  applyButtonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});