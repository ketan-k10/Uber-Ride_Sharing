// Single source of truth for ride types so every panel stays in sync.
export const VEHICLES = {
    car: {
        key: 'car',
        name: 'SmartCar',
        seats: 4,
        eta: '2 mins',
        desc: 'Comfortable, air-conditioned ride',
        img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398986/assets/29/fbb8b0-75b1-4e2c-8bf9-5a903d0aab35/original/UberSelect-White.png',
    },
    moto: {
        key: 'moto',
        name: 'SmartMoto',
        seats: 1,
        eta: '3 mins',
        desc: 'Quick & affordable motorcycle',
        img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
    },
    auto: {
        key: 'auto',
        name: 'SmartAuto',
        seats: 3,
        eta: '3 mins',
        desc: 'Budget-friendly auto rickshaw',
        img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
    },
}

export const VEHICLE_LIST = [ VEHICLES.car, VEHICLES.moto, VEHICLES.auto ]
