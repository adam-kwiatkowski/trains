import {TripData} from "../types.ts";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Selection, SortDescriptor} from "@nextui-org/react";
import React from "react";
import {columns, trips} from "../data";

const INITIAL_VISIBLE_COLUMNS = ["From", "To", "Date", "Departure", "Arrival", "Duration", "Base price", "Discount", "Price"];

export default function DataTable() {
  const [selectedTrip, setSelectedTrip] = React.useState<TripData | null>(null);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({column: "Id", direction: "ascending"});
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let items = [...trips];
    if (selectedTrip) {
      items = items.filter(trip => trip.From === selectedTrip.To && trip.Date >= selectedTrip.Date && trip.Departure >= selectedTrip.Arrival);
      items = [selectedTrip, ...items]
    }
    return items;
  }, [selectedTrip]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof TripData];
      const second = b[sortDescriptor.column as keyof TripData];

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  const handleSelectionChange = (selection: Selection) => {
    if (selection === "all") return;
    if (selection.size === 0) {
      setSelectedTrip(null);
      setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS));
      return;
    }
    if (selection.size === 1) {
      const index = selection.values().next().value as number;
      setSelectedTrip(sortedItems[index]);
      setVisibleColumns(new Set([...INITIAL_VISIBLE_COLUMNS, "Total"]));
    }
  }

  const renderCell = React.useCallback((trip: TripData, column: React.Key) => {
    const cellValue = trip[column as keyof TripData];
    switch (column) {
      case "Base price":
      case "Discount":
      case "Price":
        return `${cellValue} zł`;
      case "Total":
        if (selectedTrip && trip !== selectedTrip) {
          return `${selectedTrip.Price + trip.Price} zł`;
        }
        return "";
      default:
        return cellValue;
    }
  }, [selectedTrip]);

  return (<Table
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      selectionMode="single"
      onSelectionChange={handleSelectionChange}
  >
    <TableHeader columns={headerColumns}>
      {(column) => (
          <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
      )}
    </TableHeader>
    <TableBody emptyContent={"No users found"} items={sortedItems}>
      {(item) => (
          <TableRow key={item.Id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
      )}
    </TableBody>
  </Table>);
}