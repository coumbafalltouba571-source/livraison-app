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
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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
  confirmationResult: ConfirmationResult | null;
  recaptchaVerifier: RecaptchaVerifier | null;

  // Actions
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signUpWithPhone: (phone: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setError: (error: string | null) => void;
  initializeRecaptcha: (containerId: string) => void;
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
      confirmationResult: null,
      recaptchaVerifier: null,

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
          // Add custom parameters for better user experience
          provider.addScope('profile');
          provider.addScope('email');
          
          console.log("🔵 [AUTH] Initiating Google Sign-In...");
          const userCredential = await signInWithPopup(auth, provider);
          console.log("✅ [AUTH] Google Sign-In successful:", userCredential.user.email);

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
          console.error("❌ [AUTH] Google Sign-In error:", error.code, error.message);
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      initializeRecaptcha: (containerId: string) => {
        try {
          console.log("🔵 [RECAPTCHA] Initializing reCAPTCHA in container:", containerId);
          const verifier = new RecaptchaVerifier(auth, containerId, {
            size: 'normal',
            callback: (token: string) => {
              console.log("✅ [RECAPTCHA] reCAPTCHA verified successfully");
            },
            'expired-callback': () => {
              console.warn("⚠️ [RECAPTCHA] reCAPTCHA expired");
            },
            'error-callback': (error: any) => {
              console.error("❌ [RECAPTCHA] reCAPTCHA error:", error);
            }
          });
          set({ recaptchaVerifier: verifier });
          console.log("✅ [RECAPTCHA] RecaptchaVerifier created successfully");
        } catch (error: any) {
          console.error("❌ [RECAPTCHA] Failed to initialize RecaptchaVerifier:", error);
          set({ error: `RecaptchaVerifier error: ${error.message}` });
        }
      },

      sendOTP: async (phoneNumber: string) => {
        try {
          set({ isLoading: true, error: null });
          console.log("🔵 [OTP] Sending OTP to:", phoneNumber);
          
          const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: (token: string) => {
              console.log("✅ [RECAPTCHA] reCAPTCHA verified, token received");
            },
            'expired-callback': () => {
              console.warn("⚠️ [RECAPTCHA] reCAPTCHA token expired");
            }
          });

          const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            recaptchaVerifier
          );

          console.log("✅ [OTP] OTP sent successfully to:", phoneNumber);
          set({ confirmationResult, recaptchaVerifier });
        } catch (error: any) {
          console.error("❌ [OTP] Failed to send OTP:", error.code, error.message);
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOTP: async (otp: string) => {
        try {
          set({ isLoading: true, error: null });
          console.log("🔵 [OTP] Verifying OTP code...");

          const state = useAuthStore.getState();
          if (!state.confirmationResult) {
            throw new Error("No OTP confirmation result available. Please send OTP first.");
          }

          const userCredential = await state.confirmationResult.confirm(otp);
          console.log("✅ [OTP] OTP verified successfully");

          const userProfile: UserProfile = {
            uid: userCredential.user.uid,
            phone: userCredential.user.phoneNumber || "",
            displayName: userCredential.user.displayName || "User",
            emailVerified: false,
            phoneVerified: true,
            createdAt: new Date().toISOString(),
            language: "fr",
          };

          await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
          set({ 
            user: userCredential.user, 
            userProfile, 
            isAuthenticated: true,
            confirmationResult: null 
          });
        } catch (error: any) {
          console.error("❌ [OTP] Failed to verify OTP:", error.code, error.message);
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
          set({ user: null, userProfile: null, isAuthenticated: false, confirmationResult: null });
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
