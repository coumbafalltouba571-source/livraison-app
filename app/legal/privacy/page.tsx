"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/help" className="flex items-center gap-2 text-blue-100 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" />
            Retour au centre d'aide
          </Link>
          <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700">
              Livraison Pro (&quot;Nous&quot; ou &quot;Notre&quot;) s&apos;engage à protéger votre vie privée. Cette Politique de
              confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informations que nous collectons</h2>
            <p className="text-gray-700 mb-3">Nous collectons les types d'informations suivants :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Informations d'identification (nom, email, numéro de téléphone)</li>
              <li>Adresse de livraison et informations de paiement</li>
              <li>Informations de localisation GPS (avec votre permission)</li>
              <li>Données d'utilisation et de navigation du site</li>
              <li>Préférences et historique de commande</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des informations</h2>
            <p className="text-gray-700 mb-3">Nous utilisons vos informations pour :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Traiter vos commandes et paiements</li>
              <li>Vous fournir un support client</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des mises à jour et des notifications</li>
              <li>Respecter les obligations légales</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage des informations</h2>
            <p className="text-gray-700">
              Nous ne partageons pas vos informations personnelles avec des tiers, sauf :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li>Avec nos partenaires de livraison pour livrer vos commandes</li>
              <li>Avec les fournisseurs de services de paiement</li>
              <li>Pour se conformer à la loi ou aux demandes gouvernementales</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité des données</h2>
            <p className="text-gray-700">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles
              contre l&apos;accès non autorisé, la modification ou la divulgation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
            <p className="text-gray-700">
              Notre site utilise des cookies pour améliorer votre expérience utilisateur. Vous pouvez refuser les
              cookies via les paramètres de votre navigateur.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vos droits</h2>
            <p className="text-gray-700 mb-3">Vous avez le droit de :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Accéder à vos données personnelles</li>
              <li>Corriger les données inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact</h2>
            <p className="text-gray-700">
              Si vous avez des questions sur cette politique, veuillez nous contacter à{" "}
              <a href="mailto:privacy@livraisonpro.com" className="text-blue-600 hover:underline">
                privacy@livraisonpro.com
              </a>
            </p>
          </div>

          <div className="text-sm text-gray-500 border-t pt-4">
            <p>Dernière mise à jour : Juin 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
