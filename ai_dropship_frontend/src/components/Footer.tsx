import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AI Dropship Store. All rights reserved.
            {/* Optional: Add builder credit */}
            {/* <span className="ml-2">Built by Your AI Builder Robot.</span> */}
          </div>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/returns" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

