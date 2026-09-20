import ScrollReveal from "@components/ScrollReveal";
import { motion } from "framer-motion";
import { FaGraduationCap, FaClock, FaCertificate, FaWallet } from "react-icons/fa6";

const features = [
  {
    icon: FaGraduationCap,
    title: "Expert Tutors",
    description:
      "Learn from industry professionals and experienced educators who are passionate about teaching.",
    color: "#030069",
    bgColor: "#F6EDFF",
  },
  {
    icon: FaClock,
    title: "Flexible Schedule",
    description:
      "Study at your own pace, anytime, anywhere. Our courses fit around your lifestyle.",
    color: "#3E92CC",
    bgColor: "#E9F2FC",
  },
  {
    icon: FaCertificate,
    title: "Certified Courses",
    description:
      "Earn recognized certificates upon completion to boost your career and credibility.",
    color: "#6A49B6",
    bgColor: "#ECDCFF",
  },
  {
    icon: FaWallet,
    title: "Affordable Pricing",
    description:
      "Quality education shouldn't break the bank. Access premium content at student-friendly prices.",
    color: "#1D7DB6",
    bgColor: "#D3E4F8",
  },
];

const WhyChooseGloxad = () => {
  return (
    <section className="flex flex-col items-center gap-[48px]">
      <ScrollReveal>
        <div className="text-center px-4 md:px-0">
          <h2 className="font-bold text-headline-medium md:text-headline-large text-neutral-11">
            Why Choose Gloxad Academy?
          </h2>
          <p className="text-body-medium md:text-body-large text-neutral-7 mt-2 max-w-[600px] mx-auto">
            We're committed to providing the best learning experience for every student
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] w-full">
        {features.map((feature, index) => (
          <ScrollReveal key={feature.title} delay={index * 0.1}>
            <motion.div
              className="flex flex-col items-center text-center gap-[16px] p-[32px] rounded-[16px] border border-neutral-4 bg-primary-1 card-interactive"
              whileHover={{
                y: -8,
                boxShadow: "0 12px 40px rgba(3, 0, 105, 0.1)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: feature.bgColor,
                }}
              >
                <feature.icon
                  style={{ color: feature.color, fontSize: 28 }}
                />
              </div>
              <h3 className="font-bold text-title-large text-neutral-11">
                {feature.title}
              </h3>
              <p className="text-body-medium text-neutral-7 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseGloxad;
