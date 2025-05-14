import ReviewCard from './ReviewCard';

// Sample review data
const reviews = [
  {
    id: 1,
    name: "Emma Thompson",
    location: "London, UK",
    rating: 5,
    comment: "Absolutely stunning hotel with impeccable service. The room was spacious and beautifully decorated. The staff went above and beyond to make our stay special.",
    date: "May 15, 2023",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "James Wilson",
    location: "New York, USA",
    rating: 5,
    comment: "The attention to detail at Macchiato Suites is remarkable. From the welcome amenities to the turndown service, everything was perfect. Will definitely return!",
    date: "June 3, 2023",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Sophia Chen",
    location: "Singapore",
    rating: 4,
    comment: "Excellent location and beautiful rooms. The breakfast was outstanding with plenty of options. Only wish the pool was a bit larger.",
    date: "April 22, 2023",
    image: "https://randomuser.me/api/portraits/women/66.jpg"
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    location: "Barcelona, Spain",
    rating: 5,
    comment: "One of the best hotel experiences I've ever had. The bed was incredibly comfortable and the room had amazing views of the city.",
    date: "July 10, 2023",
    image: "https://randomuser.me/api/portraits/men/75.jpg"
  },
  {
    id: 5,
    name: "Olivia Parker",
    location: "Sydney, Australia",
    rating: 5,
    comment: "The spa treatments were divine and the staff was incredibly attentive. The room exceeded our expectations and the restaurant was phenomenal.",
    date: "March 18, 2023",
    image: "https://randomuser.me/api/portraits/women/90.jpg"
  },
  {
    id: 6,
    name: "David Kim",
    location: "Toronto, Canada",
    rating: 4,
    comment: "Beautiful property with excellent amenities. The staff was friendly and helpful. The only downside was some noise from the street.",
    date: "August 5, 2023",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: 7,
    name: "Isabella Martinez",
    location: "Mexico City, Mexico",
    rating: 5,
    comment: "Truly a luxury experience from start to finish. The room was immaculate, and the hotel restaurant served some of the best food we had during our trip.",
    date: "February 12, 2023",
    image: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    id: 8,
    name: "Alexander Johnson",
    location: "Chicago, USA",
    rating: 5,
    comment: "Exceptional service and beautiful accommodations. The concierge helped us plan the perfect itinerary for our anniversary weekend.",
    date: "September 30, 2023",
    image: "https://randomuser.me/api/portraits/men/54.jpg"
  }
];

const InfiniteScrollReviews = () => {

  return (
    <div className="relative overflow-hidden w-full py-4">
      <div className="flex overflow-x-hidden w-full">
        <div className="flex animate-scroll">
          {/* First set of reviews */}
          {reviews.map((review) => (
            <ReviewCard
              key={`${review.id}-first`}
              name={review.name}
              location={review.location}
              rating={review.rating}
              comment={review.comment}
              date={review.date}
              image={review.image}
            />
          ))}

          {/* Duplicate set of reviews for seamless looping */}
          {reviews.map((review) => (
            <ReviewCard
              key={`${review.id}-second`}
              name={review.name}
              location={review.location}
              rating={review.rating}
              comment={review.comment}
              date={review.date}
              image={review.image}
            />
          ))}
        </div>
      </div>

      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#F9F5F2] to-transparent pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#F9F5F2] to-transparent pointer-events-none"></div>
    </div>
  );
};

export default InfiniteScrollReviews;
