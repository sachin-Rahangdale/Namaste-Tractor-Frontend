import { useEffect, useState } from "react";
import { getEnquiries, updateEnquiryStatus } from "../api";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await getEnquiries();
      setEnquiries(res.data);
    } catch (err) {
      setError("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      fetchEnquiries(); // refresh
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Enquiries</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-b">
                <td className="p-2">{e.id}</td>
                <td className="p-2">{e.name}</td>
                <td className="p-2">{e.phone}</td>
                <td className="p-2">{e.enquiryType}</td>
                <td className="p-2">{e.message}</td>
                <td className="p-2">{e.status || "PENDING"}</td>
                <td className="p-2">
                  <select
                    onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                    defaultValue={e.status || "PENDING"}
                    className="border rounded p-1"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}