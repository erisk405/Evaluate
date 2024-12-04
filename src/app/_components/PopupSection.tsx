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
export function ProfilePopup() {
  const { showProfile, setShowProfile } = useStore();

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
      <DialogContent className="sm:max-w-[600px] p-1 sm:rounded-lg overflow-hidden">
        <Myprofile />
      </DialogContent>
    </Dialog>
  );
}
export function NotificationPopup() {
  const { showNotifications, setShowNotifications } = useStore();

  useEffect(() => {
    // ที่ทำแบบนี้เพราะมันไม่รู้เป็นไรของมัน พอใช้กับ Dialog ร่วมกับ sidebar นี้มันแล้วกดปิด dialog ลงมันไม่clear pointer-eventsออกให้ แล้วที่นี้กูก็คลิกไรไม่ได้ แม่ง
    // หงุดหงิดว่ะ
    // console.log("Dialog state:", showProfile);โ
    if (showNotifications) {
      // ลบ pointer-events ออกจาก body
      document.body.style.removeProperty("pointer-events");
    }
  }, [showNotifications]);
  return (
    <Dialog
      open={showNotifications}
      onOpenChange={(isOpen) => setShowNotifications(isOpen)}
    >
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
      <DialogContent className="sm:max-w-[600px] p-1 sm:rounded-lg overflow-hidden">
        <NotificationSection
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
      </DialogContent>
    </Dialog>
  );
}
