import { useEffect, useState } from "react";
import api from "../services/api";
import { isTokenExpired } from "../utils/jwt";

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ receiverUsername: "", amount: "", description: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const fetchUser = async () => {
    const res = await api.get("/User/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserData(res.data);
  };

  const fetchTransactions = async () => {
    const res = await api.get("/Transaction/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions(res.data);
  };

  useEffect(() => {
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    fetchUser();
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.receiverUsername.trim()) newErrors.receiverUsername = "Receiver username is required.";
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = "Amount must be greater than 0.";
    if (!form.description.trim()) newErrors.description = "Description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await api.post("/Transaction/transfer", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Transfer successful ✅");
      setForm({ receiverUsername: "", amount: "", description: "" });
      fetchUser();
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setMessage("Transfer failed ❌");
    }
  };

  if (!userData) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-green-50 px-4 py-6 sm:px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center sm:text-left">
          Welcome, {userData.username} 👋
        </h1>
        <p className="text-lg mb-6 text-center sm:text-left">
          Balance: <strong>{userData.balance} ₺</strong>
        </p>

        <form onSubmit={handleTransfer} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">💸 Send Money</h2>

          <input
            type="text"
            name="receiverUsername"
            placeholder="Receiver username"
            value={form.receiverUsername}
            onChange={handleChange}
            className={`w-full p-2 border mb-1 rounded ${errors.receiverUsername ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.receiverUsername && <p className="text-red-500 text-sm mb-2">{errors.receiverUsername}</p>}

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className={`w-full p-2 border mb-1 rounded ${errors.amount ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.amount && <p className="text-red-500 text-sm mb-2">{errors.amount}</p>}

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className={`w-full p-2 border mb-1 rounded ${errors.description ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.description && <p className="text-red-500 text-sm mb-2">{errors.description}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Transfer
          </button>

          {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
        </form>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">📜 Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li key={tx.id} className="border-b pb-2">
                  <p className="text-sm">
                    <strong>{tx.amount} ₺</strong> → {tx.description}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
