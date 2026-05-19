"use client";

import { useEffect, useState } from "react";
import { Command, getAllCommands } from "@/app/utils/firestoreCommands";
import CommandCard from "@/app/components/CommandCard";
import AddCommandForm from "@/app/components/AddCommandForm";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Truck,
  DollarSign,
  Clock,
  Activity,
  Menu,
  X,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
} from "lucide-react";

type StatusFilter = "tous" | "en attente" | "confirmée" | "en cours" | "livrée" | "annulée";

export default function AdminPremiumDashboard() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("tous");
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    completedToday: 0,
    pendingOrders: 0,
    activeDrivers: 3,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const allCommands = await getAllCommands();
      setCommands(allCommands);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = allCommands.filter((cmd) => {
        const cmdDate = new Date(cmd.createdAt as any);
        cmdDate.setHours(0, 0, 0, 0);
        return cmdDate.getTime() === today.getTime();
      });

      const totalRevenue = allCommands.reduce((sum, cmd) => sum + (cmd.prix || 0), 0);
      const completed = allCommands.filter((cmd) => cmd.statut === "livrée").length;
      const pending = allCommands.filter((cmd) => cmd.statut === "en attente").length;

      setStats({
        totalOrders: allCommands.length,
        todayOrders: todayOrders.length,
        totalRevenue,
        completedToday: completed,
        pendingOrders: pending,
        activeDrivers: 3,
      });

      if (selectedStatus === "tous") {
        setFilteredCommands(allCommands);
      } else {
        setFilteredCommands(allCommands.filter((c) => c.statut === selectedStatus));
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedStatus === "tous") {
      setFilteredCommands(commands);
    } else {
      setFilteredCommands(commands.filter((c) => c.statut === selectedStatus));
    }
  }, [selectedStatus, commands]);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    trend,
  }: {
    icon: any;
    title: string;
    value: string | number;
    trend?: string;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <Icon className="text-blue-600" size={24} />
        {trend && <span className="text-green-600 text-sm font-semibold">{trend}</span>}
      </div>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-slate-900 to-slate-950 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Livraison Pro</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            href="/commands"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            <Truck size={20} />
            {sidebarOpen && <span>Commandes</span>}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            <MapPin size={20} />
            {sidebarOpen && <span>Accueil</span>}
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Admin</h2>
                <p className="text-gray-600 mt-1">Bienvenue sur votre tableau de bord</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>➕</span>
                {showForm ? "Fermer" : "Nouvelle Commande"}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
              icon={Package}
              title="Total Commandes"
              value={stats.totalOrders}
              trend="+12%"
            />
            <StatCard
              icon={Calendar}
              title="Aujourd'hui"
              value={stats.todayOrders}
              trend="+8%"
            />
            <StatCard
              icon={DollarSign}
              title="Revenu Total"
              value={`${stats.totalRevenue.toLocaleString()} FCFA`}
              trend="+15%"
            />
            <StatCard
              icon={CheckCircle}
              title="Livrées"
              value={stats.completedToday}
              trend="+5%"
            />
            <StatCard
              icon={Clock}
              title="En attente"
              value={stats.pendingOrders}
            />
            <StatCard
              icon={Truck}
              title="Livreurs Actifs"
              value={stats.activeDrivers}
            />
          </div>

          {/* ADD FORM */}
          {showForm && (
            <div className="mb-8 bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <AddCommandForm onCommandAdded={loadData} />
            </div>
          )}

          {/* FILTERS */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(
              [
                "tous",
                "en attente",
                "confirmée",
                "en cours",
                "livrée",
                "annulée",
              ] as StatusFilter[]
            ).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedStatus === status
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                }`}
              >
                {status === "tous"
                  ? "Tous"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin">
                <div className="text-4xl">⏳</div>
              </div>
              <p className="text-gray-600 ml-4">Chargement...</p>
            </div>
          )}

          {/* COMMANDS LIST */}
          {!loading && filteredCommands.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Aucune commande
              </h3>
              <p className="text-gray-600">
                {selectedStatus === "tous"
                  ? "Créez une nouvelle commande pour commencer"
                  : `Aucune commande avec le statut "${selectedStatus}"`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommands.map((command) => (
                <CommandCard
                  key={command.id}
                  command={command}
                  onUpdate={loadData}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
