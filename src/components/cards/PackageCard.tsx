

import { MdFillDelete, MdFillEdit, MdFillArrow_forward } from 'solid-icons/md';
import { JSX } from 'solid-js';

interface PackageCardProps {
  name: string;
  children?: JSX.Element;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export default function PackageCard(props: PackageCardProps) {
  return (
    <div class="flex items-start justify-between bg-white px-6 py-5">
      {/* Left content */}
      <div class="flex flex-col gap-2">
        <p class="subheader-1 text-left">{props.name}</p>

        <div class="flex items-center gap-2 text-sm text-gray-500">
          {props.children}
        </div>

        <button
          onClick={props.onViewDetails}
          class="flex w-fit items-center gap-1 text-sm font-medium text-sky-500 hover:text-sky-600 transition-colors"
        >
          View More Details
          <MdFillArrow_forward/>
        </button>
      </div>

      {/* Right actions */}
      <div class="flex items-center gap-3 text-gray-400">
        {/* Edit */}
        <button
          onClick={props.onEdit}
          class="hover:text-[var(--color-c)] transition-colors"
          aria-label="Edit"
        >
          <MdFillEdit />
        </button>

        {/* Delete */}
        <button
          onClick={props.onDelete}
          class="hover:text-red-500 transition-colors"
          aria-label="Delete"
        >
          <MdFillDelete />
        </button>
      </div>
    </div>
  )
}