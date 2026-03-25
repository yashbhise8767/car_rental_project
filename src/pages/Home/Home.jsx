import React from 'react';
import HeroBanner from './HeroBanner';
import PopularCars from './PopularCars';
import OurServices from './OurServices';
import PeopleChoice from './PeopleChoice';


const Home = () => {
    return (
        <div>
            <HeroBanner />
            <PopularCars />
            <OurServices />
            {/* <PeopleChoice /> */}
        </div>
    );
}

export default Home;