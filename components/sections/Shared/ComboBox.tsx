import { useState } from "react"
import { cn } from "cn"
import { IconCheck, IconChevronDown, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ComboBoxProps = {
  id?: string
  options: string[]
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  searchPlaceholder?: string
  /** offers "Create …" for a search text that isn't an option */
  allowCreate?: boolean
  invalid?: boolean
  className?: string
}

// substring matching instead of cmdk's fuzzy filter, as in MobiFlight Connector
const filterBySubstring = (value: string, search: string) =>
  value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0

/** Searchable select (Popover + Command), like MobiFlight Connector's ComboBox */
const ComboBox = ({
  id,
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder = "Search…",
  allowCreate = false,
  invalid = false,
  className,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const text = search.trim()
  const canCreate =
    allowCreate &&
    text !== "" &&
    !options.some((option) => option.toLowerCase() === text.toLowerCase())

  const choose = (option: string) => {
    onValueChange(option)
    setSearch("")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <IconChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-56 p-0"
        align="start"
      >
        <Command filter={filterBySubstring}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => choose(option)}
                >
                  <span className="truncate">{option}</span>
                  <IconCheck
                    className={cn(
                      "ml-auto",
                      option === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
              {canCreate && (
                <CommandItem
                  value={`create:${text}`}
                  onSelect={() => choose(text)}
                  forceMount
                >
                  <IconPlus />
                  Create &quot;{text}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboBox
