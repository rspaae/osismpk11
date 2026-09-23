import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role, Division } from "@/lib/prisma"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            nis?: string | null
            role: Role
            division?: Division | null
            position?: string | null
            kelas?: string | null
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        nis?: string | null
        role: Role
        division?: Division | null
        position?: string | null
        kelas?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        nis?: string | null
        role: Role
        division?: Division | null
        position?: string | null
        kelas?: string | null
    }
}
