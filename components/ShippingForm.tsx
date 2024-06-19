"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const ShippingForm = () => {
  const { control, handleSubmit, setValue } = useForm();
  const [suggestions, setSuggestions] = useState<GeoapifySuggestion[]>([]);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleInputChange = async (value: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    if (value.length > 2) {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${apiKey}`
      );
      const data: GeoapifyResponse = await response.json();
      setSuggestions(data.features);
    } else {
      setSuggestions([]);
    }
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
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e.target.value);
                }}
              />
              <div>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.properties.place_id}
                    onClick={() => {
                      setValue("fullAddress", suggestion.properties.formatted);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion.properties.formatted}
                  </div>
                ))}
              </div>
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
