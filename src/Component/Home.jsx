import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {debounce}from 'lodash'

const Home = () => {
    const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const handleOnSearch = (string, results) => {
    debouncedFetchSuggestions(string);
  };
  useEffect(() => {
    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      fetchSuggestions(value);
    }
  }, [value]);


  const fetchSuggestions = async (value) => {
    try {
      const response = await axios.get(
        `https://trackapi.nutritionix.com/v2/search/instant/?query=${value}`,
        {
          headers: {
            "x-app-id": "0d7c04b7",
            "x-app-key": "c643c4d194390f87b154278db24af26b",
            "Content-Type": "application/json",
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);
  console.log(suggestions);

  return (
    <>
      <h1>Nutrition-Tracker</h1>

      <ReactSearchAutocomplete
        onSearch={handleOnSearch}
        items={
          suggestions.branded.length > 0
            ? suggestions.branded.map((element) => ({
                id: element.nix_item_id,
                name: element.brand_name_item_name,
              }))
            : []
        }
        placeholder="Type to search"
      />
      <button>Search</button>
      </>
)}

export default Home