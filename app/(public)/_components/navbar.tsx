import { UserButton } from "@/components/auth/user/user-button"
import { ModeToggle } from "@/components/mode-toogle"
import { auth } from "@/lib/auth"
import { BookOpenIcon, HomeIcon, LayoutDashboardIcon } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"

const navigationItems: { name: string; href: string }[] = [
  {
    href: "/",
    name: "home",
  },
  {
    href: "/courses",
    name: "Courses",
  },
  {
    href: "/dashboard",
    name: "dashboard",
  },
]

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <span className="font-bold">LMS.</span>
        </Link>

        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              return (
                <Link
                  href={item.href}
                  key={item.name}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />

            {session?.user ? (
              <UserButton
                size="icon"
                links={[
                  { href: "/", label: "Home", icon: <HomeIcon /> },
                  {
                    href: "/courses",
                    label: "Courses",
                    icon: <BookOpenIcon />,
                  },
                  {
                    href: "/dashboard",
                    label: "Dashboard",
                    icon: <LayoutDashboardIcon />,
                  },
                ]}
              />
            ) : (
              <Link
                href="/auth/sign-in"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
