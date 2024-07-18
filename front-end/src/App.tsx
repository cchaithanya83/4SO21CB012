import ProductList from "./components/body";
import Header from "./components/header";

function App() {
  return (
    <div
      style={{
        backgroundColor: "lightblue",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Header />
      <ProductList />
    </div>
  );
}
export default App;
