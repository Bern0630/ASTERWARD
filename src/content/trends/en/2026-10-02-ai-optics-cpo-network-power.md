---
title: "AI Must Move Data, Not Just Compute Faster"
date: 2026-10-02T12:00:00+08:00
type: "trend"
lang: "en"
translationKey: "2026-10-02-ai-optics-cpo-network-power"
summary: "As more GPUs work together, the bottleneck extends from individual chips to data movement. This article connects optical networking, CPO, substrates, and power demand while separating proven revenue from technology still under validation."
tags: ["AI", "Optical Networking", "CPO", "Silicon Photonics", "Data Centers", "Supply Chain"]
author: "ASTERWARD"
---

As AI systems grow, the question is no longer only whether an individual GPU can compute fast enough. Thousands of GPUs must also exchange data on time.

When networking falls behind, expensive processors can sit idle. When transmission power and heat keep rising, a data center cannot solve the problem simply by installing more equipment. The AI infrastructure upgrade is therefore spreading from compute chips into switches, optical modules, lasers, fiber, connectors, packaging, and power systems.

That does not mean every link will immediately become optical, or that every company associated with co-packaged optics already earns CPO revenue. The useful questions are narrower: What problem does the technology solve? What stage has the product reached? Have the revenue and profit appeared in reported results?

> Data in this article is current through October 2, 2026, Taiwan time. Companies are discussed as research examples, not investment recommendations or stock-price forecasts.

## The One-Minute View

1. **AI bottlenecks are expanding from computation to data movement.** As GPU counts rise, bandwidth, latency, connection density, and energy per bit all affect system efficiency.
2. **Optical networking, silicon photonics, and CPO are not synonyms.** Optical networking is a transmission method, silicon photonics is a technology platform for optical components, and CPO is a packaging architecture that places optical engines near a switch ASIC.
3. **CPO shortens the most difficult high-speed electrical paths.** It can reduce signal loss and transmission power, but it does not eliminate the power consumed by GPUs, memory, cooling, and other equipment.
4. **Volume production has started, but pluggable optics will not disappear overnight.** CPO will first be used where bandwidth, power, and density constraints are most severe, while established technologies continue to coexist.
5. **Investment analysis must move from themes to evidence.** Volume production, shipment, validation, and a conceptual connection imply very different levels of revenue visibility.

## From a Compute Bottleneck to a Network Bottleneck

AI training requires many GPUs to process model parameters and data together. Large inference services also move data continuously among compute, memory, and networking resources. Once GPU counts rise, performance depends less on one chip and more on whether the cluster can coordinate efficiently.

The network can be divided into two broad layers:

| Network layer | Primary role | Typical constraint |
|---|---|---|
| Scale-up | Connect GPUs within a tightly coupled compute domain | Extremely low latency, high bandwidth, and synchronization efficiency |
| Scale-out | Expand across servers, racks, or data centers | Switching capacity, distance, power, and cost |

The clearest commercial use of CPO today is in high-capacity switches and networking platforms, not in a claim that every GPU directly uses CPO. As switch bandwidth moves toward 51.2T, 102.4T, and beyond, sending high-speed electrical signals over longer board traces becomes more difficult because of loss, heat, and signal-integrity requirements.

Optics matters because it moves the long-distance, high-bandwidth portion into a medium better suited to the task, reducing the burden on copper and printed circuit boards.

## Optical Networking, Silicon Photonics, and CPO Are Different

The three terms describe different layers of the system:

| Term | What it means | What investors should ask |
|---|---|---|
| Optical networking | The technology and industry that transmit data using light | Does the company sell fiber, lasers, transceivers, connectors, or complete systems? |
| Silicon photonics | A technology platform that integrates optical components with semiconductor processes | Has the component passed qualification, and can yield and cost support volume production? |
| CPO | A packaging method that places optical engines close to the switch ASIC | Is the product in production, who buys it, and has it generated revenue? |

A simplified pluggable-optics path is:

**Switch ASIC → electrical signal across the board → front-panel optical module → fiber.**

CPO moves the optical conversion closer to the ASIC:

**Switch ASIC → nearby optical engine → fiber.**

The goal is not to eliminate electrical signals completely. It is to shorten the hardest high-speed electrical path, reduce loss and retiming power, and increase front-panel and system connection density.

## How to Read the 30W and 9W Comparison

In a technical article, NVIDIA compares a specific 1.6 Tb/s interface: a traditional pluggable solution often consumes about 30W, while a CPO implementation can consume as little as 9W. Within the same architecture, electrical signal loss can fall from roughly 22dB to 4dB, with about 3.5 times better power efficiency.[1]

These figures demonstrate the engineering value of CPO, but they should not be generalized into a claim that every CPO interface always consumes 9W. Nor do they represent the power of an entire switch or data center. They are a vendor-specific comparison for a particular interface and system design.

Transmission efficiency and total electricity consumption are also different questions. Total data-center power includes GPUs, CPUs, memory, storage, power conversion, cooling, and redundancy. If GPU deployments, data volume, and utilization grow faster than efficiency improves, total power can still rise.

**Better efficiency does not guarantee lower total power consumption.**

CPO can reduce transmission energy per unit of data while making it practical to deploy more compute equipment. Demand for power, cooling, and data-center construction therefore does not necessarily fall as optical efficiency improves.

## How CPO Relates to Substrates and Glass Cores

CPO places the switch ASIC, optical engines, power delivery, and connection structures into a tighter system. That raises requirements for high-speed signaling, thermal expansion, flatness, alignment, yield, and serviceability. Advanced packaging, package substrates, and precision interconnects therefore become more important.

Three structures should not be conflated:

| Material or structure | Primary role | Relationship to CPO |
|---|---|---|
| PCB | Connects components and modules within the system | Remains a basic part of switches and servers |
| Package substrate | Supports chips and provides high-density interconnects | Specifications may rise as CPO packaging becomes more complex |
| Glass-core substrate | Uses glass as the core material in an advanced package | Can offer flatness and dimensional stability, but is not mandatory for CPO |

Intel's glass-substrate roadmap emphasizes larger package sizes, higher interconnect density, and future optical integration.[6] That makes glass a potential advanced-packaging option, but it does not prove that every CPO design requires a glass-core substrate. Glass in optical fiber is also a different issue from glass used as the core of a package substrate.

## Production Has Begun, but Pluggable Optics Still Matter

The industry has moved beyond a purely conceptual stage. Broadcom describes second-generation TH5-Bailly as the industry's first volume-production CPO solution and identifies shipment or production milestones involving Corning, Delta, FIT, Micas, and Twinstar.[3]

In May 2026, NVIDIA said Spectrum-X Ethernet Photonics switches were in production, while production shipments of complete Vera Rubin systems were set to begin in the fall.[4] Those statements are not interchangeable: a networking product entering production does not mean every end system has already shipped at scale.

NVIDIA has also stated that photonic switches will grow alongside pluggable optical-transceiver technologies.[5] Pluggable modules offer a mature supply chain, serviceability, and deployment flexibility. CPO is most attractive where bandwidth, power, and density pressure are greatest. The two are more likely to divide workloads over time than to experience an immediate, total replacement.

## Which Industries Could Be Affected?

Companies placed under the same optical-networking or CPO theme can have very different levels of evidence:

| Position in the value chain | Company examples | Evidence currently available | Interpretation |
|---|---|---|---|
| Network silicon and platforms | NVIDIA, Broadcom | CPO switch platforms and production milestones have been announced | The most direct commercialization evidence, but end-system shipments still matter |
| Lasers and optical components | Lumentum, Coherent | NVIDIA announced long-term purchase commitments and $2 billion investments in each; Lumentum discussed CPO laser demand and an initial ELS order | Orders and capacity partnerships are visible, but profit contribution still requires financial verification |
| Fiber, connectors, and coupling | Corning, FIT, FOCI | Broadcom reported Corning shipments and FIT production release; FOCI has discussed CPO development, connectors, and capital spending | The first two have production milestones; FOCI is closer to development and qualification |
| Silicon photonics and advanced packaging | TSMC | NVIDIA disclosed collaboration with TSMC and use of COUPE technology | A platform relationship is visible, but process revenue should not be equated with one CPO program |
| Switch and system integration | Delta, Micas | Broadcom reported TH5-Bailly production progress | Productization has started, while scale and margin still require company data |
| Pluggable optical modules | Coherent, Fabrinet, and others | Existing optical demand continues to grow, and official statements describe coexistence with CPO | CPO growth should not be treated as proof of an immediate collapse in pluggable optics |

The Lumentum and Coherent partnerships contain relatively strong commercial signals. NVIDIA announced multi-year, multibillion-dollar purchase commitments and $2 billion investments in each company to expand U.S. optical capacity.[7][8] Lumentum also said in its fiscal 2026 fourth-quarter results that demand for ultra-high-power CPO lasers was increasing and that it had received an initial external-laser-source order.[9]

Coherent's revenue also grew in the same period, supporting the case for strong company-wide and data-center demand, but its entire revenue increase cannot be attributed to CPO.[10] Likewise, FOCI's disclosed co-development work, ReLFACon connector, and expansion plans are useful qualification signals, not proof that large-scale CPO revenue and profit have already been realized.[11]

The commercial relationship matters as well. A direct supplier, development partner, manufacturing-services provider, and end user capture different economics and bear different risks.

**A company may already benefit from high-speed optical networking while its incremental CPO revenue remains unproven.**

## Returning to the Stock Market: Four Evidence Levels

Optical-networking growth will not benefit every company equally. Evidence can be organized into four levels:

| Evidence level | What qualifies | What it still does not prove |
|---|---|---|
| Realized | Financial reports disclose relevant revenue, margin, orders, or cash flow | Whether growth can persist for years |
| Ramping | An official source announces volume production, shipment, capacity, or a named customer | Whether volume is large enough to move profit materially |
| Under validation | Co-development, samples, qualification, equipment purchases, or capacity preparation | Whether the customer will adopt the product and when revenue begins |
| Conceptual link | The company has theoretically relevant materials or technical capability | Whether it is in the supply chain, much less earning revenue |

Five questions are worth tracking repeatedly:

1. Does the company sell lasers, optical engines, connectors, substrates, equipment, or a complete system?
2. Who pays it directly: a chip designer, switch vendor, cloud provider, or manufacturing partner?
3. Is the product in sampling, qualification, production, shipment, or already recognized in financial statements?
4. Are revenue gains accompanied by margin, operating cash flow, and manageable customer concentration?
5. How long will the equipment and research spending required to win the order take to earn back?

This framework is more informative than asking whether a stock appears on a list of CPO concepts.

## Conclusion

AI needs more compute, but it also needs faster, denser, and more power-efficient data movement. Optical networking is already core data-center infrastructure. CPO is a newer architecture moving into production as switch bandwidth and power constraints intensify.

The industry direction is real, but commercial results will not be evenly distributed. Network platforms, lasers, optical components, fiber interconnects, advanced packaging, and system integration may all be affected, yet they have different production timelines, bargaining power, capital requirements, and profit models.

The next step is not to collect more concept stocks. It is to track whether a product is in production, who purchases it, whether revenue is recognized, and whether margin and cash flow follow. Only as that evidence accumulates does a technology trend become a sustainable business.

## Sources

[1] NVIDIA Developer Blog, August 18, 2025.  
*Scaling AI Factories With Co-Packaged Optics for Better Power Efficiency.*  
https://developer.nvidia.com/blog/scaling-ai-factories-with-co-packaged-optics-for-better-power-efficiency/

[2] NVIDIA Developer Blog, August 26, 2025.  
*How Industry Collaboration Fosters NVIDIA Co-Packaged Optics.*  
https://developer.nvidia.com/blog/how-industry-collaboration-fosters-nvidia-co-packaged-optics/

[3] Broadcom.  
*Broadcom Announces Third-Generation Co-Packaged Optics.*  
https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-third-generation-co-packaged-optics-cpo

[4] NVIDIA Newsroom, May 31, 2026.  
*NVIDIA Vera Rubin Platform in Full Production to Power the Next Generation of Agentic AI Factories.*  
https://nvidianews.nvidia.com/news/vera-rubin-full-production-agentic-ai-factory

[5] NVIDIA Investor Relations, 2025.  
*NVIDIA Announces Spectrum-X Photonics Co-Packaged Optics Networking Switches.*  
https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Announces-Spectrum-X-Photonics-Co-Packaged-Optics-Networking-Switches-to-Scale-AI-Factories-to-Millions-of-GPUs/default.aspx

[6] Intel Newsroom.  
*Intel Unveils Industry-Leading Glass Substrates to Meet Demand for More Powerful Compute.*  
https://www.intel.com/content/www/us/en/newsroom/news/intel-unveils-industry-leading-glass-substrates.html

[7] Lumentum, 2026.  
*NVIDIA Announces Strategic Partnership With Lumentum to Develop State-of-the-Art Optics Technology.*  
https://investor.lumentum.com/financial-news-releases/news-details/2026/NVIDIA-Announces-Strategic-Partnership-With-Lumentum-to-Develop-State-of-the-Art-Optics-Technology/default.aspx

[8] Coherent, 2026.  
*NVIDIA and Coherent Announce Strategic Partnership.*  
https://www.coherent.com/news/press-releases/nvidia-and-coherent-announce-strategic-partnership

[9] Lumentum, 2026.  
*Lumentum Announces Fourth-Quarter and Full Fiscal Year 2026 Results.*  
https://investor.lumentum.com/financial-news-releases/news-details/2026/Lumentum-Announces-Fourth-Quarter-and-Full-Fiscal-Year-2026-Results/default.aspx

[10] Coherent, 2026.  
*Coherent Corp. Reports Fourth Quarter and Full Year Fiscal 2026 Results.*  
https://ir.coherent.com/news-releases/news-release-details/coherent-corp-reports-fourth-quarter-and-full-year-fiscal-2026

[11] FOCI.  
*Co-Packaged Optics and ReLFACon Technology Overview.*  
https://www.foci.com.tw/zh-tw/article/22
