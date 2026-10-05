# Dehumain promotional campaign architecture

Status: design direction only. The public `/campaign` page is an informational preview. No promotional campaign, prize, entry route, Terms acceptance or admin control is live. Do not turn on entries until campaign details and jurisdiction-specific rules have been reviewed and published.

## Product boundary

The NFT is a Membership Pass for ecosystem access. Potential experiences may include gated content, community access, early access, selected perks, partner benefits and future services, but only released benefits should be presented as available. Promotional campaigns are separate. Buying or holding an NFT must not automatically create a campaign entry or promise a prize.

The standard campaign route should allow a participant to join, read and accept that campaign's current rules, complete its published free qualification, and receive eligible campaign entries without owning an NFT. `membership_multiplier_enabled` defaults to `false`; hide all multiplier language while it is disabled. Any future multiplier requires a specific campaign rule and review before activation. Keep long-term ecosystem points and per-campaign entries as separate records and balances.

## Configuration and lifecycle

Each campaign has a stable ID and configurable name, description, countries, minimum age, dates, eligibility, tasks, points, campaign entries, referrals, membership benefits, winner count, free-entry route, announcements and status. Prize configuration uses `prize_title`, `prize_value`, `prize_currency`, `prize_description`, `prize_type`, `prize_status`, `prize_verified`, `prize_funding_status` and `prize_replacement_allowed`; never hard-code a prize amount. Prize status moves through `DRAFT`, `ANNOUNCED`, `CONFIRMED`, `VERIFIED` and `AWARDED` as appropriate. Public copy must not call a prize confirmed, funded or guaranteed before the matching administrative evidence and status exist.

Admins need separate controls to pause new entries, tasks, referrals and any NFT multiplier; pause or close the campaign; and cancel it. These actions should stop activity without erasing historical data. Cancellation requires a reason, a second confirmation, a timestamp, a public notice and an audit record. Use authenticated, role-restricted admin access, with server-side authorization on every mutation. A public website form must never be able to change campaign configuration.

## Data and audit model

Store immutable campaign-configuration revisions rather than overwriting prior settings. Store each published Terms version with version number, publication and effective dates, previous-version reference, amendment reason, responsible admin and full text. Every accepted entry should record the user ID, campaign ID, accepted Terms version, acceptance and entry timestamps, and proportionate session or IP evidence where appropriate. Keep task completions, referrals, points transactions, campaign entries, admin actions and winner records in distinct append-only records. Participants need access to the Terms version that governed their own entry.

Material-change notices should support a website banner, dashboard notice and an optional email path, with an announcement timestamp, effective date, summary and link to full rules. Announcements must reflect the actual changes recorded in the version history. The existing mint waitlist table is not a campaign participant table and must not be migrated into one automatically.

## Draft rules language for review

The following is source text supplied for the proposed campaign policy, **not published Campaign Rules**:

> **Modification, Suspension and Cancellation**  
> Dehumain may amend, suspend, postpone or cancel a Campaign where reasonably necessary because of fraud, abuse, manipulation, bot activity, security incidents, technical or smart-contract failures, system errors, exploits, legal or regulatory requirements, changes in applicable law, force majeure, circumstances beyond its reasonable control, or circumstances materially affecting the fairness, integrity or lawful operation of the Campaign. Reasonable operational and non-material changes may also be made. Material changes affecting eligibility, entry mechanics, prizes, dates, NFT-related benefits, winner selection or participant rights should be communicated through official channels. Where reasonably practicable, material changes should not be applied retrospectively in a way that materially disadvantages valid entrants.

> If an advertised prize becomes unavailable or cannot reasonably be provided for reasons beyond Dehumain's reasonable control, it may be replaced with one of equal or greater stated value, subject to applicable law. An ordinary reduction in campaign cost is not a reason to reduce a published prize.

> In exceptional circumstances where a Campaign cannot continue fairly, securely or lawfully, Dehumain may suspend or cancel it. Where reasonably practicable, Dehumain will publish an explanation. Existing-participant obligations following cancellation will be handled under the published Campaign Rules and applicable law.

Final rules need campaign-specific dates, jurisdictions, ages, prize details, entry method, winner selection, claim process, privacy terms and applicable-law review before publication. Do not treat this design document as a live agreement.
