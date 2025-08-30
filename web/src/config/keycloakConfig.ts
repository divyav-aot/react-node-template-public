import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8080/", // Keycloak base URL
  realm: "my-realm", // Replace with your realm name
  clientId: "my-react-app", // Replace with your client ID
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
