// import React, { useState, useEffect } from 'react';
// import CarCard from './CarCard'; 
// import axios from 'axios';
// import './Cars.css';
// import FilterCar from './FilterCar';

// const Cars = () => {
//   const [cars, setCars] = useState([]);

//   useEffect(() => {
//     axios.get("https://www.freetestapi.com/api/v1/cars")
//       .then((response) => {
//         const fetchedCars = response.data || [];
//         setCars(fetchedCars);
//       })
//       .catch((error) => {
//         console.error("Error fetching car data:", error);
//       });
//   }, []);

//   return (
//     <>
//       <FilterCar />
//     <div className="car-cards-container">
//       {cars.map((car, index) => (
//         <CarCard key={index} car={car} />
//       ))}
//       </div>
//       </>
//   );
// };

// export default Cars;
