export type Reel = {
  id: string;
  username: string;
  avatarUrl: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  productId?: string;
};

export const reels: Reel[] = [
  {
    id: "r1",
    username: "@maya.styles",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=890&fit=crop",
    caption: "These sneakers go with literally everything 🤍",
    likes: 2840,
    productId: "2",
  },
  {
    id: "r2",
    username: "@jordan.tech",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=890&fit=crop",
    caption: "Unboxing my new speaker — sound is unreal 🔊",
    likes: 1932,
    productId: "1",
  },
  {
    id: "r3",
    username: "@thefitlife",
    avatarUrl:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=890&fit=crop",
    caption: "Morning yoga flow with my new mat 🧘‍♀️",
    likes: 954,
    productId: "7",
  },
  {
    id: "r4",
    username: "@dailyglow",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=890&fit=crop",
    caption: "My skincare shelfie ✨ obsessed with this set",
    likes: 3210,
    productId: "5",
  },
  {
    id: "r5",
    username: "@urban.carry",
    avatarUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&h=890&fit=crop",
    caption: "This bag fits my whole life in it 👜",
    likes: 1567,
    productId: "8",
  },
  {
    id: "r6",
    username: "@wfh.desksetup",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=890&fit=crop",
    caption: "Desk glow-up with this lamp 💡",
    likes: 782,
    productId: "6",
  },
  {
    id: "r7",
    username: "@runwithme",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=890&fit=crop",
    caption: "Tracking every run with this watch ⌚️",
    likes: 2103,
    productId: "4",
  },
  {
    id: "r8",
    username: "@sunny.days",
    avatarUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=890&fit=crop",
    caption: "Sunglasses season is officially here 😎",
    likes: 1345,
    productId: "3",
  },
];
