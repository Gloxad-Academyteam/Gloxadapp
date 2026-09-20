import React from 'react';

const recommendations = [
  {
    image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/University_of_Pittsburgh_Seal.svg/1200px-University_of_Pittsburgh_Seal.svg.png",
    university: "University of Pittsburgh",
    title: "Disability Awareness and Support",
    type: "Course"
  },
  {
    image: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/University_of_Cape_Town_logo.svg/1200px-University_of_Cape_Town_logo.svg.png",
    university: "University of Cape Town",
    title: "Teaching Children with Visual Impairment: Creating Empowering Classrooms",
    type: "Course"
  },
  {
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/University_of_Glasgow_crest.svg/1200px-University_of_Glasgow_crest.svg.png",
    university: "University of Glasgow",
    title: "Diversity and Inclusion in Education",
    type: "Course"
  },
  {
    image: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/University_of_Colorado_Boulder_seal.svg/1200px-University_of_Colorado_Boulder_seal.svg.png",
    university: "University of Colorado Boulder",
    title: "Basics of Inclusive Design for Online Education",
    type: "Course"
  }
];

const CourseRecommendations = () => {
  return (
    <div className="w-full mt-16 max-w-[1100px]">
      <h2 className="text-[24px] font-bold text-[#202127] mb-6">Explore more from Education</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col border border-[#e2e8f0] rounded-[12px] bg-white overflow-hidden hover:-translate-y-1 hover:shadow-md transition cursor-pointer h-full"
          >
            <div className="h-[140px] w-full overflow-hidden p-2">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover rounded-[8px]" 
              />
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <img src={item.logo} alt={item.university} className="w-5 h-5 object-contain" />
                <span className="text-[12px] text-[#4e515c] font-medium">{item.university}</span>
              </div>
              
              <h3 className="text-[15px] font-bold text-[#202127] leading-[1.3] mb-4 line-clamp-3">
                {item.title}
              </h3>
              
              <div className="mt-auto">
                <span className="text-[12px] text-[#717480]">{item.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button className="border border-[#0a1b56] text-[#0a1b56] font-bold text-[14px] px-6 py-2 rounded-[4px] hover:bg-gray-50 transition">
          Show 8 more
        </button>
      </div>
    </div>
  );
};

export default CourseRecommendations;
