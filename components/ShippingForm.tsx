"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useForm, Controller } from "react-hook-form";
import useDebounce from "@/lib/hooks/useDebounce";
import { SheetClose } from "./ui/sheet";

type GeoapifySuggestion = {
  properties: {
    place_id: string;
    formatted: string;
  };
};

interface ShippingFormProps {
  setShippingData: Dispatch<SetStateAction<shippingAddressType | null>>;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ setShippingData }) => {
  const { control, handleSubmit, setValue: setFormValue } = useForm();
  const [suggestions, setSuggestions] = useState<GeoapifySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 750);
  const skipNextInputChange = useRef(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (skipNextInputChange.current) {
      skipNextInputChange.current = false;
      return;
    }

    const value = e.target.value;
    setInputValue(value);
    setOpen(value.length > 2);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInputValue.length > 2) {
        try {
          const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${debouncedInputValue}&apiKey=${apiKey}`
          );
          const data = await res.json();
          setSuggestions(data.features ?? []);
          setOpen(data.features.length > 0);
        } catch (error) {
          console.error("Error fetching data from Geoapify:", error);
          setSuggestions([]);
          setOpen(false);
        }
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    };

    fetchSuggestions();
  }, [debouncedInputValue]);

  const onSubmit = (data: any) => {
    setShippingData(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 relative">
        <label>Provincia, ciudad y dirección</label>
        <Controller
          name="fullAddress"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Input
                {...field}
                onChange={handleInputChange}
                value={inputValue}
              />
              {open && (
                <div className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg">
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                      <div
                        key={suggestion.properties.place_id}
                        onClick={() => {
                          skipNextInputChange.current = true;
                          setInputValue(suggestion.properties.formatted);
                          setFormValue(
                            "fullAddress",
                            suggestion.properties.formatted
                          );
                          setSuggestions([]);
                          setOpen(false);
                        }}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        {suggestion.properties.formatted}
                      </div>
                    ))
                  ) : (
                    <div className="p-2">No suggestions found</div>
                  )}
                </div>
              )}
              <div>
                <label>Comentarios adicionales</label>
                <Textarea
                  onChange={(e) => {
                    setFormValue("additionalComments", e.target.value);
                  }}
                />
              </div>
            </div>
          )}
        />
      </div>
      <SheetClose asChild>
        <button
          type="submit"
          className="border rounded-lg text-body-bold bg-white py-3 w-32 hover:bg-black hover:text-white"
        >
          Enviar
        </button>
      </SheetClose>
    </form>
  );
};

export default ShippingForm;
