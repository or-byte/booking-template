import { For, JSX, Show } from "solid-js";
import Button from "../button/Button";

// <T> makes this column definition work with any data shape.
// accessor accepts either a key of T for simple values, or a function
// for custom JSX rendering (e.g. badges, buttons, formatted values).
export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => JSX.Element);
  renderHeader?: () => JSX.Element; // replaces the header label with custom JSX (e.g. sort button, filter dropdown)
};

// Pagination signals are () => number instead of plain numbers
// so the UI stays reactive when the parent updates the page state.
type PaginationProps = {
  page: () => number;
  totalPages: () => number;
  onNext: () => void;
  onPrev: () => void;
};

// T is inferred from data, so accessor keys are type-safe.
type Props<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T) => string | number; // helps SolidJS track row identity during re-renders
  pagination?: PaginationProps; // omit this prop entirely to hide pagination
};

export default function Table<T>(props: Props<T>) {

  // Resolves what to render in a cell — calls the function if accessor is
  // a render function, otherwise reads the property directly from the row.
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
                    {/* use renderHeader if defined, otherwise fall back to plain header text */}
                    {col.renderHeader ? col.renderHeader() : col.header}
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            {/* fallback renders "No data" when the data array is empty */}
            <For each={props.data} fallback={<tr><td class="text-center">No data</td></tr>}>
              {(row) => (
                <tr
                  class="border-t border-[var(--color-border-1)] transition-all duration-300 ease-in-out"
                  style={{ animation: "fadeIn 0.3s ease" }}
                >
                  <For each={props.columns}>
                    {(col) => (
                      <td class="py-3 px-6 max-w-[200px] truncate">
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

      {/* Shows when pagination prop is provided, so omitting it hides this section entirely */}
      <Show when={props.pagination}>
        {(pagination) => (
          <div class="flex items-center justify-between px-6 pt-4 border-t border-[var(--color-border-1)] mt-4">
            <p class="body-2 text-gray-500">
              Page {pagination().page()} of {pagination().totalPages()}
            </p>
             
            {/* disabled when on first/last page to prevent going out of bounds */}
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