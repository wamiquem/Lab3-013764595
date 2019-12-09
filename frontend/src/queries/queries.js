import { gql } from 'apollo-boost';

const ownerProfile = gql`
  query OwnerProfile($id: ID!) {
    ownerProfile(id: $id) {
      success
      message
      owner {
        fname
        lname
        phone
        rest_name
        rest_zip
      }
    }
  }
`;

const restaurantProfile = gql`
  query RestaurantProfile($ownerId: ID!) {
    restaurantProfile(ownerId: $ownerId) {
      success
      message
      restaurant {
        name
        phone
        street
        city
        state
        zip
        cuisine
      }
    }
  }
`;

const buyerProfile = gql`
  query BuyerProfile($id: ID!) {
    buyerProfile(id: $id) {
      success
      message
      buyer {
        fname
        lname
        phone
        street
        unit_no
        city
        state
        zip_code
      }
    }
  }
`;

const getSections = gql`
query GetSections($ownerId: ID!) {
  getSections(ownerId: $ownerId) {
    sections {
      _id
      name
    }
  }
}
`;

const getRestaurants = gql`
query GetRestaurants($name: String!) {
    getRestaurants(name: $name) {
        restaurants {
            _id
            name
            owner_id
            city
            state
            street
            cuisine
        }
  }
}
`;

const getSectionsWithMenus = gql`
query GetSectionsWithMenus($ownerId: ID!) {
  getSectionsWithMenus(ownerId: $ownerId) {
    sections {
      _id
      name
      menus{
          _id
          name
          description
          price
          image
      }
    }
  }
}
`;

const ownerSignupMutation = gql`
    mutation OwnerSignup($fname: String!, $lname: String!, $email: String!, $password: String!, $phone: String!,
        $restName: String!, $restZip: String!){
        ownerSignup(fname: $fname, lname: $lname, email: $email, password: $password, phone: $phone,
            restName: $restName, restZip: $restZip){
            success
            message
            id
        }
    }
`;

const addRestaurantMutation = gql`
mutation AddRestaurant($ownerId: ID!, $name: String!, $street: String!, $city: String!, $state: String!, $zip: String!,
    $phone: String!, $cuisine: String!){
    addRestaurant(ownerId: $ownerId, name: $name, street: $street, city: $city, state: $state, zip: $zip,
        phone: $phone, cuisine: $cuisine){
        success
        message
    }
}
`;

const ownerLoginMutation = gql`
    mutation OwnerLogin($email: String!, $password: String!){
        ownerLogin(email: $email, password: $password){
            success
            message
            firstName
            id
        }
    }
`;

const buyerSignupMutation = gql`
    mutation BuyerSignup($firstName: String!, $lastName: String!, $email: String!, $password: String!){
        buyerSignup(firstName: $firstName, lastName: $lastName, email: $email, password: $password){
            success
            message
        }
    }
`;

const buyerLoginMutation = gql`
    mutation BuyerLogin($email: String!, $password: String!){
        buyerLogin(email: $email, password: $password){
            success
            message
            firstName
            id
        }
    }
`;

const updateOwnerProfileMutation = gql`
    mutation UpdateOwnerProfile($id: ID!, $fname: String!, $lname: String!, $phone: String!,
        $restName: String!, $restZip: String!){
        updateOwnerProfile(id: $id, fname: $fname, lname: $lname, phone: $phone,
            restName: $restName, restZip: $restZip){
            success
            message
        }
    }
`;

const updateRestaurantProfileMutation = gql`
mutation UpdateRestaurantProfile($ownerId: ID!, $name: String!, $street: String!, $city: String!, $state: String!, $zip: String!,
    $phone: String!, $cuisine: String!){
    updateRestaurantProfile(ownerId: $ownerId, name: $name, street: $street, city: $city, state: $state, zip: $zip,
        phone: $phone, cuisine: $cuisine){
        success
        message
    }
}
`;

const updateBuyerProfileMutation = gql`
    mutation UpdateBuyerProfile($id: ID!, $fname: String!, $lname: String!, $phone: String!, $street: String!, 
        $unit: String!, $city: String!, $state: String!, $zip: String!){
        updateBuyerProfile(id: $id, fname: $fname, lname: $lname, phone: $phone,
            street: $street, unit: $unit, city: $city, state: $state, zip: $zip){
            success
            message
        }
    }
`;

const addSectionMutation = gql`
mutation AddSection($ownerId: ID!, $name: String!){
    addSection(ownerId: $ownerId, name: $name){
        success
        message
        id
    }
}
`;

const addMenuMutation = gql`
mutation AddMenu($ownerId: ID!, $sectionId: ID!, $name: String!, $description: String!, $price: String!){
    addMenu(ownerId: $ownerId, sectionId: $sectionId, name: $name, description: $description, price: $price){
        success
        message
        menuId
    }
}
`;

export {
    ownerSignupMutation,
    addRestaurantMutation,
    ownerProfile,
    updateOwnerProfileMutation,
    restaurantProfile,
    updateRestaurantProfileMutation,
    buyerSignupMutation,
    buyerProfile,
    updateBuyerProfileMutation,
    addSectionMutation,
    addMenuMutation,
    getSections,
    getSectionsWithMenus,
    getRestaurants,
    ownerLoginMutation,
    buyerLoginMutation
  };