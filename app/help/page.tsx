"use client";

import { useState } from "react";
import { useTranslation } from "@/app/hooks/useTranslation";
import { MessageCircle, Mail, ExternalLink, ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpCenterPage() {
  const { t } = useTranslation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: "Comment fonctionne le service de livraison?",
      answer:
        "Notre service de livraison est simple et rapide. Vous pouvez commander en ligne ou via notre application mobile. Nous livrons dans les zones de Dakar et ses environs.",
    },
    {
      question: "Quels sont les tarifs de livraison?",
      answer:
        "Les tarifs varient selon la distance et le poids du colis. Vous pouvez consulter nos tarifs détaillés dans la section 'Tarifs' de notre site.",
    },
    {
      question: "Comment puis-je suivre ma commande?",
      answer:
        "Vous pouvez suivre votre commande en temps réel via notre système de suivi GPS. Un lien de suivi vous sera envoyé par SMS et email.",
    },
    {
      question: "Quels sont les modes de paiement acceptés?",
      answer:
        "Nous acceptons les paiements par Wave, Orange Money, Carte bancaire et Virement bancaire. Vous pouvez choisir votre mode de paiement au moment de la commande.",
    },
    {
      question: "Qu'est-ce que je dois faire en cas de problème avec ma livraison?",
      answer:
        "En cas de problème, contactez notre équipe de support client via WhatsApp, email ou notre formulaire de contact. Nous nous engageons à résoudre les problèmes dans les 24 heures.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HelpCircle className="w-8 h-8" />
            {t("help.title", "Help Center")}
          </h1>
          <p className="text-blue-100 mt-2">Nous sommes là pour vous aider</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a
            href="https://wa.me/221773629075"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-green-500"
          >
            <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">{t("help.whatsapp", "WhatsApp")}</h3>
            <p className="text-sm text-gray-600 mb-4">Contactez-nous sur WhatsApp pour une assistance immédiate</p>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              Ouvrir WhatsApp
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          <a
            href="mailto:mackasarr7@gmail.com"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-500"
          >
            <Mail className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">{t("help.email", "Email")}</h3>
            <p className="text-sm text-gray-600 mb-4">Envoyez-nous vos questions par email</p>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
              mackasarr7@gmail.com
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <MessageCircle className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">{t("help.contact", "Contact")}</h3>
            <p className="text-sm text-gray-600 mb-4">Disponible 24/7 pour votre assistance</p>
            <p className="text-purple-600 text-sm font-semibold">+221773629075</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">{t("help.faq", "FAQ")}</h2>
          </div>

          <div className="divide-y">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b last:border-b-0">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <h3 className="font-semibold text-gray-900">{item.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition ${expandedFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-gray-600">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legal Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/legal/terms">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                {t("help.termsOfService", "Terms of Service")}
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </h3>
              <p className="text-sm text-gray-600">
                Lire nos conditions d'utilisation et nos obligations légales
              </p>
            </div>
          </Link>

          <Link href="/legal/privacy">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                {t("help.privacyPolicy", "Privacy Policy")}
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </h3>
              <p className="text-sm text-gray-600">
                Découvrez comment nous protégeons vos données personnelles
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
