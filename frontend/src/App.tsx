import ErrorBoundary from "./components/error-boundary";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Dashboard from "./features/dashboard/pages/dashboard";

function App() {
  return (
    <>
      <ErrorBoundary>
        <div className="flex">
          <Sidebar />
          <Navbar />
          <Dashboard />
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;
