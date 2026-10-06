// Free-to-use photos from Unsplash (https://unsplash.com/license). Photographers are credited next to each URL.
const unsplash = (id: string, width: number, quality = 75) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

export const institutionImages = {
  // Shawn Rain: university building surrounded by trees
  campus: unsplash("photo-1741061966372-8e7e2c221de7", 900),
  // Joel Durkee: glass building with trees in front of it
  glassBuilding: unsplash("photo-1683402634038-7b24cd969fff", 900),
  // Helena Lopes: people working together in a cafe coworking space
  cafe: unsplash("photo-1519155031214-e8d583928bf2", 900),
  // Vitaly Gariev: students gathered around a laptop
  students: unsplash("photo-1758270705290-62b6294dd044", 900),
  // Portraits used by the demo dashboard
  adminAvatar: unsplash("photo-1519085360753-af0119f7cbe7", 160),
  avatarWoman: unsplash("photo-1494790108377-be9c29b29330", 120),
  avatarMan: unsplash("photo-1560250097-0b93528c311a", 120),
  avatarWoman2: unsplash("photo-1581065178047-8ee15951ede6", 120),
  avatarMan2: unsplash("photo-1500648767791-00dcc994a43e", 120),
};

// Landing page. Local files in /public/images/institution were supplied with the design; the rest are Unsplash.
export const landingImages = {
  // Declan Sun: minimalist white gallery hallway in bright natural light
  hero: unsplash("photo-1762928289094-197055a5d5c3", 1000, 78),
  heroBackdrop: "/images/institution/hero-backdrop.webp",
  institutionDashboard: "/images/institution/dashboard-institution.webp",
  studentDashboard: "/images/institution/dashboard-student.png",
  programDataScience: "/images/institution/program-data-science.png",
  programFullStack: "/images/institution/program-full-stack.png",
  programLeadership: "/images/institution/program-leadership.png",
  evolveControlRoom: "/images/institution/evolve-control-room.png",
  evolveTablet: "/images/institution/evolve-tablet.png",
  evolveWorldMap: "/images/institution/evolve-world-map.png",
  // cader_: glowing blue light streaks on a dark background (behind the growth arrow)
  evolveGrowth: unsplash("photo-1773053525998-8cb667020fa7", 700, 75),
  // Vitaly Gariev: older gentleman with grey hair in formal attire
  leaderMan: unsplash("photo-1738566061874-2160e9f4a064", 160, 75),
  leaderWoman: unsplash("photo-1581065178047-8ee15951ede6", 160, 75),
};
