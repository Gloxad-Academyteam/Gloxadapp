import React from 'react';

const testimonials = [
  {
    name: "Felipe M.",
    role: "Learner since 2018",
    avatar: "https://i.pravatar.cc/150?img=11",
    quote: "\"To be able to take courses at my own pace and rhythm has been an amazing experience. I can learn whenever it fits my schedule and mood.\""
  },
  {
    name: "Jennifer J.",
    role: "Learner since 2020",
    avatar: "https://i.pravatar.cc/150?img=5",
    quote: "\"I directly applied the concepts and skills I learned from my courses to an exciting new project at work.\""
  },
  {
    name: "Larry W.",
    role: "Learner since 2021",
    avatar: "https://i.pravatar.cc/150?img=8",
    quote: "\"When I need courses on topics that my university doesn't offer, Gloxad is one of the best places to go.\""
  },
  {
    name: "Chaitanya A.",
    role: "Learner since 2022",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote: "\"Learning isn't just about being better at your job: it's so much more than that. Gloxad allows me to learn without limits.\""
  }
];

const CourseTestimonials = () => {
  return (
    <div className="w-full mt-12 max-w-[1100px]">
      <h2 className="text-[24px] font-bold text-[#202127] mb-8 underline decoration-[#4aa3df] decoration-2 underline-offset-8">
        Why people choose Gloxad Academy for their career
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col border border-[#e2e8f0] rounded-[8px] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-200">
                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#202127]">{item.name}</h4>
                <p className="text-[12px] text-[#717480]">{item.role}</p>
              </div>
            </div>
            <p className="text-[13px] text-[#4e515c] leading-relaxed">
              {item.quote}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTestimonials;
