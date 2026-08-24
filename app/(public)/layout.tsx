import React from "react"
import Navbar from "./_components/navbar"

type Props = { children: React.ReactNode }

export default function layout({ children }: Props) {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8">{children}</main>
    </div>
  )
}
