"use client";

import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getUserPreferences,
  saveUserPreferences,
  saveLocation,
} from "@/actions/user-preferences";
import { FormField } from "@/types/resources";
import Form from "./form/form";
import { Option } from "./multiple-selector";
import { getCityOptions, regionOptions } from "@/lib/countries";
import { Card, CardContent } from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface UserFilterProps {
  filters: React.RefObject<Filter[]>;
  onFilterChange?: () => void;
}

export type Filter = {
  name: string;
  value: string | number | string[] | number[] | Option[];
  type?: string;
};

export default function UserFilter({
  onFilterChange,
  filters,
}: UserFilterProps) {
  const { data } = useQuery({
    queryKey: ["getUserPreferences"],
    refetchOnWindowFocus: false,
    queryFn: getUserPreferences,
  });

  const [formData, setFormData] = useState<Record<string, Filter["value"]>>();
  const [fields, setFields] = useState<FormField[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [searchMore, setSearchMore] = useState(false);

  const updateFilter = React.useCallback(
    async (name: string, value: string | null | number[]) => {
      let newFilters = filters?.current.slice(0);
      if (
        (Array.isArray(value) && value.length === 0) ||
        (!Array.isArray(value) && (!value || value === "all"))
      ) {
        newFilters = newFilters.filter((filter) => filter.name !== name);
      } else {
        const exist = newFilters.find((filter) => filter.name === name);
        if (!exist) {
          newFilters.push({ name, value });
        } else {
          newFilters = newFilters.map((filter) => {
            if (filter.name === name) {
              filter.value = value;
            }
            return filter;
          });
        }
      }

      filters.current = newFilters;
      onFilterChange?.();
    },
    [filters, onFilterChange]
  );

  React.useEffect(() => {
    console.log(data);
    if (data && !initialized) {
      setFormData({
        age: [
          Number(data.defaultData["age-min"]) || 18,
          Number(data.defaultData["age-max"]) || 80,
        ],
        ...data.defaultData,
        hobby: (data.defaultData['hobby'] as any[])?.map(option => option.value) || [],
      });

      const filterFields = (filter: { name: string }) => {
        return !['age-min', 'age-max', 'hobby'].includes(filter.name);
      }
      
      const newFields = data.filterOptions.filter(filterFields).map((filter) => {
        console.log(filter.name);
        
        const options = filter.options;
        if (filter.type === "select") {
          options.unshift({ value: "all", label: "Všetky" });
        }
        return {
          label: filter.title,
          name: filter.name,
          type: filter.type,
          onChange: (value: string | Option[]) => {
            const val =
              typeof value === "string"
                ? value
                : value.map((v) => Number(v.value));

            updateFilter(filter.name, val);
            saveUserPreferences(filter.name, val);
          },
          options,
        } as FormField;
      });

      const hobbyOptions = data.filterOptions.find(o => o.name === 'hobby');
      const hobby: FormField = {
        label: "Hobby",
        name: "hobby",
        type: "checkbox-group",
        elementClassName: 'grid grid-cols-3',
        onChange: (value) => {
          console.log(value);
          const saveValue = value.map(v => Number(v));
          updateFilter('hobby', saveValue);
          saveUserPreferences('hobby', saveValue);
        },
        options: hobbyOptions?.options || [],
      };

      const age: FormField = {
        label: "Vek",
        name: "age",
        type: "range",
        min: 18,
        max: 80,
        onChange: (value: number[]) => {
          updateFilter("age-min", value[0].toString());
          updateFilter("age-max", value[1].toString());
          saveUserPreferences('age-min', value[0].toString());
          saveUserPreferences('age-max', value[1].toString());
        },
      };

      const country: FormField = {
        type: "cascader",
        name: "country-cascader",
        fields: [
          {
            type: "select",
            name: "country",
            label: "Krajina",
            populate: "region",
            onChange: (country) => {
              if (filters.current) {
                updateFilter("country", country);
                updateFilter("region", null);
                updateFilter("city", null);

                saveLocation({ country, region: null, city: null });
              }
              const allOption = { value: "all", label: "Všetky regióny" };

              return country === "SK" ? [allOption, ...regionOptions] : [];
            },
            options: [
              { label: "Všetky krajiny", value: "all" },
              { label: "Česko", value: "CZ" },
              { label: "Slovensko", value: "SK" },
              { label: "Zahraničie - Rakusko", value: "UTA" },
            ],
          },
          {
            type: "select",
            name: "region",
            populate: "city",
            label: "Region",
            options: [],
            onChange: (region) => {
              if (filters.current) {
                updateFilter("region", region);
                updateFilter("city", null);
                saveLocation({ region, city: null });
              }
              console.log(region);
              if (region === "all" || region === undefined) {
                return [];
              }
              const cityOptions = getCityOptions(region);
              const allOption = { value: "all", label: "Všetky mesta" };
              return [allOption, ...cityOptions];
            },
          },
          {
            type: "select",
            name: "city",
            label: "Mesto",
            onChange: (city) => {
              if (filters.current) {
                updateFilter("city", city);
                saveLocation({ city });
              }
            },
            options: [],
          },
        ] as FormField[],
      };
      setFields([age, country, hobby, ...newFields]);
      console.log('current', data.userPreferences);
      filters.current = data.userPreferences;

      onFilterChange?.();
      setInitialized(true);
    }
  }, [data, filters, initialized, onFilterChange, updateFilter]);

  if (!initialized) return <div>Loading...</div>;
  console.log(formData);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Základné informácie</h2>
          <div>
            <Form fields={fields} data={formData}>
              {({ fields }) => (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1">{fields["gender-search"]}</div>
                    <div className="flex-1">{fields["age"]}</div>
                  </div>
                  <div className="border border-gray-400 border-dashed p-4">
                    {fields["country-cascader"]}
                  </div>
                  <Collapsible>
                    <CollapsibleTrigger
                      onClick={() => setSearchMore(!searchMore)}
                      className="flex gap-3"
                    >
                      {searchMore ? <span className="font-bold">Skryť</span> : <span className="font-bold">Zobraziť viac</span>}
                      {searchMore ? <ChevronDown /> : <ChevronRight />}{" "}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-4 px-6 pt-2">
                      <div className="flex gap-4 mt-4">
                        <div className="flex-1">{fields["height"]}</div>
                        <div className="flex-1">{fields["figure"]}</div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">{fields["eye-color"]}</div>
                        <div className="flex-1">{fields["hair"]}</div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">{fields["education"]}</div>
                        <div className="flex-1">{fields["marital-status"]}</div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">{fields["drinking"]}</div>
                        <div className="flex-1">{fields["smoking"]}</div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">{fields["job"]}</div>
                        <div className="flex-1">{fields["religion"]}</div>
                      </div>
                      {fields['hobby']}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
