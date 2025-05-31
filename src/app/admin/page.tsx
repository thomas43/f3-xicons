export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 border rounded-xl shadow bg-white dark:bg-gray-300">
       <div className="bg-white dark:bg-white border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6" role="alert">
        <p className="font-bold">Warning</p>
        <p>
          This admin page is <span className="underline">not currently protected</span>.
          Eventually access will be restricted via <code>next-auth</code>.
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <a href="/admin/xicon" className="text-f3accent hover:underline">
            Manage Xicons
          </a>
        </li>
        <li>
          <a href="/admin/submissions" className="text-f3accent hover:underline">
            Review Submissions
          </a>
        </li>
      </ul>
    </div>
  );
}
