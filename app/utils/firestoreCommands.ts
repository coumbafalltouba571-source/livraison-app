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
} from "firebase/firestore";

export interface Command {
  id?: string;
  telephone: string;
  depart: string;
  destination: string;
  prix: number;
  statut: "en attente" | "confirmée" | "en cours" | "livrée" | "annulée";
  dateLivraison?: Date | Timestamp;
  client?: string;
  notes?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const COMMANDS_COLLECTION = "commandes";

// Créer une nouvelle commande
export async function createCommand(
  commandData: Omit<Command, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
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
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    throw error;
  }
}

// Récupérer toutes les commandes (triées par date décroissante)
export async function getAllCommands(): Promise<Command[]> {
  try {
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

    return commands;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    throw error;
  }
}

// Récupérer les commandes par statut
export async function getCommandsByStatus(
  status: string
): Promise<Command[]> {
  try {
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

    return commands;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes par statut:", error);
    throw error;
  }
}

// Mettre à jour une commande
export async function updateCommand(
  commandId: string,
  updates: Partial<Command>
): Promise<void> {
  try {
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    await updateDoc(commandRef, {
      ...updates,
      dateLivraison:
        updates.dateLivraison instanceof Date
          ? Timestamp.fromDate(updates.dateLivraison)
          : updates.dateLivraison,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    throw error;
  }
}

// Mettre à jour le statut d'une commande
export async function updateCommandStatus(
  commandId: string,
  newStatus: string
): Promise<void> {
  try {
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    await updateDoc(commandRef, {
      statut: newStatus,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
}

// Supprimer une commande
export async function deleteCommand(commandId: string): Promise<void> {
  try {
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    await deleteDoc(commandRef);
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande:", error);
    throw error;
  }
}

// Récupérer les commandes du jour
export async function getTodayCommands(): Promise<Command[]> {
  try {
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

    return commands;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes du jour:", error);
    throw error;
  }
}

// Récupérer une commande par ID
export async function getCommandById(commandId: string): Promise<Command | null> {
  try {
    const commandRef = doc(db, COMMANDS_COLLECTION, commandId);
    const docSnap = await getDoc(commandRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
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
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    throw error;
  }
}
