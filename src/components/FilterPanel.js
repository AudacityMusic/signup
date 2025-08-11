/**
 * FilterPanel.js
 * Component for filtering and searching events
 * - Simple name search with fuzzy matching on event titles
 * - Location, tags, and date range hard filters
 * - Tag filter uses AND semantics (all selected tags must match)
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import Fuse from "fuse.js";
import TimeSlot from "./TimeSlot";

export default function FilterPanel({ data, onFilteredDataChange }) {
  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [filterSlot, setFilterSlot] = useState({ start: null, end: null });

  // Applied filter states (used for actual filtering)
  const [appliedNameFilter, setAppliedNameFilter] = useState("");
  const [appliedLocationFilter, setAppliedLocationFilter] = useState([]);
  const [appliedTagsFilter, setAppliedTagsFilter] = useState([]);
  const [appliedFilterSlot, setAppliedFilterSlot] = useState({
    start: null,
    end: null,
  });

  // Options for filters derived from data
  const [locations, setLocations] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // Deduplicate very similar items using fuzzy matching
  const deduplicateSimilar = useCallback((items, threshold = 0.2) => {
    if (items.length === 0) return items;

    const deduplicated = [];
    const used = new Set();

    items.forEach((item) => {
      if (used.has(item)) return;

      const fuse = new Fuse(items, {
        threshold: threshold,
        minMatchCharLength: 1,
      });

      const similar = fuse.search(item).map((result) => result.item);

      // Add the original item
      deduplicated.push(item);

      // Mark all similar items as used
      similar.forEach((similarItem) => used.add(similarItem));
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
    setAppliedNameFilter(nameFilter);
    setAppliedLocationFilter(locationFilter);
    setAppliedTagsFilter(tagsFilter);
    setAppliedFilterSlot(filterSlot);
  }, [nameFilter, locationFilter, tagsFilter, filterSlot]);

  // Filtered events (using applied filters) - memoized for performance
  const filteredData = useMemo(() => {
    // Step 1: Apply hard filters first (location, tags, time) - these remove events completely
    let hardFilteredEvents = data.filter((e) => {
      // Apply location hard filter
      if (appliedLocationFilter.length > 0) {
        const selectedLocation = appliedLocationFilter[0];
        const locationFuse = new Fuse([e.Location], {
          threshold: 0.3, // Stricter threshold for locations
          minMatchCharLength: 1,
        });
        const locationMatch =
          locationFuse.search(selectedLocation).length > 0 ||
          e.Location === selectedLocation;
        if (!locationMatch) return false;
      }

      // Apply date range hard filter
      if (appliedFilterSlot.start) {
        if (new Date(e.Date) < appliedFilterSlot.start) return false;
      }
      if (appliedFilterSlot.end) {
        if (new Date(e.Date) > appliedFilterSlot.end) return false;
      }

      // Apply tags hard filter (AND semantics only)
      if (appliedTagsFilter.length > 0) {
        const eventTags = (e.Tags || "").split(",").map((t) => t.trim());
        
        // Use fuzzy matching for tags - all selected tags must match
        const tagFuse = new Fuse(eventTags, {
          threshold: 0.3, // Stricter threshold for tags
          minMatchCharLength: 1,
        });

        const allMatch = appliedTagsFilter.every(
          (selectedTag) =>
            tagFuse.search(selectedTag).length > 0 ||
            eventTags.includes(selectedTag),
        );
        if (!allMatch) return false;
      }
      return true;
    });

    // Step 2: Apply name filter for simple fuzzy matching on event titles (if specified)
    if (appliedNameFilter) {
      const fuse = new Fuse(hardFilteredEvents, {
        keys: ["Title"],
        threshold: 0.3, // Moderate threshold for name matching
        minMatchCharLength: 1,
      });
      const results = fuse.search(appliedNameFilter);
      return results.map((result) => result.item);
    }

    // Step 3: If no name filter, return hard-filtered events as-is
    return hardFilteredEvents;
  }, [
    data,
    appliedNameFilter,
    appliedLocationFilter,
    appliedFilterSlot,
    appliedTagsFilter,
  ]);


  // Notify parent component when filtered data changes
  useEffect(() => {
    onFilteredDataChange(filteredData);
  }, [filteredData, onFilteredDataChange]);

  return (
    <View style={styles.filters}>
      <TextInput
        style={styles.input}
        placeholder="Search by event name..."
        value={nameFilter}
        onChangeText={setNameFilter}
      />
      {/* Location filter via single-select Dropdown */}
      <Dropdown
        data={locations.map((loc) => ({ label: loc, value: loc }))}
        labelField="label"
        valueField="value"
        placeholder="Select Location"
        searchPlaceholder="Search Locations..."
        value={locationFilter[0] || null}
        onChange={(item) => {
          if (locationFilter.length > 0 && item.value === locationFilter[0]) {
            setLocationFilter([]);
          } else {
            setLocationFilter([item.value]);
          }
        }}
        search={true}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        selectedTextStyle={styles.dropdownSelectedText}
        placeholderStyle={styles.dropdownPlaceholder}
        itemTextStyle={styles.dropdownItemText}
        renderRightIcon={() => null}
        showsVerticalScrollIndicator={false}
      />
      {/* Date range filter */}
      <TimeSlot
        slot={filterSlot}
        onChange={(newSlot) => {
          setFilterSlot(newSlot);
        }}
        selectRange={!(filterSlot.start && filterSlot.end)}
        autoOpen={false}
        startPickerMode="datetime"
        endPickerMode="datetime"
        startTitle="Select Earliest Date & Time"
        endTitle="Select Latest Date & Time"
        style={styles.dateFilterBox}
        textStyle={styles.dateFilterText}
        placeholder="Filter by date & time"
        showClearButton={true}
      />
      {/* Tag filter via multi-select */}
      <MultiSelect
        data={allTags.map((tag) => ({ label: tag, value: tag }))}
        labelField="label"
        valueField="value"
        placeholder="Select Tags"
        searchPlaceholder="Search Tags..."
        value={tagsFilter}
        onChange={setTagsFilter}
        search={true}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        selectedTextStyle={styles.dropdownSelectedText}
        placeholderStyle={styles.dropdownPlaceholder}
        itemTextStyle={styles.dropdownItemText}
        selectedStyle={styles.selectedItem}
        renderRightIcon={() => null}
        showsVerticalScrollIndicator={false}
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
    color: "#666",
    backgroundColor: "white",
    marginBottom: 10,
  },
  // react-native-element-dropdown styles
  dropdown: {
    height: 40,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  dropdownContainer: {
    maxHeight: 200,
  },
  dropdownSelectedText: {
    fontSize: 16,
    color: "#666",
    textAlign: "left",
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: "#666",
    textAlign: "left",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000",
  },
  selectedItem: {
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    marginRight: 5,
    marginBottom: 5,
  },
  dateFilterBox: {
    height: 40,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  dateFilterText: {
    fontSize: 15,
    color: "#666",
    textAlign: "left",
  },
  applyButton: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ccc",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 40,
    marginTop: 5,
    marginBottom: 20,
  },
  applyButtonText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});
