import { withProviders } from "./providers";
import { AppRouter } from "./router";

function BaseApp() {
  return <AppRouter />;
}

const App = withProviders(BaseApp);

export default App;
