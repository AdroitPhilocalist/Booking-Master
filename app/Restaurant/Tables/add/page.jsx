"use client"
import { useState } from 'react'
import { BoltIcon } from 'lucide-react'
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import Navbar from '@/app/_components/Navbar';
import { Footer } from '@/app/_components/Footer'

export default function AddTable() {
    const router=useRouter();
  const [tableNo, setTableNo] = useState('');
  const [pos, setPos] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/tables', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableNo,
        pos,
      }),
    });

    if (response.ok) {
      console.log('Table added successfully');
      // Clear form after submission
      setTableNo('');
      setPos('');
      router.back();
    } else {
      console.error('Error adding table');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
              <BoltIcon className="h-6 w-6 mr-2 text-yellow-500" />
              Add Table
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Table Details</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <TextField id="Table Number" label="Table Number" variant="outlined"
                        type="text"
                        
                        value={tableNo}
                        onChange={(e) => setTableNo(e.target.value)}
                        className="border rounded w-full"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pos" className="block text-sm font-medium text-gray-700">
                        POS
                      </label>
                      <select
                        id="pos"
                        value={pos}
                        onChange={(e) => setPos(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      >
                        <option value="">Select</option>
                        <option value="pos1">POS 1</option>
                        <option value="pos2">POS 2</option>
                        <option value="pos3">POS 3</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-start space-x-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
