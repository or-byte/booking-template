type InputNumberStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export default function InputNumberStepper(props: InputNumberStepperProps) {
  const min = () => props.min ?? 0;

  const increment = () => {
    props.onChange(props.value + 1);
  };

  const decrement = () => {
    props.onChange(Math.max(min(), props.value - 1));
  }

  return (
    <div class="flex flex-col items-center">
      <span class="text-sm mb-2">{props.label}</span>

      <button class="border px-2 rounded" onClick={increment}>
        +
      </button>

      <input
        type="number"
        class="border w-16 text-center my-1"
        value={props.value}
        onInput={(e) => props.onChange(Number(e.currentTarget.value))}
      />

      <button class="border px-2 rounded" onClick={decrement}>
        -
      </button>
    </div>
  );
}