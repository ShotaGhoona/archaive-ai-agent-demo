import { CompanyInfoContent } from './CompanyInfoContent';

export function CompanyInfoSettingContainer() {
  return (
    <div className='h-page p-4'>
      <div className='h-full overflow-y-auto'>
        <CompanyInfoContent />
      </div>
    </div>
  );
}
