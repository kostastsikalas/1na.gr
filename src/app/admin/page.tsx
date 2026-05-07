import { LayoutDashboard, Users, FileText, ImageIcon } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Συνολικά Νέα", value: "12", icon: ImageIcon, color: "bg-blue-500" },
    { name: "Επιτυχόντες", value: "156", icon: Users, color: "bg-green-500" },
    { name: "Αρχεία Θεμάτων", value: "48", icon: FileText, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${stat.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Καλωσήρθατε στο Admin Panel</h2>
        <p className="text-gray-600 leading-relaxed">
          Από εδώ μπορείτε να διαχειριστείτε το περιεχόμενο της ιστοσελίδας σας. 
          Επιλέξτε από το μενού στα αριστερά την ενότητα που θέλετε να επεξεργαστείτε. 
          Οι αλλαγές που κάνετε εδώ θα εμφανίζονται άμεσα στην κεντρική ιστοσελίδα.
        </p>
      </div>
    </div>
  );
}
