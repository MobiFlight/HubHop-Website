import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { cn } from "cn"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronRight,
} from "@tabler/icons-react"
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
  /** renders only the rows in view (long lists); the list scrolls with the page */
  virtualize?: boolean
  className?: string
}

const compareValues = (a: string | number, b: string | number) =>
  typeof a === "number" && typeof b === "number"
    ? a - b
    : // text ignoring case ("Alternator" before "AP master")
      compareText(String(a), String(b))

/**
 * List of presets as a grid with table semantics (ARIA roles), sortable
 * columns and expandable rows. Details are regular content, not table cells.
 */
const DataTable = <T,>({
  columns,
  data,
  rowId,
  initialSorting,
  renderExpanded,
  onRowClick,
  emptyText = "There are no records to display",
  virtualize = false,
  className,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState(initialSorting)
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())

  const rows = useMemo(() => {
    const column = columns.find((c) => c.id === sorting?.id)
    if (!column || !sorting) return data
    const sign = sorting.desc ? -1 : 1
    return [...data].sort(
      (a, b) => sign * compareValues(column.value(a), column.value(b)),
    )
  }, [data, columns, sorting])

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

  // the window scrolls; the virtualizer needs the list's distance from the page top
  // (TanStack Virtual's instance is mutable: with the React Compiler this component needs "use no memo")
  const listRef = useRef<HTMLDivElement>(null)
  const [scrollMargin, setScrollMargin] = useState(0)
  useEffect(() => {
    const top = listRef.current?.getBoundingClientRect().top ?? 0
    setScrollMargin(top + window.scrollY)
  }, [])
  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 41,
    overscan: 10,
    scrollMargin,
    enabled: virtualize,
  })
  const items = virtualize
    ? virtualizer.getVirtualItems()
    : rows.map((_, index) => ({ index, start: 0, end: 0 }))
  const paddingTop =
    virtualize && items.length ? items[0].start - scrollMargin : 0
  const paddingBottom =
    virtualize && items.length
      ? virtualizer.getTotalSize() -
        (items[items.length - 1].end - scrollMargin)
      : 0
  const clickable = !!renderExpanded || !!onRowClick

  return (
    <div
      role="table"
      ref={listRef}
      style={gridStyle}
      className={cn("w-full text-sm", className)}
    >
      <div role="row" className={cn(grid, "border-b font-bold")}>
        {renderExpanded && <div role="columnheader" aria-label="Details" />}
        {columns.map((column) => {
          const sorted = sorting?.id === column.id ? sorting : undefined
          return (
            <div
              key={column.id}
              role="columnheader"
              aria-sort={
                sorted ? (sorted.desc ? "descending" : "ascending") : undefined
              }
              className={cn("truncate px-2 py-2", wideClass(column))}
            >
              {column.sortable ? (
                <button
                  type="button"
                  className="flex max-w-full items-center gap-1"
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
        <>
          {paddingTop > 0 && <div aria-hidden style={{ height: paddingTop }} />}
          {items.map(({ index }) => {
            const row = rows[index]
            const id = rowId(row)
            const isExpanded = expanded.has(id)
            const activate = () =>
              renderExpanded ? toggleExpanded(id) : onRowClick?.(row)
            return (
              // row and details are measured together
              <div
                key={id}
                data-index={index}
                ref={virtualize ? virtualizer.measureElement : undefined}
                className="border-b"
              >
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
          })}
          {paddingBottom > 0 && (
            <div aria-hidden style={{ height: paddingBottom }} />
          )}
        </>
      )}
    </div>
  )
}

export default DataTable
