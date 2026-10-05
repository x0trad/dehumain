"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Result = { cardCode: string; xHandle: string; status: string };

export default function WaitlistForm() {
  const openedAt = useRef(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => { openedAt.current = Date.now(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ xHandle: form.get("xHandle"), walletAddress: form.get("walletAddress"), completed: form.get("completed") === "on", website: form.get("website"), openedAt: openedAt.current }) });
      const data = await response.json() as Result & { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to join the waitlist.");
      setResult(data);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to join the waitlist.");
    } finally {
      setLoading(false);
    }
  }

  function downloadCard() {
    if (!result) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 628;
    const context = canvas.getContext("2d");
    if (!context) return;
    const gradient = context.createRadialGradient(930,155,20,930,155,550);
    gradient.addColorStop(0,"#393322"); gradient.addColorStop(1,"#10110f");
    context.fillStyle=gradient; context.fillRect(0,0,1200,628);
    context.strokeStyle="#7d704f"; context.lineWidth=2; context.strokeRect(32,32,1136,564);
    context.fillStyle="#cdb67e"; context.font="24px ui-monospace, monospace"; context.fillText("DEHUMAIN · ORIGIN REGISTER",82,112);
    context.fillStyle="#f2eee5"; context.font="104px 'Apple Garamond', Georgia, serif"; context.fillText("founding identity",78,330);
    context.fillStyle="#b8b6ad"; context.font="30px -apple-system, sans-serif"; context.fillText(result.xHandle,84,402);
    context.fillStyle="#dcc78f"; context.font="26px ui-monospace, monospace"; context.fillText(result.cardCode,84,514);
    context.save();
    context.translate(994,414);
    context.rotate(-Math.PI / 15);
    context.strokeStyle="#ddc990"; context.lineWidth=5; context.beginPath(); context.arc(0,0,125,0,Math.PI*2); context.stroke();
    context.lineWidth=1.5; context.beginPath(); context.arc(0,0,111,0,Math.PI*2); context.stroke();
    context.fillStyle="#e6d5a9"; context.textAlign="center"; context.font="700 27px ui-monospace, monospace"; context.fillText("REGISTERED",0,3);
    context.font="16px ui-monospace, monospace"; context.fillText("ORIGIN CARD",0,38);
    context.restore();
    const link=document.createElement("a"); link.download=`dehumain-${result.cardCode.toLowerCase()}.png`; link.href=canvas.toDataURL("image/png"); link.click();
  }

  if (result) return (
    <section className="wl-panel wl-success" aria-labelledby="waitlist-card-title">
      <div className="wl-card"><span className="wl-card-top">Dehumain · Origin register</span><h3 id="waitlist-card-title">founding identity</h3><p>{result.xHandle}</p><span className="wl-card-stamp" aria-label="Origin card registered"><strong>REGISTERED</strong><small>ORIGIN CARD</small></span><span className="wl-card-code">{result.cardCode}</span></div>
      <p className="wl-panel-copy">Your mint waitlist registration is recorded. The X steps are pending manual review. Download the card, then attach it as one reply to the official post. This card is not a promotional campaign entry.</p>
      <div className="wl-success-actions"><button type="button" onClick={downloadCard}>Download card</button><a href="https://x.com/DehumAinVerse" target="_blank" rel="noreferrer">Open X to reply</a></div>
    </section>
  );

  return (
    <section className="wl-panel" aria-labelledby="waitlist-form-title">
      <h2 id="waitlist-form-title">Enter the register</h2><p className="wl-panel-copy">Link one X account to one wallet. We will issue a card for this identity.</p>
      <form className="wl-form" onSubmit={submit}>
        <label className="wl-field"><span>X username</span><input name="xHandle" autoComplete="off" placeholder="@username" maxLength={16} required /></label>
        <label className="wl-field"><span>Wallet address</span><input name="walletAddress" autoComplete="off" placeholder="0x…" minLength={42} maxLength={42} required /></label>
        <label className="wl-check"><input name="completed" type="checkbox" required /><span>I followed @DehumAinVerse and liked and reposted the official waitlist post.</span></label>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position:"absolute",left:"-9999px"}} />
        <button className="wl-submit" type="submit" disabled={loading}>{loading ? "Recording identity…" : "Record my origin"}</button>
        <p className="wl-status" data-kind={error ? "error" : "info"} aria-live="polite">{error || "This is the NFT mint waitlist, separate from any promotional campaign. Mint eligibility depends on the published mint rules and manual review of the X steps."}</p>
        <p className="wl-rules">No purchase is required to join. One entry per person, X account and wallet. Multiple-account entries and repeated replies are ineligible. Never submit a seed phrase or private key.</p>
      </form>
    </section>
  );
}
