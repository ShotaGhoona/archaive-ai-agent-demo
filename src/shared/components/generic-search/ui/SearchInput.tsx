import { Input } from '@/shared';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  return (
    <div className='relative'>
      <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='h-10 w-96 pl-12 text-base'
      />
    </div>
  );
}
