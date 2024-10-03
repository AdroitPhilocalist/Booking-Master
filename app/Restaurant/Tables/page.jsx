'use client'
import { ChevronUpIcon, ChevronDownIcon, PencilIcon, BoltIcon } from 'lucide-react'
import { useRouter } from "next/navigation";
import { Footer } from '@/app/_components/Footer'
import Navbar from '@/app/_components/Navbar'
import { useState, useEffect } from 'react'

export default function BookingMasterControlPanel() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(15);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [tableData, setTableData] = useState([]);  // Use state to store fetched data
  const [loading, setLoading] = useState(true);  // Add loading state

  // Fetch table data from the API when component mounts
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tables');  // Fetch data from the API route
        const data = await response.json();
        if (data.success) {
          setTableData(data.data);  // Set the fetched table data
        }
        setLoading(false);  // Data has been fetched, stop loading
      } catch (error) {
        console.error('Error fetching table data:', error);
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  const filteredData = tableData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Master Control Panel</h1>
        </div>
      </header>
      <nav className="bg-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <span className="text-blue-600">Home</span> • <span className="text-gray-600">Table</span>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BoltIcon className="h-6 w-6 mr-2 text-yellow-500" />
                Table List
              </h2>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={() => router.push("/Restaurant/Tables/add")}>
                Add New +
              </button>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <span className="mr-2">Display</span>
                <select
                  value={displayCount}
                  onChange={(e) => setDisplayCount(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2">records</span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Table No.', 'POS', 'Action'].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort(header.toLowerCase())}
                      >
                        <div className="flex items-center">
                          {header}
                          {sortColumn === header.toLowerCase() && (
                            sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.slice(0, displayCount).map((item) => (
                    <tr key={item._id}> {/* Use _id from MongoDB */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tableNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.pos}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.active === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.active === 'yes' ? 'Active' : 'Inactive'}
                        </span>
                        <button className="ml-2 text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
