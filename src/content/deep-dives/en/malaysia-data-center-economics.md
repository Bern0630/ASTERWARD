---
title: "Malaysia Data-Center Economics: From MW Growth to Unit Returns"
date: 2026-09-16
updated: 2026-09-17
type: "deep-dive"
summary: "The central question for Malaysian data centers is no longer how many megawatts are announced. It is whether power, tenants, construction cost, utilization and finance can produce returns above the cost of capital."
tags:
  - Malaysia
  - Data Centers
  - Unit Economics
  - Power Infrastructure
  - Project Finance
lang: "en"
translationKey: "deep-dive-malaysia-data-center-economics"
---

> Data updated through September 17, 2026, 15:00 Asia/Taipei. Sources use different capacity definitions; this report separates planned, under-construction, power-contracted, energized, pre-leased and utilized capacity.

## Investment Thesis

Malaysia has become an important node in Southeast Asia's data-center expansion, but capacity growth is not the same as growth in capital returns. The sustainable thesis is that a data center secures reliable and competitive power, completes construction on time, uses long contracts with high-quality tenants to improve financeability, and generates a return on invested capital above its weighted average cost of capital after utilization ramps.

MIDA reported RM385.7 billion of data-center-related investment from 2021 through the first half of 2026 and projected electricity demand above 5,000 MW by 2035. It also cited an industry estimate of approximately 4.6 GW of planned or under-construction capacity. Separately, 49 electricity supply agreements carry 7.1 GW of maximum demand phased over five to ten years, while confirmed actual load was approximately 710 MW in September 2025.

All three figures can be accurate while implying very different near-term cash flows. The 4.6 GW pipeline is not financed capacity, 7.1 GW of maximum contracted demand is not simultaneous load, and 710 MW is not necessarily all national operational IT load. Research must move from headline megawatts to stage conversion and unit economics.

## Capacity Ladder

| Stage | Core question | Financial meaning |
| --- | --- | --- |
| Announced or planned | Are land, permits and a feasible power plan secured? | No financeable cash flow yet |
| Power-secured | What are the connection date, maximum demand, tariff and pass-through? | Lower delivery risk, but not necessarily financed |
| Financing-secured | What are loan-to-value, rate, maturity, guarantees and completion terms? | Determines construction and equity needs |
| Under construction | What are schedule, overruns, equipment lead times and contractor risk? | Construction interest continues to accrue |
| Pre-leased | What are tenant credit, lease length, minimum payment and commencement terms? | Improves debt capacity |
| Energized | Can the grid, substations, cooling and network deliver? | Revenue can begin |
| Utilized | What are IT load, rack density and actual utilization? | Determines revenue, margin and cash recovery |

The common market error is to treat an earlier-stage megawatt as a final-stage megawatt. The useful variables are the conversion rates from announcement into power, finance, pre-leasing, energization and utilization, and the additional capital required at each stage.

## Revenue Model

Data-center revenue can come from wholesale leases, colocation racks, power capacity, cross-connects, network services, cloud services and GPU as a service. Closer to real estate, revenue tends to be steadier and depends on energized capacity, rent, lease duration and utilization. Closer to compute services, growth and margins can be higher, but depreciation, software competition and technology obsolescence become more important.

A basic revenue model is:

```text
Leasable IT load
× pre-lease rate
× actual lease commencement
× utilization
× unit rent or compute revenue
= operating revenue
```

Pre-leasing is not actual lease commencement. A tenant can sign during construction, while rent begins only after power, acceptance and equipment installation. A six-month power delay increases construction interest while postponing revenue, producing a material decline in debt-service coverage relative to underwriting.

## Cost Model

Capital spending includes land, buildings, substations, transmission and distribution, backup generation, mechanical and electrical systems, cooling, water treatment, fire protection, security, fiber and server space. If the operator also owns GPUs, equipment and real estate require separate models because their economic lives and residual values differ sharply.

Operating costs include power, cooling, water, maintenance, labor, networks, insurance, leases and taxes. High-density AI racks raise revenue per square meter but also increase power and cooling requirements. Better power usage effectiveness can reduce non-IT electricity, while heat, humidity and water constraints can still raise cost.

Malaysia's advantages include location, industrial land, policy support and relatively competitive costs. Its constraints are that generation, gas, transmission, substations, renewable supply and water must expand together. The energy regulator identified a roughly 9 GW gas-generation gap to be filled by 2032. A data center is therefore not only a property investment. It is a long-term claim on the national power system.

## Unit Economics

The economic value of each megawatt requires at least six groups of metrics: construction cost, stabilized revenue, operating margin, maintenance capex, weighted average cost of capital and asset life. Comparing only investment per megawatt ignores major differences in tenant quality, rack density, utilization, tariffs and finance.

A practical sequence is:

1. Determine whether construction cost per megawatt includes land, grid access and financing.
2. Identify whether revenue per megawatt uses signed maximum demand, energized capacity or actual load.
3. Test whether power costs can be passed through fully and whether price or volume is capped.
4. Estimate time to stabilized utilization and whether rent commencement depends on equipment move-in.
5. Include maintenance capex for cooling, batteries, networks and equipment replacement.
6. Compare stabilized return on invested capital with the weighted average cost of capital and retain a delay buffer.

If returns exceed the cost of capital only under simultaneous full utilization, low rates and a high terminal value, reported growth does not create economic value.

## Who Pays

Ultimate payers include hyperscalers such as AWS, Microsoft and Google, enterprises, AI companies, governments and telecommunications customers. Credit analysis must identify the contracting entity, parent guarantee, minimum purchase, prepayment, take-or-pay, early termination and residual-value terms.

A brand name cannot replace contract analysis. A regional subsidiary, reseller or compute platform can have weaker credit than the parent. The same end demand may also be recorded as committed by a cloud provider, GPU platform, data center and equipment supplier. Without verified usage and payment obligations, demand can be double counted.

## Who Borrows and Who Bears Credit Risk

Borrowers can be data-center developers, REITs, infrastructure funds, utilities, telecommunications companies, project companies or GPU special-purpose vehicles. Funding sources include bank construction loans, corporate bonds, sukuk, project finance, private credit, leases and equity.

Credit risk depends on recourse. Non-recourse project finance leaves lenders exposed to tenants, utilization and residual value. Parent guarantees return risk to the corporate balance sheet. If utilities build the grid before demand arrives, some exposure can migrate to ratepayers or government. Analysis must look beyond the visible data-center owner to identify the ultimate risk bearer.

## Capital Structure

A sound structure uses long-dated fixed-rate finance, phased investment, conservative loan-to-value, sufficient debt-service coverage, explicit completion support and meaningful high-quality pre-leasing before construction. Real estate and short-lived equipment should be financed separately rather than using a 15- to 25-year building life to support slow amortization of rapidly depreciating GPUs.

A weak structure buys land and equipment with short-dated floating-rate debt while assuming utilization, rent, asset values and rate cuts improve together. Supplier finance, circular prepayments, cross-holdings and unconsolidated special-purpose companies can further understate economic leverage.

After the Fed hike, US long yields were near 5%. Malaysia's ten-year government yield was approximately 4.17% on September 15, while the OPR was 2.75%. A stable OPR only means that domestic policy rates have not moved with the Fed. It does not neutralize dollar funding, project spreads, imported equipment and currency risk.

## Beneficiaries and Cost Bearers

The earliest beneficiaries are transmission and distribution, transformers, backup generation, gas supply, construction, cooling, fiber and industrial property. Banks gain loan growth and fee income but accept construction, concentration and refinancing risk. REITs can add long leases while facing higher cap rates and equity dilution.

Upstream oil and gas and gas infrastructure can benefit from new generation. Ratepayers and government must address grid investment, reserve capacity, subsidies and tariff allocation. If data centers receive preferential tariffs or grid priority, industry benefits and social costs may fall on different groups.

## Scenario Analysis

**Bull case:** Generation, transmission and substations arrive on time. Anchor tenants sign long leases and minimum-payment commitments, while actual load rises steadily from 710 MW. Projects use fixed-rate funding or hedges, the ringgit is stable, and power costs pass through. Announced capacity becomes energized, utilized and cash-generating, producing returns above the cost of capital.

**Base case:** Demand remains intact, but power and construction create phased commissioning. High-quality projects secure financing while marginal projects are delayed. Construction and equipment orders continue to grow, but asset returns diverge and the market shifts from investment totals toward pre-leasing, commencement, utilization and debt capacity.

**Bear case:** Long yields and ringgit funding costs remain high, grid or gas supply is delayed, and tenants postpone move-in. Utilization undershoots underwriting, while asset and equipment residual values decline. Developers must raise equity, sell assets or restructure debt, and grid capital already deployed by utilities faces a cost-recovery problem.

## Leading Indicators

1. Planned, power-secured, financed, under-construction, pre-leased, energized and utilized megawatts.
2. Actual load relative to the 710 MW baseline, not only 7.1 GW of maximum contracted demand.
3. Pre-leasing, actual rent commencement, weighted average lease expiry and top-five tenant concentration.
4. Construction cost per megawatt, overruns, schedule and capitalized interest.
5. Power usage effectiveness, water usage effectiveness, tariffs and pass-through provisions.
6. Net operating income, free cash flow, return on invested capital and weighted average cost of capital.
7. Loan-to-value, debt-service coverage, interest coverage, fixed-rate share and maturity walls.
8. Malaysian government yields, the ringgit, bank lending standards and project-finance spreads.

## Conclusion

The Malaysian data-center growth thesis is valid, but returns will not be distributed evenly. The next question is not how many megawatts are announced. It is how much capital each megawatt requires, when payment begins, who bears power and financing risk, and whether stabilized returns exceed the cost of capital.

The most valuable companies will not necessarily announce the largest investment. They will align land, power, tenants and long-term funding on the same schedule, while disclosing capacity stages, utilization, cash flow and credit metrics. A megawatt is a physical unit. It becomes an economic asset only after financing, energization, utilization and collection.

## Sources

- Malaysian Investment Development Authority, "MIDA Charts Next Phase for Malaysia's Data Centre Sector", September 14, 2026, https://www.mida.gov.my/media-release/mida-charts-next-phase-for-malaysias-data-centre-sector-from-attracting-investment-to-building-value-for-smes-and-malaysians/
- Malaysian Investment Development Authority, "Malaysia's Digital Backbone", March 2026, https://www.mida.gov.my/wp-content/uploads/2026/03/MIDA_IPR.2025.pdf
- Energy Commission of Malaysia, "ST Highlights Resilient Energy Sector in 2025 and Challenging Outlook in 2026", April 1, 2026, https://www.st.gov.my/energy-commission-malaysia-st-highlights-resilient-energy-sector-2025-and-challenging-outlook-2026
- Reuters, "Malaysia's data centres guzzling more power as temperatures soar, officials say", September 8, 2026, https://www.marketscreener.com/news/malaysia-s-data-centres-guzzling-more-power-as-temperatures-soar-officials-say-ce785bd8d880f027
- Bank Negara Malaysia, "Monetary Policy Statement", September 3, 2026, https://www.bnm.gov.my/-/monetary-policy-statement-03092026
- Bank Negara Malaysia Financial Markets, "Market Rates", September 15, 2026, https://financialmarkets.bnm.gov.my/data-download-opr
- Department of Statistics Malaysia, "Gross Domestic Product Second Quarter 2026", August 14, 2026, https://www.dosm.gov.my/portal-main/release-content/gross-domestic-product-q22026
