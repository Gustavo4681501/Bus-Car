import React, { useContext, useState } from 'react';
import { SessionContext } from './SessionContext'; // Importar el contexto
import Signup from './Signup';
import Login from './Login';
import PrivateText from '../../PrivateText';

const User = () => {
  const { currUser, setCurrUser } = useContext(SessionContext); // Acceder al contexto
  const [show, setShow] = useState(true);
    console.log(currUser)
  if (currUser) {
    return (
      <div>
        Hello {currUser.sub ? currUser.sub : 'no session'}
        <PrivateText currUser={currUser} />
      </div>
    );
  }

  return (
    <div>
      {show ? (
        <Login setCurrUser={setCurrUser} setShow={setShow} />
      ) : (
        <Signup setCurrUser={setCurrUser} setShow={setShow} />
      )}
    </div>
  );
};

export default User;
