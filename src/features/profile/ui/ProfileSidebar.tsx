import Link from 'next/link';

type ProfileTab = 'result' | 'scraps';

type ProfileSidebarProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onWithdrawClick: () => void;
};

const NAV_ITEMS: { tab: ProfileTab; label: string }[] = [
  { tab: 'result', label: '내 검사 결과' },
  { tab: 'scraps', label: '스크랩한 공고' },
];

export function ProfileSidebar({
  activeTab,
  onTabChange,
  onWithdrawClick,
}: ProfileSidebarProps) {
  return (
    <nav
      aria-label="프로필 메뉴"
      className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
    >
      <ul role="list">
        {NAV_ITEMS.map(({ tab, label }) => (
          <li key={tab}>
            <button
              type="button"
              onClick={() => onTabChange(tab)}
              aria-current={activeTab === tab ? 'page' : undefined}
              className={
                'transition-ui w-full cursor-pointer px-4 py-3 text-left text-[0.9375rem] ' +
                (activeTab === tab
                  ? 'border-l-[3px] border-primary bg-primary-bg font-semibold text-primary'
                  : 'border-l-[3px] border-transparent font-normal text-gray-700 hover:bg-gray-100')
              }
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-200" />

      <ul role="list">
        <li>
          <Link
            href="/survey?mode=edit"
            className="transition-ui block cursor-pointer border-l-[3px] border-transparent px-4 py-3 text-[0.9375rem] font-normal text-gray-700 hover:bg-gray-100"
          >
            검사 내용 수정
          </Link>
        </li>
      </ul>

      <div className="border-t border-gray-200" />

      <div className="px-4 py-3">
        <button
          type="button"
          onClick={onWithdrawClick}
          className="transition-ui cursor-pointer text-[0.8125rem] font-normal text-gray-400 hover:text-error"
        >
          회원 탈퇴
        </button>
      </div>
    </nav>
  );
}
