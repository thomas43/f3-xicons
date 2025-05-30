export default function AdminPage() {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 border rounded-xl shadow bg-white dark:bg-gray-300">
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
  