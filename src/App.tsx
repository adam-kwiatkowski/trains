import './App.css'
import DataTable from "./components/DataTable.tsx";

function App() {
  return (<>
    <div className="mx-auto lg:mx-48 xl:mx-96 min-h-screen p-4">
      <h1 className="text-2xl pb-4 lg:py-4">Podróże małe i duże</h1>
      <DataTable/>
    </div>
      </>)
}

export default App
