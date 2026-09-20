import ScrollReveal from "@components/ScrollReveal";
import LogoGoogle from "@assets/images/Google_2015_logo.svg 1.png";
import LogoMeta from "@assets/images/Meta_Platforms_Inc._logo.svg 1.png";
import LogoOracle from "@assets/images/Oracle_logo.svg 1.png";
import LogoMoniepoint from "@assets/images/Moniepointlogo 1.png";
import LogoPaystack from "@assets/images/Paystack_Logo 1.png";
import LogoMicrosoft from "@assets/images/Microsoft_logo_(2012).svg 1.png";
import LogoAWS from "@assets/images/Amazon_Web_Services_Logo.svg 1.png";
import LogoEIT from "@assets/images/part_eit_T 1.png";
import LogoGitHub from "@assets/images/github_PNG23 1.png";
import LogoInterswitch from "@assets/images/Interswitch_logo.svg 1.png";
import LogoACCI from "@assets/images/acci-logo-lg 1.png";
import LogoFlutterwave from "@assets/images/Group 33598.png";

const partnerLogos = [
  LogoMicrosoft,
  LogoGoogle,
  LogoMeta,
  LogoOracle,
  LogoMoniepoint,
  LogoPaystack,
  LogoFlutterwave,
  LogoAWS,
  LogoEIT,
  LogoGitHub,
  LogoInterswitch,
  LogoACCI,
];

const TrustedPartners = () => {
  return (
    <ScrollReveal className="mx-auto flex w-full max-w-[1512px] flex-col items-center gap-6 px-5 py-8 md:py-10 lg:px-[80px] overflow-hidden">
      <h2 className="text-center text-[17px] font-bold text-[#202127] md:text-[20px]">
        Trusted Network of Industry Leaders
      </h2>

      {/* Same continuous marquee on every breakpoint — logos just shrink via responsive sizing below */}
      <div className="flex flex-col gap-5 pt-2 w-full">
        <div className="relative flex w-full overflow-hidden marquee-mask">
          <div className="animate-marquee-flow gap-12 lg:gap-16 items-center">
            {[...partnerLogos.slice(0, 6), ...partnerLogos.slice(0, 6), ...partnerLogos.slice(0, 6), ...partnerLogos.slice(0, 6)].map((logo, index) => (
              <div key={`r1-${index}`} className="flex shrink-0 items-center justify-center transition hover:scale-105 opacity-80 hover:opacity-100 px-6">
                <img src={logo.src} alt="Partner Logo" className="h-[24px] max-w-[110px] object-contain md:h-[32px] md:max-w-[140px] lg:h-[36px] lg:max-w-[160px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex w-full overflow-hidden marquee-mask">
          <div className="animate-marquee-flow-reverse gap-12 lg:gap-16 items-center">
            {[...partnerLogos.slice(6), ...partnerLogos.slice(6), ...partnerLogos.slice(6), ...partnerLogos.slice(6)].map((logo, index) => (
              <div key={`r2-${index}`} className="flex shrink-0 items-center justify-center transition hover:scale-105 opacity-80 hover:opacity-100 px-6">
                <img src={logo.src} alt="Partner Logo" className="h-[24px] max-w-[110px] object-contain md:h-[32px] md:max-w-[140px] lg:h-[36px] lg:max-w-[160px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default TrustedPartners;
