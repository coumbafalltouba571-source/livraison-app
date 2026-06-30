import { db } from "@/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { createOrderNotification } from "@/app/utils/notifications";

export interface Command {
  id?: string;
  telephone: string;
  phone?: string;
  nomClient?: string;
  customerName?: string;
  client?: string;
  depart: string;
  destination: string;
  prix: number;
  total?: number;
  description: string;
  statut: "en attente" | "confirmée" | "en cours de traitement" | "en livraison" | "livrée" | "annulée";
  status?: Command["statut"];
  dateLivraison?: Date | Timestamp;
  modePayement?: string;
  paymentMethod?: string;
  paymentStatus?: "En attente" | "Confirmé" | "À payer à la livraison" | "Annulé";
  paymentStatusDetails?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  quantity?: number;
  price?: number;
  address?: string;
  orderItems?: {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  notes?: string;
  userId?: string;
  driverLatitude?: number;
  driverLongitude?: number;
  driverUpdatedAt?: Date | Timestamp;
  driverStatus?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const COMMANDS_COLLECTION = "commandes";

// Créer une nouvelle commande
export async function createCommand(
  commandData: Omit<Command, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    console.log(`📝 [createCommand] Tentative d'écriture dans la collection: "${COMMANDS_COLLECTION}"`);
    console.log(`📝 [createCommand] Données à enregistrer:`, {
      telephone: commandData.telephone,
      nomClient: commandData.nomClient,
      depart: commandData.depart,
      destination: commandData.destination,
      prix: commandData.prix,
      modePayement: commandData.modePayement,
      statut: commandData.statut,
    });
    
    console.log(`📝 [createCommand] Instance Firestore:`, { db: !!db });
    
    const docRef = await addDoc(collection(db, COMMANDS_COLLECTION), {
      ...commandData,
      statut: commandData.statut || "en attente",
      dateLivraison:
        commandData.dateLivraison instanceof Date
          ? Timestamp.fromDate(commandData.dateLivraison)
          : commandData.dateLivraison,
      driverUpdatedAt:
        commandData.driverUpdatedAt instanceof Date
          ? Timestamp.fromDate(commandData.driverUpdatedAt)
          : commandData.driverUpdatedAt,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const orderPayload = {
      id: docRef.id,
      ...commandData,
      telephone: commandData.telephone,
      phone: commandData.phone || commandData.telephone,
      nomClient: commandData.nomClient || commandData.client,
      customerName: commandData.customerName || commandData.client || commandData.nomClient,
      client: commandData.client || commandData.nomClient,
      depart: commandData.depart,
      destination: commandData.destination,
      prix: commandData.prix,
      total: commandData.total || commandData.prix,
      description: commandData.description,
      statut: commandData.statut || "en attente",
      paymentMethod: commandData.paymentMethod || commandData.modePayement,
      paymentStatus: commandData.paymentStatus || (commandData.paymentMethod === "livraison" ? "À payer à la livraison" : "En attente"),
      address: commandData.address || commandData.destination,
      orderItems: commandData.orderItems,
      dateLivraison: commandData.dateLivraison,
      driverLatitude: commandData.driverLatitude,
      driverLongitude: commandData.driverLongitude,
      driverUpdatedAt: commandData.driverUpdatedAt,
      driverStatus: commandData.driverStatus,
      notes: commandData.notes,
    } as Command;

    await Promise.allSettled([
      createOrderNotification(orderPayload),
      sendOrderNotifications(orderPayload),
    ]);
    
    console.log(`✅ [createCommand] Commande créée avec succès!`);
    console.log(`✅ [createCommand] ID de la commande: ${docRef.id}`);
    console.log(`✅ [createCommand] URL du document: /commandes/${docRef.id}`);
    
    return docRef.id;
  } catch (error) {
    console.error(`❌ [createCommand] ERREUR COMPLÈTE FIRESTORE:`);
    console.error(`   Collection: "${COMMANDS_COLLECTION}"`);
    console.error(`   Erreur brute:`, error);
    
    let detailedErrorMsg = "Erreur Firestore inconnue";
    
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
      detailedErrorMsg = error.message;
      
      const errorCode = (error as unknown as { code?: string }).code;
      const errorDetails = error as { code?: string };
      
      console.error(`   Code: ${errorCode}`);
      console.error(`   Détails complets:`, errorDetails);
      
      // Analyser l'erreur
      if (errorCode === "permission-denied") {
        console.error(`   🔒 ERREUR: Permissions Firestore insuffisantes`);
        console.error(`      → Solution: https://console.firebase.google.com → Firestore → Règles`);
        console.error(`      → Remplacer les règles par: allow read, write: if true;`);
        detailedErrorMsg = `Permission denied: ${error.message}`;
      } else if (errorCode === "unauthenticated") {
        console.error(`   🔐 ERREUR: Authentification manquante`);
        console.error(`      → Configuration Firebase invalide`);
        detailedErrorMsg = `Unauthenticated: ${error.message}`;
      } else if (errorCode === "invalid-argument") {
        console.error(`   ⚠️ ERREUR: Argument invalide`);
        console.error(`      → Les données envoyées ne sont pas valides`);
        detailedErrorMsg = `Invalid argument: ${error.message}`;
      } else if (error.message.includes("Could not initialize Cloud Firestore") || 
                 error.message.includes("Failed to initialize")) {
        console.error(`   ⚙️ ERREUR: Initialisation Firestore échouée`);
        console.error(`      → Les clés d'environnement dans .env.local sont FAUSSE ou MANQUANTE`);
        console.error(`      → Vérifiez: NEXT_PUBLIC_FIREBASE_API_KEY`);
        console.error(`      → Ne doit pas contenir 'xxx'`);
        detailedErrorMsg = `Firebase initialization failed: ${error.message}`;
      }
    } else {
      detailedErrorMsg = String(error);
      console.error(`   Erreur (non-Error):`, error);
    }
    
    console.error(`❌ [createCommand] MESSAGE FINAL À LANCER:`, detailedErrorMsg);
    throw new Error(detailedErrorMsg);
  }
}

// Récupérer toutes les commandes (triées par date décroissante)
export async function getAllCommands(): Promise<Command[]> {
  try {
    console.log(`📖 Tentative de lecture depuis la collection: "${COMMANDS_COLLECTION}"`);
    const q = query(
      collection(db, COMMANDS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const commands: Command[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      commands.push({
        id: doc.id,
        ...data,
        dateLivraison:
          data.dateLivraison instanceof Timestamp
            ? data.dateLivraison.toDate()
            : data.dateLivraison,
        driverUpdatedAt:
          data.driverUpdatedAt instanceof Timestamp
            ? data.driverUpdatedAt.toDate()
            : data.driverUpdatedAt,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate()
            : data.updatedAt,
      } as Command);
    });

    console.log(`✅ ${commands.length} commandes récupérées`);
    return commands;
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}"`);
    console.error("Erreur lors de la récupération des commandes:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as unknown as { code?: string }).code);
    }
    throw error;
  }
}

// Récupérer les commandes par statut
export async function getCommandsByStatus(
  status: string
): Promise<Command[]> {
  try {
    console.log(`📖 Tentative de lecture avec filtre - Collection: "${COMMANDS_COLLECTION}", Statut: "${status}"`);
    const q = query(
      collection(db, COMMANDS_COLLECTION),
      where("statut", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const commands: Command[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      commands.push({
        id: doc.id,
        ...data,
        dateLivraison:
          data.dateLivraison instanceof Timestamp
            ? data.dateLivraison.toDate()
            : data.dateLivraison,
        driverUpdatedAt:
          data.driverUpdatedAt instanceof Timestamp
            ? data.driverUpdatedAt.toDate()
            : data.driverUpdatedAt,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate()
            : data.updatedAt,
      } as Command);
    });

    console.log(`✅ ${commands.length} commandes trouvées avec le statut: "${status}"`);
    return commands;
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}"`);
    console.error(`Erreur lors de la récupération des commandes avec le statut "${status}":`, error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as unknown as { code?: string }).code);
    }
    throw error;
  }
}

// Mettre à jour une commande
export async function updateCommand(
  commandId: string,
  updates: Partial<Command>
): Promise<void> {
  try {
    console.log(`✏️ Tentative de mise à jour - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}"`);
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    await updateDoc(commandRef, {
      ...updates,
      dateLivraison:
        updates.dateLivraison instanceof Date
          ? Timestamp.fromDate(updates.dateLivraison)
          : updates.dateLivraison,
      driverUpdatedAt:
        updates.driverUpdatedAt instanceof Date
          ? Timestamp.fromDate(updates.driverUpdatedAt)
          : updates.driverUpdatedAt,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Commande mise à jour avec succès: ${commandId}`);
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}"`);
    console.error("Erreur lors de la mise à jour de la commande:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as unknown as { code?: string }).code);
    }
    throw error;
  }
}

// Mettre à jour le statut d'une commande
export async function updateCommandStatus(
  commandId: string,
  newStatus: string
): Promise<void> {
  try {
    console.log(`✏️ Tentative de mise à jour du statut - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}", Nouveau statut: "${newStatus}"`);
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    await updateDoc(commandRef, {
      statut: newStatus,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Statut mis à jour avec succès: ${commandId} → ${newStatus}`);
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}"`);
    console.error("Erreur lors de la mise à jour du statut:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as unknown as { code?: string }).code);
    }
    throw error;
  }
}

// Supprimer une commande
export async function deleteCommand(commandId: string): Promise<void> {
  try {
    console.log(`🗑️ Tentative de suppression - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}"`);
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    await deleteDoc(commandRef);
    console.log(`✅ Commande supprimée avec succès: ${commandId}`);
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}"`);
    console.error("Erreur lors de la suppression de la commande:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as unknown as { code?: string }).code);
    }
    throw error;
  }
}

// Récupérer les commandes du jour
export async function getTodayCommands(): Promise<Command[]> {
  try {
    console.log(`📖 Tentative de lecture des commandes du jour - Collection: "${COMMANDS_COLLECTION}"`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      collection(db, COMMANDS_COLLECTION),
      where("createdAt", ">=", Timestamp.fromDate(today)),
      where("createdAt", "<", Timestamp.fromDate(tomorrow)),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const commands: Command[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      commands.push({
        id: doc.id,
        ...data,
        dateLivraison:
          data.dateLivraison instanceof Timestamp
            ? data.dateLivraison.toDate()
            : data.dateLivraison,
        driverUpdatedAt:
          data.driverUpdatedAt instanceof Timestamp
            ? data.driverUpdatedAt.toDate()
            : data.driverUpdatedAt,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate()
            : data.updatedAt,
      } as Command);
    });

    console.log(`✅ ${commands.length} commandes du jour récupérées`);
    return commands;
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}"`);
    console.error("Erreur lors de la récupération des commandes du jour:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as unknown as { code?: string }).code);
    }
    throw error;
  }
}

// Récupérer une commande par ID
export async function getCommandById(commandId: string): Promise<Command | null> {
  try {
    console.log(`📖 Tentative de lecture par ID - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}"`);
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    const docSnap = await getDoc(commandRef);

    if (!docSnap.exists()) {
      console.warn(`⚠️ Commande non trouvée: ${commandId}`);
      return null;
    }

    const data = docSnap.data();
    const command = {
      id: docSnap.id,
      ...data,
      dateLivraison:
        data.dateLivraison instanceof Timestamp
          ? data.dateLivraison.toDate()
          : data.dateLivraison,
      driverUpdatedAt:
        data.driverUpdatedAt instanceof Timestamp
          ? data.driverUpdatedAt.toDate()
          : data.driverUpdatedAt,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : data.createdAt,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : data.updatedAt,
    } as Command;
    console.log(`✅ Commande trouvée: ${commandId}`);
    return command;
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}"`);
    console.error("Erreur lors de la récupération de la commande:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as unknown as { code?: string }).code);
    }
    throw error;
  }
}

async function sendOrderNotifications(orderPayload: Command): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications/send-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      console.error("❌ Échec de l'envoi des notifications de commande", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Impossible d'appeler l'API de notification de commande:", error);
    return false;
  }
}

// Récupérer les commandes par numéro de téléphone (client)
export async function getCommandsByPhone(telephone: string): Promise<Command[]> {
  try {
    console.log(`📖 Tentative de lecture des commandes du client - Tel: "${telephone}"`);
    const q = query(
      collection(db, COMMANDS_COLLECTION),
      where("telephone", "==", telephone),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const commands: Command[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      commands.push({
        id: doc.id,
        ...data,
        dateLivraison:
          data.dateLivraison instanceof Timestamp
            ? data.dateLivraison.toDate()
            : data.dateLivraison,
        driverUpdatedAt:
          data.driverUpdatedAt instanceof Timestamp
            ? data.driverUpdatedAt.toDate()
            : data.driverUpdatedAt,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate()
            : data.updatedAt,
      } as Command);
    });

    console.log(`✅ ${commands.length} commandes trouvées pour le client`);
    return commands;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des commandes du client:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as unknown as { code?: string }).code);
    }
    throw error;
  }
}

// Écouter les mises à jour en temps réel d'une commande
export function subscribeToCommand(
  commandId: string,
  callback: (command: Command | null) => void
) {
  try {
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    
    const unsubscribe = onSnapshot(commandRef, (docSnap) => {
      if (!docSnap.exists()) {
        callback(null);
        return;
      }

      const data = docSnap.data();
      const command = {
        id: docSnap.id,
        ...data,
        dateLivraison:
          data.dateLivraison instanceof Timestamp
            ? data.dateLivraison.toDate()
            : data.dateLivraison,
        driverUpdatedAt:
          data.driverUpdatedAt instanceof Timestamp
            ? data.driverUpdatedAt.toDate()
            : data.driverUpdatedAt,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate()
            : data.updatedAt,
      } as Command;
      
      callback(command);
    });

    return unsubscribe;
  } catch (error) {
    console.error("❌ Erreur lors de la souscription aux mises à jour:", error);
    throw error;
  }
}
