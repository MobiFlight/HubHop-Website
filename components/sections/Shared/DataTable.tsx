import { Fragment, useState, type ReactNode } from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table"
import { cn } from "cn"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronRight,
} from "@tabler/icons-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** classes of the header and cells, e.g. "hidden md:table-cell" */
    className?: string
  }
}

type DataTableProps<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  initialSorting?: SortingState
  /** content shown below a row after clicking it */
  renderExpanded?: (row: T) => ReactNode
  onRowClick?: (row: T) => void
  emptyText?: string
}

/** Preset lists: shadcn Table on TanStack Table, sortable columns, expandable rows */
const DataTable = <T,>({
  columns,
  data,
  initialSorting = [],
  renderExpanded,
  onRowClick,
  emptyText = "There are no records to display",
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: () => !!renderExpanded,
    // columns are sortable only where they say so
    defaultColumn: { enableSorting: false },
  })
  const columnCount = columns.length + (renderExpanded ? 1 : 0)
  const clickable = !!renderExpanded || !!onRowClick

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {renderExpanded && <TableHead className="w-8" />}
            {group.headers.map((header) => {
              const sorted = header.column.getIsSorted()
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    "font-bold",
                    header.column.columnDef.meta?.className,
                  )}
                  aria-sort={
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                        ? "descending"
                        : undefined
                  }
                >
                  {header.column.getCanSort() ? (
                    <button
                      type="button"
                      className="flex items-center gap-1"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {sorted === "asc" && <IconArrowUp className="size-4" />}
                      {sorted === "desc" && (
                        <IconArrowDown className="size-4" />
                      )}
                    </button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="py-6 text-center">
              {emptyText}
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow
                data-state={row.getIsExpanded() ? "selected" : undefined}
                className={cn(
                  clickable &&
                    "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  row.getIsExpanded() && "bg-primary text-primary-foreground",
                )}
                onClick={() =>
                  renderExpanded
                    ? row.toggleExpanded()
                    : onRowClick?.(row.original)
                }
              >
                {renderExpanded && (
                  <TableCell>
                    <IconChevronRight
                      className={cn(
                        "size-4 transition-transform",
                        row.getIsExpanded() && "rotate-90",
                      )}
                    />
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {renderExpanded && row.getIsExpanded() && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columnCount}
                    className="whitespace-normal"
                  >
                    {renderExpanded(row.original)}
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default DataTable
