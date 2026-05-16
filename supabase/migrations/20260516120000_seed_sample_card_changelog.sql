-- Seed sample changelog entries for cards with documented 2024-2026 changes.
-- Each entry is a JSON object: { date, effective_date, change_type, summary, detail, source_url }
-- Idempotent: replaces the changelog array (does not append).

update public.cards
set changelog = $${\
}$$::jsonb
where slug = '__placeholder_never_matches__';

update public.cards set changelog = '[
  {"date":"2026-01-15","effective_date":"2026-02-01","change_type":"reward","summary":"Transportation rewards capped at ₹10K/month","detail":"ICICI capped Coral transportation MCC rewards at ₹10K/month to limit reward arbitrage. Existing cardholders affected from Feb 1, 2026.","source_url":"https://www.icicibank.com/Personal-Banking/cards/Credit-Card/communication-coral.html"},
  {"date":"2026-01-15","effective_date":"2026-02-01","change_type":"fee","summary":"1% fee on wallet loads ≥ ₹5K/month","detail":"Wallet loads (Amazon Pay, Paytm, MobiKwik) above ₹5K per month now attract 1% transaction fee.","source_url":"https://www.icicibank.com/Personal-Banking/cards/Credit-Card/communication-coral.html"},
  {"date":"2026-01-15","effective_date":"2026-02-01","change_type":"fee","summary":"2% fee on gaming MCC","detail":"Transactions on MCC 5816 (Dream11, MPL, fantasy sports) attract 2% fee.","source_url":"https://www.icicibank.com/Personal-Banking/cards/Credit-Card/communication-coral.html"}
]'::jsonb
where slug = 'icici-coral';

update public.cards set changelog = '[
  {"date":"2026-04-12","effective_date":"2026-05-15","change_type":"reward","summary":"Earn rate change on retail spends","detail":"Retail spend earn rate reduced from 4 RPs to 2 RPs per ₹150 outside of SmartBuy and Regalia partner categories.","source_url":"https://www.hdfcbank.com/personal/about-us/news-room"}
]'::jsonb
where slug = 'hdfc-regalia-gold';

update public.cards set changelog = '[
  {"date":"2024-11-12","effective_date":"2024-11-12","change_type":"benefit","summary":"Vistara → Maharaja Club rebrand","detail":"Post Vistara-Air India merger, Club Vistara points convert to Maharaja Club at 1:1. New bookings via Air India website. Loyalty membership status preserved.","source_url":"https://www.axisbank.com/cards/credit-card/axis-bank-vistara-credit-card"}
]'::jsonb
where slug = 'axis-vistara-signature';

update public.cards set changelog = '[
  {"date":"2026-03-30","effective_date":"2026-07-01","change_type":"benefit","summary":"Lounge access tied to quarterly spend","detail":"From Jul 2026 quarter, complimentary lounge visits require ₹40K spend in the previous quarter. Annual unlimited removed.","source_url":"https://www.indusind.com/in/en/personal/cards/credit-card/pinnacle-world-credit-card.html"}
]'::jsonb
where slug = 'indusind-pinnacle';
