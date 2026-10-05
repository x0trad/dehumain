import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "./waitlist-form";

export const metadata: Metadata = { title: "Enter the Dehumain origin register", description: "Register your X account and wallet before the first Dehumain identities awaken." };

export default function WaitlistPage() {
  return (
    <div className="wl-shell">
      <nav className="wl-nav" aria-label="Waitlist navigation"><Link className="wl-wordmark" href="/">dehumain</Link><Link className="wl-back" href="/">Return to origin</Link></nav>
      <main className="wl-main">
        <p className="wl-kicker">The origin register · Before the first mint</p>
        <h1 className="wl-title">Every identity begins somewhere.</h1>
        <p className="wl-intro">Before the first Dehumain Membership Passes are minted, we are recording the people who found the signal. Add your X account and wallet to the origin register. Your card marks your interest in the NFT mint; your social steps are reviewed manually before waitlist eligibility is confirmed.</p>
        <p className="wl-separation">The origin register is for the NFT mint. <Link href="/campaign">Promotional campaigns</Link> have separate rules and entries.</p>
        <div className="wl-layout">
          <ol className="wl-steps" aria-label="Waitlist steps">
            <li className="wl-step"><div><h2>Find the signal</h2><p>Follow the official Dehumain account on X.</p><a className="wl-action" href="https://x.com/intent/follow?screen_name=DehumAinVerse" target="_blank" rel="noreferrer">Follow @DehumAinVerse</a></div></li>
            <li className="wl-step"><div><h2>Carry it forward</h2><p>Like and repost the official origin-register post once.</p><a className="wl-action" href="https://x.com/DehumAinVerse" target="_blank" rel="noreferrer">Open official X account</a></div></li>
            <li className="wl-step"><div><h2>Record your origin</h2><p>Link your X username to the wallet you intend to use when minting opens.</p></div></li>
            <li className="wl-step"><div><h2>Show your mark</h2><p>Download your issued card and attach it as one reply to the official post.</p></div></li>
          </ol>
          <WaitlistForm />
        </div>
      </main>
    </div>
  );
}
