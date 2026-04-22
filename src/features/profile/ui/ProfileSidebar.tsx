import { PROFILE_TAB_ITEMS, type ProfileTab } from '../utils/profileTabs';

type ProfileSidebarProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
};

export function ProfileSidebar({
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  return (
    <nav
      aria-label="프로필 메뉴"
      className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
    >
      <ul role="list">
        {PROFILE_TAB_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onTabChange(id)}
              aria-current={activeTab === id ? 'page' : undefined}
              className={
                'transition-ui w-full cursor-pointer px-4 py-3 text-left text-[0.9375rem] ' +
                (activeTab === id
                  ? 'border-l-[3px] border-primary bg-primary-bg font-semibold text-primary'
                  : 'border-l-[3px] border-transparent font-normal text-gray-700 hover:bg-gray-100')
              }
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
