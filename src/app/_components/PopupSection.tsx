"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Myprofile from "./Myprofile";
import NotificationSection from "./NotificationSection";
import useStore from "../store/store";
import { useEffect } from "react";
import { useThemeStyles } from "@/hooks/useTheme";
export function ProfilePopup() {
  const { showProfile, setShowProfile } = useStore();
  const styles = useThemeStyles()

  useEffect(() => {
    // ที่ทำแบบนี้เพราะมันไม่รู้เป็นไรของมัน พอใช้กับ Dialog ร่วมกับ sidebar นี้มันแล้วกดปิด dialog ลงมันไม่clear pointer-eventsออกให้ แล้วที่นี้กูก็คลิกไรไม่ได้ แม่ง
    // หงุดหงิดว่ะ
    // console.log("Dialog state:", showProfile);
    if (showProfile) {
      // ลบ pointer-events ออกจาก body
      document.body.style.removeProperty("pointer-events");
    }
  }, [showProfile]);
  return (
    <Dialog
      open={showProfile}
      onOpenChange={(isOpen) => setShowProfile(isOpen)}
    >
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
      <DialogContent className={`sm:max-w-[550px] p-1 sm:rounded-lg overflow-hidden border-zinc-700 ${styles.background_popup}`}>
        <Myprofile />
      </DialogContent>
    </Dialog>
  );
}
export function NotificationPopup() {
  const { showNotifications } = useStore();

  const styles = useThemeStyles();
  return (
    <div
      className={`fixed opacity-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden ${
        styles.background
      } shadow-lg sm:max-w-[600px] w-full p-1 sm:rounded-lg ${
        showNotifications
          ? " opacity-1 visible scale-100 z-50"
          : "scale-90 invisible opacity-0"
      } z-50 transition-all`}
    >
      <NotificationSection />
    </div>
  );
}
