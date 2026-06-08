export type OnboardingData = {
  role: string;
  location: string;
  image: string;
  catName: string;
  catBreed: string;
  catAge: string;
  catImage: string;
  interests: string[];
  notifyAdoption: boolean;
  notifyMarketplace: boolean;
  notifyMating: boolean;
  notifyVets: boolean;
};

export const defaultOnboardingData: OnboardingData = {
  role: "",
  location: "",
  image: "",
  catName: "",
  catBreed: "",
  catAge: "",
  catImage: "",
  interests: [],
  notifyAdoption: false,
  notifyMarketplace: false,
  notifyMating: false,
  notifyVets: false,
};

export function saveOnboardingData(data: Partial<OnboardingData>) {
  const existing = loadOnboardingData();
  sessionStorage.setItem("onboarding", JSON.stringify({ ...existing, ...data }));
}

export function loadOnboardingData(): OnboardingData {
  if (typeof window === "undefined") return defaultOnboardingData;
  try {
    const raw = sessionStorage.getItem("onboarding");
    return raw ? JSON.parse(raw) : defaultOnboardingData;
  } catch {
    return defaultOnboardingData;
  }
}

export function clearOnboardingData() {
  sessionStorage.removeItem("onboarding");
}