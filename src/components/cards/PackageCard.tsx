

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

  const onEditEvent = (e) => {
    e.stopPropagation();
    props.onEdit?.();
  };

  const onDeleteEvent = (e) => {
    e.stopPropagation();
    props.onDelete?.();
  };

  return (
    <div class="flex items-start justify-between px-6 py-5 hover:cursor-pointer hover:bg-[var(--color-accent-2)]/10" onClick={props.onClick}>
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
          onClick={onEditEvent}
          class="hover:text-[var(--color-accent-1)] hover:cursor-pointer transition-colors"
          aria-label="Edit"
        >
          <MdFillEdit size={20} />
        </button>

        {/* Delete */}
        <button
          onClick={onDeleteEvent}
          class="hover:text-red-500 hover:cursor-pointer transition-colors"
          aria-label="Delete"
        >
          <MdFillDelete size={20} />
        </button>
      </div>
    </div>
  )
}