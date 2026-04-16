import clsx from 'clsx';

type FilterOption = { value: string; label: string };

type FilterGroupProps = {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
};

function FilterGroup({ label, options, value, onChange }: FilterGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="shrink-0 text-[0.8125rem] font-semibold text-gray-500">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={clsx(
            'transition-ui h-8 rounded-md border px-3 text-[0.8125rem] font-semibold',
            value === option.value
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-primary-border hover:bg-primary-bg',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const FIT_OPTIONS: FilterOption[] = [
  { value: '전체', label: '전체' },
  { value: '잘 맞아요', label: '잘 맞아요' },
  { value: '도전해볼 수 있어요', label: '도전해볼 수 있어요' },
];

const WORK_TYPE_OPTIONS: FilterOption[] = [
  { value: '전체', label: '전체' },
  { value: '온라인', label: '온라인' },
  { value: '오프라인', label: '오프라인' },
];

const LOCATION_OPTIONS: FilterOption[] = [
  { value: '전체', label: '전체' },
  { value: '서울', label: '서울' },
  { value: '경기', label: '경기' },
];

type JobFilterBarProps = {
  fitFilter: string;
  workTypeFilter: string;
  locationFilter: string;
  onFitChange: (value: string) => void;
  onWorkTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
};

export function JobFilterBar({
  fitFilter,
  workTypeFilter,
  locationFilter,
  onFitChange,
  onWorkTypeChange,
  onLocationChange,
}: JobFilterBarProps) {
  return (
    <div
      role="group"
      aria-label="채용공고 필터"
      className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4"
    >
      <FilterGroup
        label="적합도"
        options={FIT_OPTIONS}
        value={fitFilter}
        onChange={onFitChange}
      />
      <FilterGroup
        label="근무 형태"
        options={WORK_TYPE_OPTIONS}
        value={workTypeFilter}
        onChange={onWorkTypeChange}
      />
      <FilterGroup
        label="지역"
        options={LOCATION_OPTIONS}
        value={locationFilter}
        onChange={onLocationChange}
      />
    </div>
  );
}
