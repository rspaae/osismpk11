"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-8 py-4 glass text-[10px] font-black uppercase tracking-[0.3em] text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white transition-all rounded-2xl active:scale-95 shadow-xl shadow-red-500/5"
        >
            Logout Aman
        </button>
    );
}
