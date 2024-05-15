import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Link,
  Button,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

interface stateItem {
  state: string;
  fixed: number;
  unfixed: number;
  pct_fixed: number;
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [dt, setDt] = React.useState("");

  const list = useAsyncList({
    async load({ signal }) {
      const res = await fetch("https://api.npoint.io/3165600d983575c04c5f", {
        signal,
      });
      const json = await res.json();
      setIsLoading(false);
      const event = new Date(json.dt);
      setDt(event.toLocaleString("en-US"));

      return {
        items: json.data,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: unknown, b: unknown) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <div className="justify-center p-4">
        <h2 className="text-3xl font-bold text-center">
          Statistics for All the Places MR challenge
        </h2>
        <p className="text-center">as of {dt} EST</p>
        <div className="flex p-4">
          <Button
            color="primary"
            as={Link}
            className="content-center mx-auto"
            showAnchorIcon
            target="_blank"
            href="https://maproulette.org/browse/challenges/43561"
          >
            MapRoulette project
          </Button>
          <Button
            color="default"
            as={Link}
            className="content-center mx-auto"
            showAnchorIcon
            target="_blank"
            href="https://github.com/whubsch/atp-count"
          >
            GitHub
          </Button>
        </div>
      </div>
      <Table
        isCompact
        aria-label="Table with ATP statistics by state"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        className="pb-8"
      >
        <TableHeader>
          <TableColumn key="state" allowsSorting>
            State
          </TableColumn>
          <TableColumn key="fixed" allowsSorting>
            Fixed
          </TableColumn>
          <TableColumn key="unfixed" allowsSorting>
            Unfixed
          </TableColumn>
          <TableColumn key="pct_fixed" allowsSorting>
            Percentage
          </TableColumn>
        </TableHeader>
        <TableBody
          items={list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item: stateItem) => (
            <TableRow key={item.state}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
