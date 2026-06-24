import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";

export interface UserProfile {
  uid: string;
  email?: string;
  phone?: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  language: string;
}

interface AuthStore {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signUpWithPhone: (phone: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setError: (error: string | null) => void;
  initializeAuth: () => void;
}

const db = getFirestore();

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      userProfile: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      signUpWithEmail: async (email, password, displayName) => {
        try {
          set({ isLoading: true, error: null });
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          const userProfile: UserProfile = {
            uid: userCredential.user.uid,
            email,
            displayName,
            emailVerified: false,
            phoneVerified: false,
            createdAt: new Date().toISOString(),
            language: "fr",
          };

          await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
          set({ user: userCredential.user, userProfile, isAuthenticated: true });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signUpWithPhone: async (phone, password, displayName) => {
        try {
          set({ isLoading: true, error: null });
          // Generate a temporary email from phone
          const tempEmail = `${phone.replace(/\D/g, "")}@phone.livraisonpro.local`;
          
          const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, password);
          
          const userProfile: UserProfile = {
            uid: userCredential.user.uid,
            phone,
            displayName,
            emailVerified: false,
            phoneVerified: false,
            createdAt: new Date().toISOString(),
            language: "fr",
          };

          await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
          set({ user: userCredential.user, userProfile, isAuthenticated: true });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signInWithEmail: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          const userDocSnap = await getDoc(doc(db, "users", userCredential.user.uid));
          const userProfile = userDocSnap.data() as UserProfile;

          set({ user: userCredential.user, userProfile, isAuthenticated: true });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signInWithPhone: async (phone, password) => {
        try {
          set({ isLoading: true, error: null });
          const tempEmail = `${phone.replace(/\D/g, "")}@phone.livraisonpro.local`;
          await signInWithEmailAndPassword(auth, tempEmail, password);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);

          let userProfile: UserProfile | null = null;
          const userDocSnap = await getDoc(doc(db, "users", userCredential.user.uid));
          
          if (userDocSnap.exists()) {
            userProfile = userDocSnap.data() as UserProfile;
          } else {
            userProfile = {
              uid: userCredential.user.uid,
              email: userCredential.user.email || "",
              displayName: userCredential.user.displayName || "User",
              photoURL: userCredential.user.photoURL || undefined,
              emailVerified: true,
              phoneVerified: false,
              createdAt: new Date().toISOString(),
              language: "fr",
            };
            await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
          }

          set({ user: userCredential.user, userProfile, isAuthenticated: true });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await signOut(auth);
          set({ user: null, userProfile: null, isAuthenticated: false });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const user = auth.currentUser;
          if (!user) throw new Error("No user logged in");

          await setDoc(doc(db, "users", user.uid), data, { merge: true });
          set((state) => ({
            userProfile: state.userProfile ? { ...state.userProfile, ...data } : null,
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setError: (error) => set({ error }),

      initializeAuth: () => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userDocSnap = await getDoc(doc(db, "users", user.uid));
            const userProfile = userDocSnap.data() as UserProfile | undefined;
            set({ user, userProfile: userProfile || null, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, userProfile: null, isAuthenticated: false, isLoading: false });
          }
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        userProfile: state.userProfile,
      }),
    }
  )
);
