import env from "~/env";
import RootStore from "~/stores/RootStore";

const stores = new RootStore();

// Expose stores on window in development for easier debugging
if (env.ENVIRONMENT === "development") {
  window.stores = stores;
}

export default stores;
