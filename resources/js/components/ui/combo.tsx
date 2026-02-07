import { useState, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ComboBox({
 router,
  value,
  onChange,
}: {
  value?: string;
  router?: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetch(`/admin/${router}?q=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then((data) => setOptions(data));
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const selectedUser = options.find((opt) => opt.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser ? selectedUser.name : 'Select user...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." value={search} onValueChange={setSearch} />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {options.map((user) => (
              <CommandItem
                key={user.id}
                value={user.name}
                onSelect={() => {
                  onChange(user.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === user.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {user.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
