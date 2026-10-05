import type { Metadata } from "next";
import Link from "next/link";
import { CampaignTicket } from "./ticket";

export const metadata: Metadata = {
  title: "Promotional campaigns · Dehumain",
  description: "How Dehumain promotional campaigns will work alongside NFT membership. No campaign is accepting entries yet.",
};

export default function CampaignPage() {
  return (
    <div className="campaign-page">
      <nav className="wl-nav" aria-label="Campaign navigation">
        <Link className="wl-wordmark" href="/">dehumain</Link>
        <Link className="wl-back" href="/">Return to origin</Link>
      </nav>

      <main className="campaign-main">
        <header className="campaign-hero">
          <div className="campaign-hero-copy">
            <p className="wl-kicker">Promotional campaigns / A separate path</p>
            <span className="campaign-status"><span aria-hidden="true" /> No campaign is open for entries</span>
            <h1>Campaigns evolve.<br /><em>Fairness remains.</em></h1>
            <p>Dehumain campaigns will be separate from the NFT Membership Pass. Each campaign will publish its own rules, eligibility, dates, entry method and prize details before participation opens.</p>
          </div>
          <CampaignTicket />
        </header>

        <section className="campaign-distinction" aria-labelledby="campaign-distinction-title">
          <div className="campaign-section-heading"><p className="wl-kicker">Know what you are joining</p><h2 id="campaign-distinction-title">Membership and participation are distinct.</h2></div>
          <div className="campaign-distinction-grid">
            <article><span>01 / THE NFT</span><h3>A Membership Pass</h3><p>Your Dehumain NFT represents an identity in the ecosystem. Potential membership experiences will be announced as they become available. An NFT purchase does not itself create a promotional campaign entry.</p><Link href="/mint/">Explore the mint <span aria-hidden="true">↗</span></Link></article>
            <article><span>02 / THE CAMPAIGN</span><h3>Its own published rules</h3><p>A promotional campaign is a separate invitation. Its entry requirements, free participation route and any prize will appear in that campaign’s published rules before entries open.</p><p className="campaign-inline-note">No prize, entry boost or NFT membership multiplier is currently announced here.</p></article>
          </div>
        </section>

        <section className="campaign-route" aria-labelledby="campaign-route-title">
          <div className="campaign-section-heading"><p className="wl-kicker">The planned entry route</p><h2 id="campaign-route-title">A place for everyone to begin.</h2><p>When a campaign opens, the standard route will allow participation without owning an NFT.</p></div>
          <ol>
            <li><span>01</span><h3>Join Dehumain</h3><p>Create or use an account when campaign registration becomes available.</p></li>
            <li><span>02</span><h3>Read the current rules</h3><p>See the campaign’s eligibility, dates, prize and rules version before accepting them.</p></li>
            <li><span>03</span><h3>Qualify for free</h3><p>Complete the published free participation route for that campaign.</p></li>
            <li><span>04</span><h3>See your entry</h3><p>Eligible campaign entries will be tracked separately from long-term Dehumain Points.</p></li>
          </ol>
          <p className="campaign-route-note">This is a preview of the intended flow. Registration and campaign entries are not open.</p>
        </section>

        <section className="campaign-integrity" aria-labelledby="campaign-integrity-title">
          <p className="wl-kicker">How change will be handled</p>
          <h2 id="campaign-integrity-title">Clear rules. Visible updates.</h2>
          <p>Operational, technical, security, legal or fairness issues can require a campaign to change, pause or close. Material updates to eligibility, entry mechanics, dates, prizes, NFT-related benefits, winner selection or participant rights will be communicated through official Dehumain channels and handled under the applicable published Campaign Rules.</p>
          <p>Each rules update is intended to have its own version and effective date, with earlier versions available to participants. Where reasonably practicable, material changes should not be applied retrospectively in a way that materially disadvantages people who have already validly entered.</p>
          <div className="campaign-rules-note"><strong>Rules are not yet published.</strong><span> No promotional campaign is accepting entries, and this overview does not create an entry or promise a prize. The published rules for each campaign will govern when it opens.</span></div>
        </section>
      </main>

      <footer className="footer"><Link className="footer-wordmark" href="/">dehumain</Link><p>Artificial origins. Shared creation.</p><Link className="footer-link" href="/waitlist">NFT mint waitlist</Link><span className="footer-copyright">© 2026 dehumain</span></footer>
    </div>
  );
}
