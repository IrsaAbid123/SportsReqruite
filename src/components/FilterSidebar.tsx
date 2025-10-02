import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
import { ageRangeOptions, experienceLevelOptions, positionOptions } from "@/constants/UserDataEnums";
import { UserRoleEnum } from "@/constants/UserRoleEnums";

export interface FilterOptions {
  userType: "all" | "player" | "coach" | "admin";
  status: "all" | "available" | "filled";
  age: string[];
  distance: number;
  zipOrCityState: string;
  experience: string[];
  position: string[]
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  onApplyFilters?: () => void;
  isFiltered?: boolean;
}

// predefined distance steps
const distanceMarks = [5, 25, 50, 70, 100];

export const FilterSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters,
  onApplyFilters,
  isFiltered = false,
}: FilterSidebarProps) => {
  // ✅ fallback arrays to avoid includes on undefined
  const safeFilters: FilterOptions = {
    ...filters,
    age: filters.age ?? [],
    experience: filters.experience ?? [],
    position: filters.position ?? [],
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...safeFilters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (
    key: "age" | "experience" | "position",
    value: string
  ) => {
    const currentArray = safeFilters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const hasActiveFilters =
    safeFilters.userType !== "all" ||
    safeFilters.status !== "all" ||
    safeFilters.age.length > 0 ||
    safeFilters.distance !== 0 ||
    safeFilters.experience.length > 0 ||
    safeFilters.position.length > 0 ||
    safeFilters.zipOrCityState !== "";

  return (
    <Card className="w-full max-w-sm shadow-card border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-black hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">User Type</Label>
          <div className="flex flex-wrap gap-2">
            {["all", UserRoleEnum.PLAYER, UserRoleEnum.COACH].map((type) => (
              <Badge
                key={type}
                variant={safeFilters.userType === type ? "default" : "outline"}
                className={`cursor-pointer transition-all ${safeFilters.userType === type
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
                  }`}
                onClick={() => updateFilter("userType", type)}
              >
                {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Listing Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Listing Type</Label>
          <div className="flex flex-wrap gap-2">
            {["all", "available", "filled"].map((status) => (
              <Badge
                key={status}
                variant={safeFilters.status === status ? "default" : "outline"}
                className={`cursor-pointer transition-all ${safeFilters.status === status
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
                  }`}
                onClick={() => updateFilter("status", status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Age */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Age</Label>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {ageRangeOptions.map((age) => (
              <Badge
                key={age}
                variant={safeFilters.age.includes(age) ? "default" : "outline"}
                className={`cursor-pointer text-xs transition-all ${safeFilters.age.includes(age)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
                  }`}
                onClick={() => toggleArrayFilter("age", age)}
              >
                {age}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Zip/City & State */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Zip / City & State</Label>
          <Input
            placeholder="Enter zip or city, state"
            value={safeFilters.zipOrCityState}
            onChange={(e) => updateFilter("zipOrCityState", e.target.value)}
          />
        </div>

        {/* Distance */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Distance: 0 - {safeFilters.distance} miles
          </Label>
          <Slider
            value={[safeFilters.distance]}
            onValueChange={(value) => updateFilter("distance", value[0])}
            min={0}
            max={100}
            step={1} // must be a number, no marks in shadcn slider
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {distanceMarks.map((mark) => (
              <span key={mark}>{mark}mi</span>
            ))}
          </div>
        </div>

        <Separator />

        {/* Experience */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Experience</Label>
          <div className="flex flex-wrap gap-1">
            {experienceLevelOptions.map((level) => (
              <Badge
                key={level}
                variant={
                  safeFilters.experience.includes(level) ? "default" : "outline"
                }
                className={`cursor-pointer text-xs transition-all ${safeFilters.experience.includes(level)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
                  }`}
                onClick={() => toggleArrayFilter("experience", level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Position */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Position</Label>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {positionOptions.map((position) => (
              <Badge
                key={position}
                variant={
                  safeFilters.position.includes(position) ? "default" : "outline"
                }
                className={`cursor-pointer text-xs transition-all ${safeFilters.position.includes(position)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
                  }`}
                onClick={() => toggleArrayFilter("position", position)}
              >
                {position}
              </Badge>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        {onApplyFilters && (
          <div className="p-4 border-t">
            <Button
              onClick={onApplyFilters}
              className={`w-full transition-opacity ${isFiltered
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gradient-redwhiteblued hover:opacity-90"
                }`}
              disabled={!hasActiveFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              {isFiltered ? "Filters Applied" : "Apply Filters"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
