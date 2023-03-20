import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Akash Pathak',
      image:
        'https://media.licdn.com/dms/image/C5603AQGW9kd5t79dnQ/profile-displayphoto-shrink_800_800/0/1622991996020?e=1678924800&v=beta&t=8OxV353BNE-a3EAXm5B3EZnFIaTqAkbrfqn61NBOMFQ',
      places: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
