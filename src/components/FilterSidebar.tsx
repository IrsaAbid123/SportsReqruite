import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";

export interface FilterOptions {
  userType: 'all' | 'players' | 'teams';
  ageRange: [number, number];
  experience: string[];
  position: string[];
  location: string[];
  status: 'all' | 'available' | 'filled';
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const experienceLevels = [
  'Beginner', 'Amateur', 'Semi-Pro', 'Professional', 'College', 'High School'
];

const positions = [
  'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop',
  'Left Field', 'Center Field', 'Right Field', 'Quarterback', 'Running Back',
  'Wide Receiver', 'Tight End', 'Offensive Line', 'Defensive Line', 'Linebacker',
  'Cornerback', 'Safety', 'Point Guard', 'Shooting Guard', 'Small Forward',
  'Power Forward', 'Center'
];

const locations = [
  'New York', 'California', 'Texas', 'Florida', 'Illinois', 'Pennsylvania',
  'Ohio', 'Georgia', 'North Carolina', 'Michigan'
];

export const FilterSidebar = ({ filters, onFiltersChange, onClearFilters }: FilterSidebarProps) => {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: 'experience' | 'position' | 'location', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    updateFilter(key, newArray);
  };

  const hasActiveFilters =
    filters.userType !== 'all' ||
    filters.ageRange[0] !== 16 || filters.ageRange[1] !== 35 ||
    filters.experience.length > 0 ||
    filters.position.length > 0 ||
    filters.location.length > 0 ||
    filters.status !== 'all';

  return (
    <Card className="w-full max-w-sm shadow-card border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
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
            {['all', 'players', 'teams'].map((type) => (
              <Badge
                key={type}
                variant={filters.userType === type ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${filters.userType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
                  }`}
                onClick={() => updateFilter('userType', type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Age Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
          </Label>
          <Slider
            value={filters.ageRange}
            onValueChange={(value) => updateFilter('ageRange', value)}
            min={16}
            max={35}
            step={1}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Status */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Listing Status</Label>
          <div className="flex flex-wrap gap-2">
            {['all', 'available', 'filled'].map((status) => (
              <Badge
                key={status}
                variant={filters.status === status ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${filters.status === status
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
                  }`}
                onClick={() => updateFilter('status', status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Experience Level */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Experience Level</Label>
          <div className="flex flex-wrap gap-1">
            {experienceLevels.map((level) => (
              <Badge
                key={level}
                variant={filters.experience.includes(level) ? 'default' : 'outline'}
                className={`cursor-pointer text-xs transition-all ${filters.experience.includes(level)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
                  }`}
                onClick={() => toggleArrayFilter('experience', level)}
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
            {positions.map((position) => (
              <Badge
                key={position}
                variant={filters.position.includes(position) ? 'default' : 'outline'}
                className={`cursor-pointer text-xs transition-all ${filters.position.includes(position)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
                  }`}
                onClick={() => toggleArrayFilter('position', position)}
              >
                {position}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Location</Label>
          <div className="flex flex-wrap gap-1">
            {locations.map((location) => (
              <Badge
                key={location}
                variant={filters.location.includes(location) ? 'default' : 'outline'}
                className={`cursor-pointer text-xs transition-all ${filters.location.includes(location)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
                  }`}
                onClick={() => toggleArrayFilter('location', location)}
              >
                {location}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};