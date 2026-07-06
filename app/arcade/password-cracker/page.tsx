import type { Metadata } from "next";
import PasswordCracker from "@/modules/arcade/games/password-cracker";

export const metadata: Metadata = {
  title: "Password Cracker Simulator | Cyber Nexus Arcade",
  description:
    "Educational password strength analyzer with real-time entropy, cracking estimates, character diversity, pattern detection, and personalized improvement tips.",
};

export default function Page() {
  return <PasswordCracker />;
}
