import React, { useState, useEffect } from 'react';

// ... existing code ...

//useEffect to sort and filter
useEffect(() => {
  let result = [...users];

  // Filter by status
  if (selectedStatus !== "All") {
    result = result.filter(user => 
      selectedStatus === "Active" ? user.isActive : !user.isActive
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  }

  // Sort users
  result.sort((a, b) => {
    switch (sortBy) {
      case "latest":
        // Assuming users have a createdAt field, otherwise you might want to sort by ID
        return b.id - a.id;
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  setFilteredUsers(result);
}, [users, selectedStatus, searchQuery, sortBy]);

// ... existing code ...