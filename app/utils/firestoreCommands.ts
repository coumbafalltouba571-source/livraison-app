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

export interface Command {
  id?: string;
  telephone: string;
  nomClient?: string;
  depart: string;
  destination: string;
  prix: number;
  description: string;
  statut: "en attente" | "confirmée" | "en cours de traitement" | "en livraison" | "livrée" | "annulée";
  dateLivraison?: Date | Timestamp;
  client?: string;
  modePayement?: string;
  notes?: string;
  userId?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const COMMANDS_COLLECTION = "commandes";

// Créer une nouvelle commande
export async function createCommand(
  commandData: Omit<Command, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    console.log(`📝 Tentative d'écriture dans la collection: "${COMMANDS_COLLECTION}"`);
    const docRef = await addDoc(collection(db, COMMANDS_COLLECTION), {
      ...commandData,
      statut: commandData.statut || "en attente",
      dateLivraison:
        commandData.dateLivraison instanceof Date
          ? Timestamp.fromDate(commandData.dateLivraison)
          : commandData.dateLivraison,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Commande créée avec succès: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}"`);
    console.error("Erreur lors de la création de la commande:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as any).code);
    }
    throw error;
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
      console.error("Code:", (error as any).code);
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
      console.error("Code:", (error as any).code);
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
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Commande mise à jour avec succès: ${commandId}`);
  } catch (error) {
    console.error(`❌ Firestore Error - Collection: "${COMMANDS_COLLECTION}", ID: "${commandId}"`);
    console.error("Erreur lors de la mise à jour de la commande:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Code:", (error as any).code);
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
      console.error("Code:", (error as any).code);
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
      console.error("Code:", (error as any).code);
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
      console.error("Code:", (error as any).code);
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
      console.error("Code:", (error as any).code);
    }
    throw error;
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
      console.error("Code:", (error as any).code);
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
