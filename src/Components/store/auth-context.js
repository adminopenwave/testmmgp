import React, { useState } from 'react';

const AuthContext = React.createContext({
  menuVisibility: "",
  menuStatusHeader: "",
});

export const AuthContextProvider = (props) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [menuStatusHeader, setMenuStatusHeader] = useState(false);

  const openMenu = () => {
    setMenuVisibility('active')
  };

  const closeMenu = () => {
    setMenuVisibility('')
  };

  const MenuStatusOpen = () =>{
    setMenuStatusHeader('active')
  }

  const MenuStatusClose = () =>{
    setMenuStatusHeader('')
  }

  return (
    <AuthContext.Provider
      value={{
        // isLoggedIn: isLoggedIn,
        openMenu: openMenu,
        closeMenu: closeMenu,
        MenuStatusOpen: MenuStatusOpen,
        MenuStatusClose: MenuStatusClose,
        menuVisibility: menuVisibility,
        menuStatusHeader: menuStatusHeader,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
