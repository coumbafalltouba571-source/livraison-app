"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/help" className="flex items-center gap-2 text-blue-100 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" />
            Retour au centre d'aide
          </Link>
          <h1 className="text-3xl font-bold">Conditions d'Utilisation</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-700">
              En utilisant le service Livraison Pro, vous acceptez nos conditions d&apos;utilisation. Si vous n&apos;êtes pas
              d&apos;accord avec l&apos;une de ces conditions, vous ne pouvez pas utiliser notre service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description du service</h2>
            <p className="text-gray-700">
              Livraison Pro est une plateforme de service de livraison en ligne. Nous vous permettons de commander des
              livraisons dans les zones autorisées via notre site web ou notre application mobile.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Conditions d'utilisation</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Vous devez avoir au moins 18 ans pour utiliser notre service</li>
              <li>Vous acceptez de fournir des informations exactes et complètes</li>
              <li>Vous acceptez de respecter toutes les lois applicables</li>
              <li>Vous n'utiliserez pas le service pour des activités illégales</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilité</h2>
            <p className="text-gray-700">
              Livraison Pro n&apos;est pas responsable des pertes, dommages ou retards causés par des circonstances
              indépendantes de notre volonté, y compris les catastrophes naturelles, les grèves ou les conditions
              météorologiques extrêmes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation de la responsabilité</h2>
            <p className="text-gray-700">
              En aucun cas, Livraison Pro ne sera responsable de toute perte indirecte, accidentelle ou consécutive
              découlant de votre utilisation ou de votre incapacité à utiliser le service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Paiement</h2>
            <p className="text-gray-700">
              Tous les paiements doivent être effectués avant ou au moment de la livraison. Nous acceptons les
              paiements par Wave, Orange Money, Carte bancaire et Virement bancaire.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Annulation et remboursement</h2>
            <p className="text-gray-700">
              Les commandes peuvent être annulées jusqu&apos;à 30 minutes après leur passage. Les remboursements seront
              effectués dans les 5 jours ouvrables après l&apos;annulation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications</h2>
            <p className="text-gray-700">
              Livraison Pro se réserve le droit de modifier ces conditions à tout moment. Les modifications seront
              effectives dès leur publication sur le site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-700">
              Si vous avez des questions sur ces conditions, veuillez nous contacter à{" "}
              <a href="mailto:support@livraisonpro.com" className="text-blue-600 hover:underline">
                support@livraisonpro.com
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
