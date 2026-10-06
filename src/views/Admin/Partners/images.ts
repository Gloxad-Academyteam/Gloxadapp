import { institutionImages } from "@pages/Institution/images";

const unsplash = (id: string, width: number, quality = 72) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

// Free-to-use photos from Unsplash (https://unsplash.com/license), credited next to each URL
export const partnerImages = {
  // penzesliza: glass-walled corridor with people walking through
  submissions: unsplash("photo-1604705264674-1c560f9d9d58", 800),
  // Jonathan Borba: architectural blueprints and a laptop on a marble desk
  finance: unsplash("photo-1781888688940-5730c3fd5baf", 800),
  // sidney zou: colleagues collaborating around a meeting-room table
  staff: unsplash("photo-1764690690771-b4522d66b433", 800),
  // Public-domain Robinson-projection world map (Wikimedia Commons, BlankMap-World.svg)
  worldMap: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/BlankMap-World.svg/1280px-BlankMap-World.svg.png",
  reviewer: institutionImages.adminAvatar,
};
