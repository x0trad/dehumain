export default function Home() {
  return (
    <>
      <main aria-label="Dehumain membership and identity">
        <section className="landing" aria-labelledby="dehumain-title" id="top">
          <img className="portrait" src="/assets/dehumain.jpg" alt="A human portrait emerging from a dark background." />
          <div className="identity">
            <h1 id="dehumain-title">dehumain</h1>
            <div className="mint-area home-actions">
              <a className="mint" href="/waitlist">Join waitlist</a>
              <a className="secondary-link" href="/mint/index.html">View mint</a>
            </div>
          </div>
        </section>
        <section className="lore" aria-labelledby="lore-title">
          <p className="lore-label">Dehumain token · Robinhood Chain</p>
          <h2 id="lore-title">An identity today.<br />An intelligence tomorrow.</h2>
          <div className="lore-copy">
            <p>Dehumain begins with one token bringing a population together. After graduation, qualifying holders can mint a distinct identity in the founding NFT collection.</p>
            <p>The NFT is a Membership Pass for the Dehumain ecosystem. It represents your identity and may open access to future member experiences as they are released.</p>
            <p>AI-agent activation is a separate choice. When an agent type becomes available, a holder may choose to pair it with their NFT under the published activation terms.</p>
          </div>
          <p className="lore-ending">One token. Many identities.<br />A membership that can grow.</p>
        </section>
        <section className="paths" id="membership" aria-labelledby="paths-title">
          <div className="paths-heading"><p className="lore-label">Two distinct paths</p><h2 id="paths-title">Belong to the world.<br />Join a campaign by choice.</h2><p>The Dehumain Membership Pass and promotional campaigns have different purposes and separate rules.</p></div>
          <div className="paths-grid">
            <article className="path-card"><span className="path-number">01 / MEMBERSHIP</span><h3>Your Dehumain identity.</h3><p>The NFT is a Membership Pass. Planned experiences may include gated content, community access, early access, selected perks, partner benefits and future services. Specific benefits will be announced before they become available.</p><a href="/mint/">Explore the planned mint <span aria-hidden="true">↗</span></a></article>
            <article className="path-card"><span className="path-number">02 / PROMOTIONS</span><h3>A separate invitation.</h3><p>Promotional campaigns will have their own published rules, eligibility and free participation route. Holding or buying a Membership Pass does not automatically enter a campaign or guarantee a prize.</p><a href="/campaign">How campaigns will work <span aria-hidden="true">↗</span></a></article>
          </div>
        </section>
        <section className="swarm" aria-labelledby="swarm-title">
          <header className="swarm-heading"><p className="lore-label">The journey</p><h2 id="swarm-title">From token<br />to active agent.</h2><p>Mint your identity first. Choose to activate it when an agent is released.</p></header>
          <ol className="launch-flow">
            <li><span>01 / TOKEN</span><h3>Dehumain token launches</h3><p>The shared token at the beginning of the Dehumain journey.</p></li>
            <li><span>02 / GRADUATION</span><h3>Holder mint opens</h3><p>After graduation, hold US$5 in Dehumain token to qualify for one free mint per eligible wallet, while supply lasts.</p></li>
            <li><span>03 / MEMBERSHIP</span><h3>Mint your Dehumain</h3><p>Your NFT is your Membership Pass. First eligible mint: free. Additional mints: US$5 in ETH each. Gas is paid separately.</p></li>
            <li><span>04 / ACTIVATION</span><h3>Choose an AI agent</h3><p>Once available, pair your NFT with a released agent type.</p></li>
          </ol>
        </section>
        <section className="sovereigns" aria-labelledby="agents-title">
          <header className="lineage-heading"><p className="lore-label">Planned releases · Dehumain token market cap</p><h2 id="agents-title">More milestones.<br />More intelligence.</h2><p>A new AI-agent type at US$100k, US$300k, and each additional US$200k.</p></header>
          <ol className="agent-milestones">
            <li><span>US$100k</span><h3>Agent type 01</h3><p>First planned release</p></li>
            <li><span>US$300k</span><h3>Agent type 02</h3><p>The next capability</p></li>
            <li><span>US$500k</span><h3>Agent type 03</h3><p>The range expands</p></li>
            <li><span>+ US$200k</span><h3>More agent types</h3><p>US$700k, US$900k…</p></li>
          </ol>
        </section>
      </main>
      <footer className="footer"><a className="footer-wordmark" href="#top">dehumain</a><p>Artificial origins. Shared creation.</p><a className="footer-link" href="/campaign">Campaigns</a><span className="footer-copyright">© 2026 dehumain</span></footer>
    </>
  );
}
