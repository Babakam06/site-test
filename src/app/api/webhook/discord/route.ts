import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, webhookUrl } = body;

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL manquant" }, { status: 400 });
    }

    let embed;

    if (type === "candidature") {
      embed = {
        title: "📋 Nouvelle Candidature - Mairie de Blaine County",
        color: 0x3B82F6,
        fields: [
          { name: "👤 Nom RP", value: data.nom_rp || "Non spécifié", inline: true },
          { name: "👤 Prénom RP", value: data.prenom_rp || "Non spécifié", inline: true },
          { name: "🎂 Âge RP", value: data.age_rp?.toString() || "Non spécifié", inline: true },
          { name: "💼 Poste demandé", value: data.poste || "Non spécifié", inline: false },
          { name: "💬 Motivation", value: (data.motivation || "Non spécifié").substring(0, 1024), inline: false },
          { name: "📜 Expérience RP", value: (data.experience || "Non spécifié").substring(0, 1024), inline: false },
          { name: "🎮 Discord ID", value: data.discord_id || "Non spécifié", inline: true },
          { name: "📅 Disponibilités", value: data.disponibilites || "Non spécifiées", inline: true },
        ],
        footer: {
          text: "Département des Ressources Humaines - Blaine County",
        },
        timestamp: new Date().toISOString(),
      };
    } else if (type === "contact") {
      embed = {
        title: "📩 Nouveau Message - Formulaire de Contact",
        color: 0x10B981,
        fields: [
          { name: "👤 Nom", value: `${data.prenom || ""} ${data.nom || ""}`.trim() || "Non spécifié", inline: true },
          { name: "📧 Email", value: data.email || "Non spécifié", inline: true },
          { name: "📋 Sujet", value: data.sujet || "Non spécifié", inline: false },
          { name: "💬 Message", value: (data.message || "Non spécifié").substring(0, 1024), inline: false },
        ],
        footer: {
          text: "Secrétariat de la Mairie - Blaine County",
        },
        timestamp: new Date().toISOString(),
      };
    } else if (type === "demarche") {
      embed = {
        title: `📑 Nouvelle Démarche : ${data.type_demarche || "Non spécifié"}`,
        color: 0xF59E0B,
        fields: [
          { name: "👤 Demandeur", value: `${data.prenom || ""} ${data.nom || ""}`.trim() || "Non spécifié", inline: true },
          { name: "📧 Email", value: data.email || "Non spécifié", inline: true },
          { name: "📞 Téléphone", value: data.telephone || "Non spécifié", inline: true },
          { name: "🏠 Adresse", value: data.adresse || "Non spécifiée", inline: false },
          { name: "📝 Détails", value: (data.details || "Aucun détail fourni").substring(0, 1024), inline: false },
        ],
        footer: {
          text: "Services Administratifs - Blaine County",
        },
        timestamp: new Date().toISOString(),
      };
    } else {
      return NextResponse.json({ error: "Type de webhook invalide" }, { status: 400 });
    }

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Mairie de Blaine County",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/1042/1042339.png",
        embeds: [embed],
      }),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error("Discord webhook error:", errorText);
      return NextResponse.json({ error: "Erreur lors de l'envoi au webhook Discord" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
