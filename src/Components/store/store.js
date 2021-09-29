import { createStore } from "redux";

const initialState = {
  counter: 0,
  showCounter: true,
  menuVisibility: "",
  headerTitle: ((localStorage.getItem('headerTitle') !== 'undefined') ? localStorage.getItem('headerTitle') : "" ),
  // menuStatusHeader: ((localStorage.getItem('menuStatusHeader') !== 'undefined') ? localStorage.getItem('menuStatusHeader') : "" ),
  menuStatusHeader: "",
  token: ((localStorage.getItem('token') !== 'undefined') ? localStorage.getItem('token') : "" ),
  profile: ((localStorage.getItem('profile') !== 'undefined') ? localStorage.getItem('profile') : "" ),
  userType: ((localStorage.getItem('userType') !== 'undefined') ? localStorage.getItem('userType') : "" ),
  userName: ((localStorage.getItem('userName') !== 'undefined') ? localStorage.getItem('userName') : "" ),
  UserId: ((localStorage.getItem('UserId') !== 'undefined') ? localStorage.getItem('UserId') : "" ),
  Referenceno: ((localStorage.getItem('Referenceno') !== 'undefined') ? localStorage.getItem('Referenceno') : "" ),
};

const storeReducer = (state = initialState, action) => {
  // alert(action.type)
  // //console.log(state)
  switch (action.type) {
    case "openMenu": {
      return {
        menuVisibility: "active",
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }
    case "closeMenu": {
      return {
        menuVisibility: "",
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }
    case "MenuStatusOpen": {
      localStorage.setItem('menuStatusHeader', "active");
      return {
        // menuVisibility: state.menuVisibility,
        menuStatusHeader: "active",
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }
    case "MenuStatusClose": {
      localStorage.setItem('menuStatusHeader', "");
      return {
        // menuVisibility: state.menuVisibility,
        menuStatusHeader: "",
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }
    case "hoverMenu": {
      return {
        menuVisibility: action.value,
        menuStatusHeader: action.value,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }
    case "headerTitle": {
      // alert(action.value);
      localStorage.setItem('headerTitle', action.value);
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: action.value,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }

    case "Token": {
      localStorage.setItem('token', action.value);
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        profile: state.profile,
        token: action.value,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }

    case "profile": {
      localStorage.setItem('profile', action.value);
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: action.value,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }

    case "UserId": {
      localStorage.setItem('UserId', action.value);
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: action.value,
        Referenceno: state.Referenceno,
      };
    }

    case "userType": {
      localStorage.setItem('userType', action.value);
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: action.value,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }

    case "userName": {
      localStorage.setItem('userName', action.value);
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: action.value,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }

    case "getProfile": {
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }

    case "getToken": {
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: state.Referenceno,
      };
    }

    case "Referenceno": {
      localStorage.setItem('Referenceno', action.value);
      return {
        menuVisibility: state.menuVisibility,
        menuStatusHeader: state.menuStatusHeader,
        headerTitle: state.headerTitle,
        token: state.token,
        profile: state.profile,
        userType: state.userType,
        userName: state.userName,
        UserId: state.UserId,
        Referenceno: action.value,
      };
    }

    default:
      return state;
  }
};

const store = createStore(storeReducer);

export default store;
