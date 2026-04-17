import { For, JSX, Show } from "solid-js";
import Button from "../button/Button";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => JSX.Element);
  renderHeader?: () => JSX.Element;
};

type PaginationProps = {
  page: () => number;
  totalPages: () => number;
  onNext: () => void;
  onPrev: () => void;
};

type Props<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T) => string | number;
  pagination?: PaginationProps;
};

export default function Table<T>(props: Props<T>) {
  const getValue = (row: T, accessor: Column<T>["accessor"]) => {
    if (typeof accessor === "function") return accessor(row);
    return row[accessor] as JSX.Element;
  };

  return (
    <div class="border border-[var(--color-border-1)] rounded-[10px] bg-white py-6 w-full">
      <p class="title mb-6 text-left px-6">{props.title}</p>
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left body-2">
          <thead>
            <tr class="bg-gray-100">
              <For each={props.columns}>
                {(col) => (
                  <th class="font-bold pr-6 whitespace-nowrap px-6 py-3">
                    {col.renderHeader ? col.renderHeader() : col.header}
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={props.data} fallback={<tr><td class="text-center">No data</td></tr>}>
              {(row) => (
                <tr
                  class="border-t border-[var(--color-border-1)] transition-all duration-300 ease-in-out"
                  style={{ animation: "fadeIn 0.3s ease" }}
                >
                  <For each={props.columns}>
                    {(col) => (
                      <td class="py-3 px-6 whitespace-nowrap">
                        {getValue(row, col.accessor)}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Show when={props.pagination}>
        {(pagination) => (
          <div class="flex items-center justify-between px-6 pt-4 border-t border-[var(--color-border-1)] mt-4">
            <p class="body-2 text-gray-500">
              Page {pagination().page()} of {pagination().totalPages()}
            </p>
            <div class="flex gap-2">
              <Button
                class="btn-outline"
                onClick={pagination().onPrev}
                disabled={pagination().page() === 1}
              >
                Previous
              </Button>
              <Button
                class="btn-outline"
                onClick={pagination().onNext}
                disabled={pagination().page() >= pagination().totalPages()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}