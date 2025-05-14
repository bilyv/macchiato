import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}

const ReviewCard = ({ name, location, rating, comment, date, image }: ReviewCardProps) => {
  return (
    <div className="min-w-[350px] max-w-[350px] bg-white p-6 rounded-lg shadow-md mx-4 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
          <img 
            src={image || `https://ui-avatars.com/api/?name=${name}&background=EEDFD0&color=C45D3A`} 
            alt={name} 
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-[#8A5A44]">{name}</h4>
          <p className="text-sm text-neutral-500">{location}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-[#C45D3A] fill-[#C45D3A]' : 'text-neutral-300'}`} 
          />
        ))}
      </div>
      
      <p className="text-neutral-600 mb-4 flex-grow">"{comment}"</p>
      
      <p className="text-sm text-neutral-400 mt-auto">{date}</p>
    </div>
  );
};

export default ReviewCard;
