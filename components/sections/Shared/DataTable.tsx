import { useId, useMemo, useState, type ReactNode } from "react"
import { cn } from "cn"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { compareText } from "../../../lib/presetSearch"

export type Column<T> = {
  id: string
  header: ReactNode
  /** value for sorting and, without `cell`, for display */
  value: (row: T) => string | number
  cell?: (row: T) => ReactNode
  sortable?: boolean
  /** grid track, e.g. "minmax(0,1fr)" (default) or "8rem" */
  width?: string
  /** hidden on small screens */
  wide?: boolean
}

export type Sorting = { id: string; desc: boolean }

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  rowId: (row: T) => string
  initialSorting?: Sorting
  /** details shown below a row after clicking it */
  renderExpanded?: (row: T) => ReactNode
  onRowClick?: (row: T) => void
  emptyText?: string
  /** "Rows per page" options; the first one is the default */
  pageSizes: readonly number[]
  /** localStorage key that remembers the chosen page size */
  pageSizeStorageKey?: string
  /** left side of the pagination bar, e.g. an action button */
  footer?: ReactNode
  className?: string
}

const compareValues = (a: string | number, b: string | number) =>
  typeof a === "number" && typeof b === "number"
    ? a - b
    : // text ignoring case ("Alternator" before "AP master")
      compareText(String(a), String(b))

const storedPageSize = (key: string | undefined, sizes: readonly number[]) => {
  const stored = key ? Number(localStorage.getItem(key)) : NaN
  return sizes.includes(stored) ? stored : sizes[0]
}

/**
 * List of presets as a grid with table semantics (ARIA roles), sortable
 * columns, expandable rows and pagination. Details are regular content, not
 * table cells.
 */
const DataTable = <T,>({
  columns,
  data,
  rowId,
  initialSorting,
  renderExpanded,
  onRowClick,
  emptyText = "There are no records to display",
  pageSizes,
  pageSizeStorageKey,
  footer,
  className,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState(initialSorting)
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())
  const [pageSize, setPageSize] = useState(() =>
    storedPageSize(pageSizeStorageKey, pageSizes),
  )
  const [pageIndex, setPageIndex] = useState(0)
  const pageSizeLabel = useId()

  // new data (search, filters) starts on the first page
  const [shownData, setShownData] = useState(data)
  if (data !== shownData) {
    setShownData(data)
    setPageIndex(0)
  }

  const rows = useMemo(() => {
    const column = columns.find((c) => c.id === sorting?.id)
    if (!column || !sorting) return data
    const sign = sorting.desc ? -1 : 1
    return [...data].sort(
      (a, b) => sign * compareValues(column.value(a), column.value(b)),
    )
  }, [data, columns, sorting])

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const page = Math.min(pageIndex, pageCount - 1)
  const first = page * pageSize
  const pageRows = rows.slice(first, first + pageSize)

  const toggleSorting = (id: string) =>
    setSorting((current) =>
      current?.id === id ? { id, desc: !current.desc } : { id, desc: false },
    )
  const toggleExpanded = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  const changePageSize = (size: number) => {
    setPageSize(size)
    setPageIndex(0)
    if (pageSizeStorageKey)
      localStorage.setItem(pageSizeStorageKey, String(size))
  }

  // grid tracks for small screens (without wide columns) and from md up
  const chevron = renderExpanded ? ["2rem"] : []
  const track = (c: Column<T>) => c.width ?? "minmax(0,1fr)"
  const gridStyle = {
    "--cols-sm": [
      ...chevron,
      ...columns.filter((c) => !c.wide).map(track),
    ].join(" "),
    "--cols-md": [...chevron, ...columns.map(track)].join(" "),
  } as React.CSSProperties
  const grid =
    "grid grid-cols-(--cols-sm) md:grid-cols-(--cols-md) items-center"
  const wideClass = (c: Column<T>) => (c.wide ? "hidden md:block" : "")
  const clickable = !!renderExpanded || !!onRowClick

  return (
    <div className={cn("w-full text-sm", className)}>
      <div role="table" style={gridStyle}>
        <div role="row" className={cn(grid, "border-b font-bold")}>
          {renderExpanded && <div role="columnheader" aria-label="Details" />}
          {columns.map((column) => {
            const sorted = sorting?.id === column.id ? sorting : undefined
            return (
              <div
                key={column.id}
                role="columnheader"
                aria-sort={
                  sorted
                    ? sorted.desc
                      ? "descending"
                      : "ascending"
                    : undefined
                }
                className={cn("truncate px-2 py-2", wideClass(column))}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className="flex w-full items-center gap-1 text-left"
                    onClick={() => toggleSorting(column.id)}
                  >
                    <span className="truncate">{column.header}</span>
                    {sorted &&
                      (sorted.desc ? (
                        <IconArrowDown className="size-4 shrink-0" />
                      ) : (
                        <IconArrowUp className="size-4 shrink-0" />
                      ))}
                  </button>
                ) : (
                  column.header
                )}
              </div>
            )
          })}
        </div>
        {rows.length === 0 ? (
          <div role="row">
            <div role="cell" className="py-6 text-center">
              <p role="status">{emptyText}</p>
            </div>
          </div>
        ) : (
          pageRows.map((row) => {
            const id = rowId(row)
            const isExpanded = expanded.has(id)
            const activate = () =>
              renderExpanded ? toggleExpanded(id) : onRowClick?.(row)
            return (
              <div key={id} className="border-b">
                <div
                  role="row"
                  // expandable rows are reached by keyboard through their Details button
                  tabIndex={onRowClick && !renderExpanded ? 0 : undefined}
                  onClick={activate}
                  onKeyDown={(e) => {
                    if (renderExpanded || e.target !== e.currentTarget) return
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      activate()
                    }
                  }}
                  className={cn(
                    grid,
                    "min-h-10",
                    clickable &&
                      "cursor-pointer outline-none hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    isExpanded && "bg-primary text-primary-foreground",
                  )}
                >
                  {renderExpanded && (
                    <div role="cell" className="flex justify-center">
                      <button
                        type="button"
                        aria-label="Details"
                        aria-expanded={isExpanded}
                        className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        onClick={(e) => {
                          e.stopPropagation()
                          activate()
                        }}
                      >
                        <IconChevronRight
                          className={cn(
                            "size-4 transition-transform",
                            isExpanded && "rotate-90",
                          )}
                        />
                      </button>
                    </div>
                  )}
                  {columns.map((column) => (
                    <div
                      key={column.id}
                      role="cell"
                      className={cn("truncate px-2 py-2", wideClass(column))}
                    >
                      {column.cell ? column.cell(row) : column.value(row)}
                    </div>
                  ))}
                </div>
                {renderExpanded && isExpanded && (
                  <div role="row">
                    <div role="cell">{renderExpanded(row)}</div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3">
        <div>{footer}</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span id={pageSizeLabel}>Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => changePageSize(Number(v))}
            >
              <SelectTrigger
                size="sm"
                className="w-20"
                aria-labelledby={pageSizeLabel}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span>
            {rows.length === 0
              ? "0"
              : `${first + 1}–${Math.min(first + pageSize, rows.length)}`}{" "}
            of {rows.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="First Page"
              disabled={page === 0}
              onClick={() => setPageIndex(0)}
            >
              <IconChevronsLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Previous Page"
              disabled={page === 0}
              onClick={() => setPageIndex(page - 1)}
            >
              <IconChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Next Page"
              disabled={page >= pageCount - 1}
              onClick={() => setPageIndex(page + 1)}
            >
              <IconChevronRight />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Last Page"
              disabled={page >= pageCount - 1}
              onClick={() => setPageIndex(pageCount - 1)}
            >
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
