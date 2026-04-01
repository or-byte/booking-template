

import { MdFillDelete, MdFillEdit, MdFillArrow_forward } from 'solid-icons/md';
import { JSX } from 'solid-js';

interface PackageCardProps {
  name: string;
  children?: JSX.Element;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function PackageCard(props: PackageCardProps) {
  return (
    <div class="flex items-start justify-between px-6 py-5 hover:cursor-pointer" onClick={props.onClick}>
      {/* Left content */}
      <div class="flex flex-col gap-2">
        <p class="subheader-1 text-left">{props.name}</p>

        <div class="flex items-center gap-2 text-sm text-gray-500">
          {props.children}
        </div>
      </div>

      {/* Right actions */}
      <div class="flex items-center gap-3 text-gray-400">
        {/* Edit */}
        <button
          onClick={props.onEdit}
          class="hover:text-[var(--color-accent-1)] transition-colors"
          aria-label="Edit"
        >
          <MdFillEdit size={20}/>
        </button>

        {/* Delete */}
        <button
          onClick={props.onDelete}
          class="hover:text-red-500 transition-colors"
          aria-label="Delete"
        >
          <MdFillDelete size={20}/>
        </button>
      </div>
    </div>
  )
}