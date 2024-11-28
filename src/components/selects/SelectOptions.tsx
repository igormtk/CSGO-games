import React from "react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOptionsProps {
  title: string;
  placeholderSelect: string;
}

const SelectOptions = ({ title, placeholderSelect }: SelectOptionsProps) => {
  switch (title) {
    case "Bingo":
      return (
        <>
          <SelectTrigger id="region">
            <SelectValue placeholder={placeholderSelect} />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="next">International</SelectItem>
            <SelectItem value="sveltekit">South America</SelectItem>
            <SelectItem value="astro">North America</SelectItem>
            <SelectItem value="nuxt">Asia</SelectItem>
            <SelectItem value="nuxt">Europe</SelectItem>
          </SelectContent>
        </>
      );
    case "Guess the skin":
      return (
        <>
          <SelectTrigger id="level">
            <SelectValue placeholder={placeholderSelect} />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="next">Easy</SelectItem>
            <SelectItem value="sveltekit">Medium</SelectItem>
            <SelectItem value="astro">Hard</SelectItem>
            <SelectItem value="nuxt">Insane</SelectItem>
          </SelectContent>
        </>
      );
    default:
      return null;
  }
};

export default SelectOptions;
