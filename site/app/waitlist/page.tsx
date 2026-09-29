import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "./waitlist-form";

export const metadata: Metadata = { title: "Join the Dehumain waitlist", description: "Register your X account and wallet for the Dehumain mint waitlist." };

export default function WaitlistPage() {
  return (
    <div className="wl-shell">
      <nav className="wl-nav" aria-label="Waitlist navigation"><Link className="wl-wordmark" href="/">dehumain</Link><Link className="wl-back" href="/">Return to origin</Link></nav>
      <main className="wl-main">
        <p className="wl-kicker">Founding population · Waitlist</p>
        <h1 className="wl-title">Enter before the identities awaken.</h1>
        <p className="wl-intro">Complete the social steps, register one X account with one wallet, and receive your personal waitlist card. Your entry remains pending until the actions are verified.</p>
        <div className="wl-layout">
          <ol className="wl-steps" aria-label="Waitlist steps">
            <li className="wl-step"><div><h2>Follow the signal</h2><p>Follow the official Dehumain account on X.</p><a className="wl-action" href="https://x.com/intent/follow?screen_name=DehumAinVerse" target="_blank" rel="noreferrer">Follow @DehumAinVerse</a></div></li>
            <li className="wl-step"><div><h2>Support the campaign post</h2><p>Open the official account, then like and repost the pinned waitlist post once.</p><a className="wl-action" href="https://x.com/DehumAinVerse" target="_blank" rel="noreferrer">Open campaign post</a></div></li>
            <li className="wl-step"><div><h2>Register your identity</h2><p>Submit the X username and wallet that you will use for minting.</p></div></li>
            <li className="wl-step"><div><h2>Reply with your card</h2><p>Download the card we generate and attach it as one reply to the official waitlist post.</p></div></li>
          </ol>
          <WaitlistForm />
        </div>
      </main>
    </div>
  );
}
