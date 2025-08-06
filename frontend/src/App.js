import { useEffect, useState } from "react";
import './App.css';


function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/dichvu", {
      method: "GET",
      credentials: "include", // test allowCredentials (cookie / JWT)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json(); // hoặc .text() nếu API không trả JSON
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>CORS Test</h2>
        <div className="text-red-500 font-bold text-center p-4">
  Tailwind hoạt động rồi!
</div>
<div className="bg-green-500 text-white text-xl p-6 rounded-lg">
  Nếu Tailwind hoạt động thì khung này có nền xanh lá và chữ trắng!
</div>


        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : error ? (
          <p style={{ color: 'red' }}>Lỗi: {error}</p>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </header>
    </div>
  );
}

export default App;
