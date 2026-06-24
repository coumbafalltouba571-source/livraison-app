"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth";
import { useTranslation } from "@/app/hooks/useTranslation";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";

export default function LandingSection() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // If user is authenticated, show the main app content
    return null;
  }

  // If user is not authenticated, show landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenue sur <span className="text-blue-600">Livraison Pro</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Service de livraison rapide, fiable et abordable à Dakar et ses environs
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg"
            >
              <LogIn className="w-5 h-5" />
              {t("nav.login", "Se connecter")}
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2 text-lg"
            >
              <UserPlus className="w-5 h-5" />
              {t("nav.register", "S'inscrire")}
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rapide</h3>
              <p className="text-gray-600">Livraison express en moins de 2 heures dans les zones couvertes</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Abordable</h3>
              <p className="text-gray-600">Tarifs compétitifs et transparents sans frais cachés</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Suivi en temps réel</h3>
              <p className="text-gray-600">Suivez votre livraison en direct avec GPS</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Pourquoi nous choisir ?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Service 24/7</h4>
                <p className="text-gray-600">Disponible jour et nuit pour vos besoins de livraison</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Sécurisé</h4>
                <p className="text-gray-600">Vos données et vos colis sont en sécurité avec nous</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">💳</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Plusieurs modes de paiement</h4>
                <p className="text-gray-600">Wave, Orange Money, Carte bancaire et plus</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">👥</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Support client</h4>
                <p className="text-gray-600">Équipe dédiée prête à vous aider</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-lg mb-8 opacity-90">Créez votre compte en quelques secondes et commencez à utiliser nos services</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition text-lg"
          >
            {t("nav.register", "S'inscrire maintenant")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
