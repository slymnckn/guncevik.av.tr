"use client"

import type React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { signOut } from "@/actions/auth-actions"

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onOpenChange }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Çıkış Yapmak İstediğinize Emin Misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Hesabınızdan çıkış yapmak üzeresiniz. Devam etmek istediğinize emin misiniz?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await signOut()
              onOpenChange(false)
            }}
          >
            Çıkış Yap
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogoutModal
