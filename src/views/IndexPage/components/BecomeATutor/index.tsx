import ScrollReveal from "@components/ScrollReveal";
import Button from "@components/Button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BecomeATutor = () => {
  return (
    <section>
      <ScrollReveal>
        <motion.div
          className="rounded-[20px] py-[60px] px-[48px] flex flex-col lg:flex-row items-center justify-between gap-[32px]"
          style={{
            background: "linear-gradient(135deg, #F6EDFF 0%, #E9F2FC 50%, #D3E4F8 100%)",
          }}
          whileHover={{
            boxShadow: "0 12px 48px rgba(3, 0, 105, 0.1)",
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-[16px] max-w-[560px]">
            <h2 className="font-bold text-headline-large text-neutral-11">
              Share Your Knowledge, Earn on Your Terms
            </h2>
            <p className="text-body-large text-neutral-8 leading-relaxed">
              Join our growing community of expert tutors. Create courses, reach
              thousands of students worldwide, set your own schedule, and earn
              competitive income doing what you love.
            </p>
          </div>

          <div className="flex gap-[16px] flex-shrink-0">
            <Link to="/auth/signup?role=tutor">
              <Button text="Become a Tutor" width="200px" />
            </Link>
            <Link to="/how-it-works">
              <Button text="How It Works" outline width="160px" />
            </Link>
          </div>
        </motion.div>
      </ScrollReveal>
    </section>
  );
};

export default BecomeATutor;
