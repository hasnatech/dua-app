import { JSX } from "react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type SelectFormProps = {
  label: string
  options: { id: number|string; name: string }[]
  value: any
  onValueChange: (data: any) => void
}

export function SelectForm({ label, options, value, onValueChange }: SelectFormProps): JSX.Element {
  return (
    <div>
      <Label className="mb-3 block font-medium">{label}</Label>
      <Select 
        value={value !== null ? String(value) : undefined}
        onValueChange={ onValueChange }
      >
        
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent >
          {options.map((opt) => (
            <SelectItem key={opt.id} value={String(opt.id)}>
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}