"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useForm, Controller } from "react-hook-form";

type GeoapifySuggestion = {
  properties: {
    place_id: string;
    formatted: string;
  };
};

type GeoapifyResponse = {
  features: GeoapifySuggestion[];
};

const ShippingForm = () => {
  const { control, handleSubmit, setValue: setFormValue } = useForm();
  const [suggestions, setSuggestions] = useState<GeoapifySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = async (value: string) => {
    setInputValue(value);
    setOpen(true);
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    console.log(value);
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${apiKey}`
        );
        const data: GeoapifyResponse = await response.json();
        console.log("Data received from Geoapify:", data);
        setSuggestions(data.features ?? []);
      } catch (error) {
        console.error("Error fetching data from Geoapify:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (inputValue.length > 2) {
      handleInputChange(inputValue);
    }
  }, [inputValue]);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label>Provincia, ciudad y dirección</label>
        <Controller
          name="fullAddress"
          control={control}
          render={({ field }) => (
            <div>
              <Popover open={open} onOpenChange={setOpen}>
                <Input
                  {...field}
                  onChange={(e) => {
                    handleInputChange(e.target.value);
                    // const value = e.target.value;
                    // setInputValue(value);
                    // setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => {
                    // Delay closing the popover to allow click events to be processed
                    setTimeout(() => setOpen(false), 200);
                  }}
                />
                <PopoverContent>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.properties.place_id}
                      onClick={() => {
                        setInputValue(suggestion.properties.formatted);
                        setFormValue(
                          "fullAddress",
                          suggestion.properties.formatted
                        );
                        setSuggestions([]);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {suggestion.properties.formatted}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
              <div>
                <label>Comentarios adicionales</label>
                <Textarea />
              </div>
            </div>
          )}
        />
      </div>
      <button
        type="submit"
        className="border rounded-lg text-body-bold bg-white py-3 w-32 hover:bg-black hover:text-white"
      >
        Enviar
      </button>
    </form>
  );
};

export default ShippingForm;
