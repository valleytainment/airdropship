// src/components/layout/Footer.tsx
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by Your AI Builder Robot. &copy; {new Date().getFullYear()} AI Dropship Store.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/returns"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Return Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

