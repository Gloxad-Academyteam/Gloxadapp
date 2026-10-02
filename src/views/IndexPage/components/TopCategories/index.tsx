import { Link } from "react-router-dom";
import ScrollReveal from "@components/ScrollReveal";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getCategories, isImageIcon } from "@services/categories";

const categoryIcons: Record<string, string> = {
  "web-development": "💻",
  "data-science": "📊",
  "ui-ux-design": "🎨",
  "digital-marketing": "📱",
  "business": "💼",
  "photography": "📸",
  "music": "🎵",
  "health-fitness": "🏋️"
};

const getIconForCategory = (slug: string) => {
  return categoryIcons[slug.toLowerCase()] || "🎓";
};

const TopCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await getCategories()).data,
  });

  if (isLoading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <p className="text-title-medium text-neutral-8 animate-pulse">Loading categories...</p>
      </div>
    );
  }

  const items = categories || [];

  return (
    <section className="flex flex-col items-center gap-[40px] w-full">
      <ScrollReveal>
        <div className="text-center">
          <h2 className="font-bold text-headline-large text-neutral-11">
            Top Categories
          </h2>
          <p className="text-body-large text-neutral-7 mt-2">
            Explore our most popular course categories
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] w-full">
        {Array.isArray(items) && items.map((category: any, index: number) => (
          <ScrollReveal key={category._id || category.slug} delay={index * 0.08}>
            <Link to={`/courses?category=${category.slug}`}>
              <motion.div
                className="flex flex-col items-center gap-[12px] p-[24px] rounded-[12px] border border-neutral-4 bg-primary-1 cursor-pointer card-interactive"
                whileHover={{
                  scale: 1.05,
                  borderColor: "#030069",
                  boxShadow: "0 8px 30px rgba(3, 0, 105, 0.12)"
                }}
                transition={{ duration: 0.25 }}
              >
                {isImageIcon(category.icon) ? (
                  <img src={category.icon} alt="" className="w-[48px] h-[48px] object-cover rounded-[8px]" />
                ) : (
                  <span className="text-[40px]">{getIconForCategory(category.slug)}</span>
                )}
                <h3 className="font-medium text-title-medium text-neutral-11 text-center">
                  {category.name}
                </h3>
                <p className="text-body-small text-neutral-6">
                  {category.courseCount || 0} Courses
                </p>
              </motion.div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;
