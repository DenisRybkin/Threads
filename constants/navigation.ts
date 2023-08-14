interface ISidebarLink {
  imgURL: string;
  route: string;
  label: string;
}
export const sidebarLinks: ISidebarLink[] = [
  {
    imgURL: '/assets/home.svg',
    route: '/',
    label: 'Home',
  },
  {
    imgURL: '/assets/search.svg',
    route: '/search',
    label: 'Search',
  },
  {
    imgURL: '/assets/heart.svg',
    route: '/activity',
    label: 'Activity',
  },
  {
    imgURL: '/assets/create.svg',
    route: '/create-thread',
    label: 'Create Thread',
  },
  {
    imgURL: '/assets/community.svg',
    route: '/communities',
    label: 'Communities',
  },
  {
    imgURL: '/assets/user.svg',
    route: '/profile',
    label: 'Profile',
  },
];

export enum ProfileTabKeys {
  treads = 'threads',
  replies = 'replies',
  tagged = 'tagged',
}

export enum CommunityTabKeys {
  threads = 'threads',
  members = 'members',
  requests = 'requests',
}

interface ITab<VK> {
  value: VK;
  label: string;
  icon: string;
}

export const profileTabs: ITab<ProfileTabKeys>[] = [
  { value: ProfileTabKeys.treads, label: 'Threads', icon: '/assets/reply.svg' },
  {
    value: ProfileTabKeys.replies,
    label: 'Replies',
    icon: '/assets/members.svg',
  },
  { value: ProfileTabKeys.tagged, label: 'Tagged', icon: '/assets/tag.svg' },
];

export const communityTabs: ITab<CommunityTabKeys>[] = [
  {
    value: CommunityTabKeys.threads,
    label: 'Threads',
    icon: '/assets/reply.svg',
  },
  {
    value: CommunityTabKeys.members,
    label: 'Members',
    icon: '/assets/members.svg',
  },
  {
    value: CommunityTabKeys.requests,
    label: 'Requests',
    icon: '/assets/request.svg',
  },
];
