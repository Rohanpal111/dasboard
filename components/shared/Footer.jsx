/**
 * Footer.jsx
 * Shared footer for all authenticated dashboard screens.
 */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="h-12 border-t border-dark-800 bg-dark-950 px-6 flex items-center justify-between text-xs text-dark-500">
      <p>Sunday Hundred Dashboard</p>
      <p>{year} Sunday Hundred. All rights reserved.</p>
    </footer>
  );
}
