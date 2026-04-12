<script lang="ts">
	import '$lib/styles/young-carpets-tokens.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import DevColorPicker from '../../components/DevColorPicker.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	/* ── State ── */
	let fontLoaded = $state(false);
	let heroVisible = $state(false);
	let navScrolled = $state(false);
	let activeNeed = $state('waterproof');
	let activeSection = $state('');
	let reducedMotion = $state(false);
	let mobileMenuOpen = $state(false);

	/* ── Stat counters ── */
	let yearsCount = $state(0);
	let jobsCount = $state(0);
	let statsTriggered = $state(false);

	/* ── Section reveal tracking ── */
	let revealedSections = $state<Set<string>>(new Set());

	/* ── Need-based product data ── */
	interface Product {
		name: string;
		why: string;
		best: string;
	}

	interface NeedCategory {
		id: string;
		label: string;
		icon: string;
		tagline: string;
		context: string;
		products: Product[];
	}

	const needs: NeedCategory[] = [
		{
			id: 'waterproof',
			label: 'Waterproof',
			icon: '💧',
			tagline: 'Kitchens, washrooms, wet labs — water hits the floor every day. These products laugh at it.',
			context: 'Water damage is the single most expensive flooring failure in commercial buildings. A single burst pipe or persistent condensation problem can destroy thousands of square feet of the wrong floor in hours. The right waterproof floor is not a luxury — it is insurance. Every product below has been field-tested in Ottawa buildings where freeze-thaw cycles, humidity swings, and heavy cleaning schedules push materials to their limits.',
			products: [
				{ name: 'Sheet Vinyl', why: 'Continuous rolls flash-coved up the wall, heat-welded at every seam. Zero joints means zero leak paths. Sheet vinyl in kitchens because grease, water, and dropped pans destroy grout lines — this laughs at all three. The gold standard for wet rooms, commercial kitchens, and anywhere hose-down cleaning is routine.', best: 'Commercial kitchens, washrooms, hospitals' },
				{ name: 'LVT', why: 'Click-lock luxury vinyl planks with sealed interlocking joints and a waterproof rigid core. Standing water can sit on this floor for days without wicking through. Available in wood and stone visuals that are indistinguishable from the real thing at a fraction of the maintenance cost.', best: 'Office lobbies, retail, multi-use spaces' },
				{ name: 'Epoxy', why: 'Poured seamless and bonded monolithically to the substrate. Nothing gets through — not water, not chemicals, not hydraulic fluid. Epoxy systems can be tailored with antimicrobial additives, non-slip aggregates, and chemical-resistance packages for specific industrial environments.', best: 'Pharmaceutical, food processing, industrial' },
				{ name: 'Ceramic / Porcelain', why: 'Fired clay is inherently waterproof — the tile itself absorbs zero moisture. Properly sealed grout completes the barrier. Large-format porcelain with rectified edges minimizes grout lines. Choose porcelain over ceramic for freeze-thaw resistance in Ottawa loading docks and vestibules.', best: 'Vestibules, loading docks, public washrooms' },
				{ name: 'Safety Flooring', why: 'Altro-style aggregate-surface vinyl that stays slip-resistant even when completely flooded. Pendulum test values of 36+ (R10+) wet. The surface texture is engineered into the wear layer, not applied on top, so it never wears smooth. Certified for barefoot and shod traffic in healthcare and aquatic facilities.', best: 'Pool decks, commercial showers, ramps' }
			]
		},
		{
			id: 'quiet',
			label: 'Quiet',
			icon: '🔇',
			tagline: 'Open offices, libraries, hotel corridors — when footfall noise is the enemy, these floors absorb it.',
			context: 'Sound travels through floors in two ways: impact noise (footsteps, dropped objects) and airborne noise (voices, music). Hard-surface floors reflect both. In open-plan offices, acoustic flooring is not a nice-to-have — it is a productivity requirement. Every 3 dB of noise reduction feels like cutting the sound level in half. The products below are selected for their IIC (Impact Insulation Class) and NRC (Noise Reduction Coefficient) ratings, measured in real commercial installations, not lab conditions.',
			products: [
				{ name: 'Carpet Tile', why: 'Modular 24x24 squares with built-in cushion backing deliver IIC ratings of 50+ right out of the box. No separate underpad needed. Interface, Shaw, and Mohawk Group all offer tiles specifically engineered for open-plan acoustic performance. Damaged tiles swap in minutes — no seam cutting, no re-stretching.', best: 'Open offices, call centres, libraries' },
				{ name: 'Broadloom Carpet', why: 'Wall-to-wall carpet over a quality underpad is the quietest floor you can install. Period. NRC ratings above 0.40 mean it absorbs almost half the sound energy that hits it. In hotel corridors, broadloom eliminates the rolling-suitcase thunder that LVT and tile create. Lower material cost per square foot than tile formats for large open areas.', best: 'Hotels, conference rooms, executive suites' },
				{ name: 'Cork', why: 'Natural cellular structure traps millions of microscopic air pockets. Cork delivers thermal insulation and acoustic damping in a single layer — warm underfoot, quiet overhead. IIC improvement of 15-20 points over bare concrete. Hypoallergenic surface that does not harbour dust mites. Renewable bark harvest without felling the tree.', best: 'Offices, studios, residential lobbies' },
				{ name: 'Rubber', why: 'Dense vulcanized rubber deadens impact sound on contact. Hospitals use it for exactly this reason — no heel clicks, no cart rumble, no gurney squeak. Nora and Johnsonite sheet rubber achieve IIC ratings of 47-52 without underpad. Also extremely durable, so you get acoustic performance AND a 25+ year service life.', best: 'Hospitals, schools, corridors' }
			]
		},
		{
			id: 'tough',
			label: 'Tough',
			icon: '🛡️',
			tagline: '10,000 footfalls a day. Forklifts. Rolling carts. These floors take the punishment.',
			context: 'Heavy commercial traffic destroys flooring that looks great in a showroom. The test that matters is not how a floor looks on day one — it is how it looks on day 3,000. Abrasion resistance, static load tolerance, rolling load capacity, and chemical resistance determine whether a floor survives institutional use. Every product below has a documented track record in Ottawa government buildings, hospitals, and industrial facilities where the abuse is real and the maintenance budget is finite.',
			products: [
				{ name: 'VCT', why: 'Rigid limestone-composite tile — the institutional workhorse. A strip-and-wax finish that renews the surface indefinitely. VCT has been the floor of choice in schools, hospitals, and government buildings for 60+ years because it can take rolling carts, chair casters, and boot traffic without flinching. Scratches polish out; deep gouges swap out one tile at a time.', best: 'Schools, government, hospitals' },
				{ name: 'Rubber', why: 'Nearly indestructible. Absorbs impact, resists gouging, and bounces back to shape after compression. Heavy gym equipment, rolling lab carts, and industrial dollies that would crack VCT or gouge LVT leave no mark on vulcanized rubber. 20-30 year lifespan with minimal maintenance — no waxing, no stripping, just damp mop.', best: 'Gyms, labs, industrial corridors' },
				{ name: 'Epoxy', why: 'Chemical-resistant resinous coating with forklift-grade hardness. Seamless application eliminates joints where damage concentrates. Available in broadcast-quartz, metallic, and flake systems that range from utilitarian to showroom-grade. Compressive strength of 10,000+ PSI. The floor of choice for warehouses, loading docks, and automotive service bays.', best: 'Warehouses, automotive, manufacturing' },
				{ name: 'Ceramic / Porcelain', why: 'Porcelain rated PEI 5 (heaviest commercial use) delivers a 25-50+ year service life. Scratch-proof, stain-proof, chemical-proof. Large-format rectified tiles with epoxy grout create a surface that endures decades of cart traffic in grocery stores, airport terminals, and transit stations. The highest lifecycle value of any hard-surface floor.', best: 'Retail, transit, airports' },
				{ name: 'Hardwood', why: 'Solid and engineered hardwood floors can be sanded and refinished for generations. A 3/4-inch solid oak floor can be refinished 8-10 times over a 100-year lifespan. Engineered options give you the same surface in a more dimensionally stable package. The long game — higher upfront cost, lowest cost per decade of any premium floor.', best: 'Heritage buildings, boardrooms, lobbies' }
			]
		},
		{
			id: 'hygienic',
			label: 'Hygienic',
			icon: '🧫',
			tagline: 'Operating theatres, clean rooms, food processing — where microbes are the adversary.',
			context: 'In healthcare and food processing, the floor is a potential reservoir for pathogens. Every seam, every crack, every porous surface is a colonization site. The standard is not "easy to clean" — it is "impossible to harbour." Hygienic flooring systems are tested to ISO 22196 (antibacterial activity) and rated for chemical wash-down resistance. Flash-coving eliminates the floor-to-wall junction where 90% of bacterial growth occurs. These products meet the standards that infection control teams and food safety auditors actually enforce.',
			products: [
				{ name: 'Sheet Vinyl', why: 'Flash-coved up walls with heat-welded seams — no gaps, no joints, no harbourage points for bacteria. The continuous membrane can be washed down with hospital-grade disinfectants including bleach, quaternary ammonium, and hydrogen peroxide solutions without degradation. The single most specified floor in Canadian hospital operating theatres.', best: 'Operating rooms, sterile processing, labs' },
				{ name: 'SCT / Homogeneous', why: 'Solid vinyl through the full thickness of the tile — the pattern goes all the way through, so wear never exposes a different layer. Heat-welded seams create a monolithic, fully cleanable surface. Forbo Sphera and Tarkett iQ lines are purpose-built for healthcare and pharmaceutical clean rooms where the floor must withstand daily chemical sterilization.', best: 'Clean rooms, pharmacies, research labs' },
				{ name: 'Epoxy', why: 'Seamless poured resinous system with zero joints, zero porosity. Chemical wash-downs with industrial solvents, caustics, and acids roll right off. Available with antimicrobial additives, integral coving, and FDA-compliant topcoats for food processing environments. The floor of choice when the cleaning protocol involves pressure washers.', best: 'Food processing, brewery, pharmaceutical' },
				{ name: 'Safety Flooring', why: 'The intersection of hygienic and slip-resistant — certified for both. Altro Whiterock and similar systems provide a sealed, impervious surface with R10-R12 slip resistance that meets both infection control requirements AND WSIB workplace safety standards. Flash-coved installation eliminates harbourage at wall junctions.', best: 'Commercial kitchens, care homes, wet labs' }
			]
		},
		{
			id: 'fast',
			label: 'Fast Install',
			icon: '⚡',
			tagline: 'Tenant turnover, weekend retrofit, emergency replacement — time is money.',
			context: 'When a tenant moves out Friday and moves in Monday, or a section of floor fails mid-week in an occupied building, installation speed is the constraint that overrides everything else. Fast-install products are designed for minimal substrate prep, no cure time, and immediate occupancy. The trick is choosing a fast product that does not sacrifice durability — otherwise you are just scheduling the NEXT emergency replacement. Every product below can go from bare substrate to foot traffic in 24 hours or less, with a lifespan measured in years, not months.',
			products: [
				{ name: 'Carpet Tile', why: 'The fastest textile floor you can install. Lay directly on clean concrete with pressure-sensitive adhesive or peel-and-stick backing — no stretch-in, no seaming iron, no 24-hour cure. Damaged tiles pop out and replace in minutes without touching the surrounding floor. Interface TacTiles and Shaw EcoWorx are purpose-built for rapid commercial deployment.', best: 'Tenant turnover, office refresh, emergency' },
				{ name: 'LVT', why: 'Click-lock floating planks go over existing substrate with zero glue and zero cure time. Walk on it immediately. A three-person crew can lay 1,500+ square feet per day. Loose-lay variants with factory-applied grip backing are even faster for large open areas where the perimeter pressure holds everything in place.', best: 'Retail, office, occupied buildings' },
				{ name: 'Rubber', why: 'Interlocking rubber tiles snap together without adhesive. Gym-ready in hours. No specialized tools, no moisture testing, no skim-coat. For permanent installations, full-spread adhesive cures overnight. Either way, the room is functional the same day. Weight alone keeps the tiles flat and stable.', best: 'Gyms, weight rooms, temporary events' },
				{ name: 'Raised Access', why: 'Pedestal-and-panel system goes down fast because it sits ON the slab, not IN it. Zero adhesive, zero curing, instant access to underfloor electrical, data, and HVAC distribution. Panels lift individually for service access — the floor IS the maintenance hatch. The standard for data centres, trading floors, and modern office fit-outs.', best: 'Data centres, trading floors, tech offices' }
			]
		},
		{
			id: 'green',
			label: 'Green',
			icon: '🌿',
			tagline: 'LEED credits, carbon targets, tenant expectations — sustainability that is measurable, not marketing.',
			context: 'Greenwashing is rampant in flooring. Every manufacturer claims sustainability. What matters is third-party certification: FloorScore (indoor air quality), NSF 332 (sustainability assessment for commercial carpet), Cradle to Cradle (material health), and Environmental Product Declarations (EPDs) that quantify embodied carbon. We only recommend products where the sustainability story holds up under scrutiny — certifications we can hand to your LEED consultant, not brochure copy. Ottawa municipal and federal procurement increasingly requires these credentials. Plan for it now.',
			products: [
				{ name: 'Marmoleum', why: 'Natural linseed-oil linoleum by Forbo — the original sustainable floor, made from flax, jute, limestone, and wood flour. Carbon-neutral manufacturing. Fully biodegradable at end of life. Naturally antimicrobial (linseed oil inhibits bacterial growth). A 30+ year service life means the embodied carbon amortizes to almost nothing per year. Certified Cradle to Cradle and carries a full EPD.', best: 'Schools, healthcare, government' },
				{ name: 'Cork', why: 'Harvested from the bark of cork oak trees without felling them — the bark regrows every 9 years. Hypoallergenic, naturally antimicrobial, and provides thermal + acoustic insulation in a single layer. FSC-certified cork from Portuguese forests carries the strongest chain-of-custody documentation in the industry. A genuine rapid-renewable material with a 20+ year commercial lifespan.', best: 'Offices, libraries, wellness spaces' },
				{ name: 'Bamboo', why: 'Strand-woven bamboo is harder than red oak (Janka 3,000+ vs. 1,290). It regrows in 5 years versus 60+ for hardwood. Modern strand-woven processing eliminates the formaldehyde concerns of early bamboo flooring. Look for FSC-certified sources and FloorScore certification for indoor air quality. The combination of hardness, renewability, and aesthetics makes it the sustainable alternative to hardwood.', best: 'Lobbies, retail, showrooms' },
				{ name: 'Reclaimed Wood', why: 'Salvaged old-growth timber from barns, factories, and demolition sites. Zero new trees harvested. Every plank carries decades or centuries of patina that cannot be manufactured. Certified reclaimed wood (look for FSC Recycled label) contributes to LEED MR Credit 3 (Materials Reuse). Higher cost per square foot, but the aesthetic and sustainability story is unmatched.', best: 'Heritage restorations, feature walls, boutiques' },
				{ name: 'Carpet Tile', why: 'Interface ReEntry and Shaw re:TURN programs take back used carpet tile for recycling — closed-loop material flow. Interface Climate Take Back tiles are carbon-negative. Shaw EcoWorx backing is 100% recyclable. These are not future promises; they are active programs processing thousands of tonnes annually. Specify take-back in the original purchase contract to lock it in.', best: 'Offices, LEED projects, federal buildings' }
			]
		},
		{
			id: 'budget',
			label: 'Budget-Friendly',
			icon: '💲',
			tagline: 'Maximum coverage, minimum spend — without cutting corners on quality.',
			context: 'Budget flooring does not mean cheap flooring. It means understanding lifecycle cost, not just material cost. A floor that costs $2/sf but lasts 5 years is more expensive than a floor that costs $4/sf and lasts 20. We specify budget-friendly products that deliver the lowest total cost of ownership — factoring in material, installation labor, maintenance schedule, and expected replacement cycle. These are the products that property managers choose when the budget is tight but the floor still has to perform.',
			products: [
				{ name: 'VCT', why: 'The lowest installed cost per square foot in commercial flooring. Period. Tarkett and Armstrong VCT runs $1.50-3.00/sf installed. The trade-off is maintenance — VCT needs periodic strip-and-wax to look its best. But that maintenance RENEWS the surface indefinitely, which means a 30+ year lifespan at the lowest entry cost in the market. Schools and hospitals have run the numbers for decades. VCT wins.', best: 'Schools, community centres, government' },
				{ name: 'Broadloom Carpet', why: 'Roll goods cover large open areas faster than any tile format — faster install means lower labor cost. Broadloom at $18-28/sy installed undercuts carpet tile by 30-40% on material alone. For single-tenant spaces where the modular swap-out advantage of tile is less important, broadloom delivers more floor for less money. Pair with a quality 6-pound underpad for acoustic performance.', best: 'Large offices, banquet halls, conference rooms' },
				{ name: 'LVT', why: 'Mid-range price point ($3.50-6.00/sf installed) with premium wood and stone aesthetics. The best value play in commercial flooring right now. Click-lock floating installation eliminates glue cost and reduces labor hours. A waterproof core means no moisture-related failures. 15-20 year commercial warranty. When clients ask for hardwood looks on a realistic budget, this is the answer.', best: 'Medical offices, retail, multi-tenant' },
				{ name: 'Matting', why: 'Not a floor — a floor PROTECTOR. Entrance walk-off mat systems trap salt, sand, grit, and moisture before they reach your interior floors. A $3,000 matting program can add 5+ years to a $50,000 interior floor installation. That is the highest ROI investment in any flooring budget. We spec recessed walk-off systems for new construction and surface-mount for retrofit.', best: 'Every building entrance in Ottawa' }
			]
		},
		{
			id: 'beautiful',
			label: 'Beautiful',
			icon: '✨',
			tagline: 'Lobbies, showrooms, executive suites — when the floor IS the design statement.',
			context: 'In premium commercial spaces, the floor sets the tone for everything above it. Architects and interior designers know that flooring is the largest continuous surface in any room — it anchors the palette, controls the light, and shapes the first impression. These products are specified when aesthetics carry equal weight with performance. Every option below delivers visual impact that photographs well, ages gracefully, and tells visitors something about the organization that chose it.',
			products: [
				{ name: 'Hardwood', why: 'Nothing replicates the warmth, grain variation, and depth of real wood. White oak, walnut, and maple remain the executive standards for boardrooms and lobbies. Wide-plank engineered options (7-9 inch faces) in wire-brushed or rift-sawn finishes create modern, linear compositions. UV-cured factory finishes are harder than site-applied poly. The floor that appreciates in beauty over decades.', best: 'Boardrooms, lobbies, heritage restorations' },
				{ name: 'Ceramic / Porcelain', why: 'Large-format porcelain (24x48, 48x48) in marble, travertine, concrete, and terrazzo looks creates showroom-grade surfaces with zero natural-stone maintenance. Rectified edges allow 1/16-inch grout lines that nearly disappear. Book-matched veining across multiple tiles creates feature walls and floors that rival Italian marble at a fraction of the cost and zero sealing schedule.', best: 'Hotel lobbies, showrooms, feature walls' },
				{ name: 'LVT', why: 'Photo-realistic wood and stone visuals produced by digital printing and embossed-in-register texturing. Designers genuinely cannot tell the difference at arm-length. Loose-lay and click-lock formats allow complex patterns — herringbone, chevron, mixed-width plank — without the subfloor prep that real wood demands. The design flexibility of LVT is unmatched at any price point.', best: 'Retail flagship stores, restaurants, medical spas' },
				{ name: 'Bamboo', why: 'Modern strand-woven bamboo delivers a warm honey tone with a tight, linear grain pattern that reads as contemporary and clean. It stands out without trying. Available in natural, carbonized, and stained finishes. The combination of unusual grain, environmental story, and genuine hardness (Janka 3,000+) makes it a conversation-starting floor that also performs.', best: 'Boutiques, yoga studios, creative offices' },
				{ name: 'Cork', why: 'Organic, non-repeating cellular patterns make every cork installation unique. Warm underfoot, deeply textured, and acoustically quiet. Cork absorbs light differently from every angle, creating a floor with visual depth that flat-printed products cannot replicate. Available in tile and plank formats with factory-applied UV-cured finishes for commercial durability.', best: 'Studios, galleries, wellness centres' },
				{ name: 'ESD / Static Control', why: 'Specialized conductive flooring for server rooms, electronics assembly, and data centres. ESD floors dissipate static charge to prevent equipment damage — but modern ESD products (StaticWorx, Gerflor Mipolam) do it with visual style. Available in clean, modern colourways that make technical spaces look intentional rather than industrial. Functional beauty at its most precise.', best: 'Server rooms, electronics labs, clean rooms' },
				{ name: 'Stair Treads', why: 'Coordinated rubber or vinyl stair treads complete the design from floor to flight. Johnsonite and Roppe offer treads that colour-match their sheet and tile lines, so the stairwell becomes part of the design story instead of an afterthought. Integrated nosings, contrasting inserts, and photoluminescent strips add both safety and style.', best: 'Public stairwells, lobbies, feature stairs' },
				{ name: 'Wall Base', why: 'The finishing detail that frames every room. Rubber, vinyl, or wood wall base in 2.5-inch, 4-inch, or 6-inch heights. Colour-matched to the floor or contrasted against it. Cove base with pre-formed inside and outside corners creates a seamless transition from floor to wall. It is the difference between "installed" and "finished."', best: 'Every commercial interior' }
			]
		}
	];

	const navSections = [
		{ id: 'needs', label: 'Products' },
		{ id: 'suppliers', label: 'Suppliers' },
		{ id: 'services', label: 'Services' },
		{ id: 'about', label: 'About' },
		{ id: 'contact', label: 'Contact' }
	];

	const suppliers = [
		'Tarkett', 'Beaulieu Canada', 'Interface', 'Forbo', 'Shaw Contract',
		'Mohawk Group', 'Patcraft', 'Gerflor', 'Johnsonite', 'COREtec',
		'Nora', 'Armstrong Flooring'
	];

	interface ServiceItem {
		title: string;
		desc: string;
		bullets: string[];
	}

	const services: ServiceItem[] = [
		{
			title: 'Commercial Installation',
			desc: 'Full-scope flooring installation for offices, healthcare, education, retail, and industrial facilities across the Ottawa region.',
			bullets: [
				'Carpet tile, broadloom, LVT, VCT, sheet vinyl, rubber, epoxy, ceramic, hardwood',
				'Flash-cove and heat-weld for hygienic and waterproof applications',
				'Moisture testing, substrate prep, and levelling — we own the subfloor condition',
				'Night and weekend shifts for occupied buildings with zero-downtime requirements',
				'Coordination with GCs, architects, and property managers on multi-trade job sites'
			]
		},
		{
			title: 'Consultation & Specification',
			desc: 'On-site assessment, product recommendation, and specification writing. We match the floor to the problem, not the other way around.',
			bullets: [
				'Free on-site assessment — we look at the subfloor, the traffic pattern, and the budget',
				'Written product specification with alternatives at three price points',
				'Moisture testing (calcium chloride and RH probe) included in every assessment',
				'LEED and sustainability documentation support for green building projects',
				'Lifecycle cost analysis: material + labor + maintenance + replacement over 20 years'
			]
		},
		{
			title: 'Maintenance & Repair',
			desc: 'Strip-and-wax, carpet extraction, tile replacement, and seam repair. Extending the life of what is already down.',
			bullets: [
				'VCT strip-and-wax programs (initial, periodic, and burnish-only schedules)',
				'Hot-water carpet extraction for broadloom and carpet tile',
				'Seam repair and re-welding for sheet vinyl and safety flooring',
				'Spot tile replacement: carpet tile, VCT, LVT, and ceramic',
				'Transition strip repair and wall base replacement'
			]
		},
		{
			title: 'Seasonal Matting Programs',
			desc: 'Winter walk-off mat programs that protect interior floors from Ottawa salt, sand, and snowmelt damage.',
			bullets: [
				'Recessed and surface-mount walk-off systems for building entrances',
				'Seasonal mat rental programs — swap heavy-duty winter mats for lighter summer mats',
				'Custom sizing for vestibules, lobbies, and elevator landings',
				'Anti-fatigue matting for standing workstations and service counters',
				'Mat cleaning and rotation schedules to maintain effectiveness all winter'
			]
		}
	];

	const salesTeam = [
		{ name: 'Ryan Young', phone: '613-277-7926', email: 'ryoung@youngcarpets.com' },
		{ name: 'Derek Young', phone: '613-612-8487', email: 'dyoung@youngcarpets.com' },
		{ name: 'Peter Helis', phone: '613-864-6998', email: 'phelis@youngcarpets.com' },
		{ name: 'Mike Noel', phone: '613-222-5987', email: 'mnoel@youngcarpets.com' },
		{ name: 'Clayton Bradley', phone: '613-290-5075', email: 'cbradley@youngcarpets.com' },
		{ name: "Alan O'Connor", phone: '613-791-3252', email: 'aoconnor@youngcarpets.com' }
	];

	/* ── Scroll to need section ── */
	function scrollToNeed(id: string) {
		activeNeed = id;
		const el = document.getElementById(`need-${id}`);
		if (el) {
			const offset = 100;
			const top = el.getBoundingClientRect().top + window.scrollY - offset;
			window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
		}
	}

	/* ── Scroll to page section ── */
	function scrollToSection(id: string) {
		mobileMenuOpen = false;
		const el = document.getElementById(id);
		if (el) {
			const offset = 80;
			const top = el.getBoundingClientRect().top + window.scrollY - offset;
			window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
		}
	}

	/* ── Counter animation ── */
	function animateCounter(target: number, duration: number, setter: (v: number) => void) {
		if (reducedMotion) { setter(target); return; }
		const start = performance.now();
		function tick(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setter(Math.round(eased * target));
			if (progress < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	onMount(() => {
		if (!browser) return;

		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		/* Font loading */
		const font = new FontFace('Square721', "url('/young-carpets/square721.ttf')");
		font.load().then((loaded) => {
			document.fonts.add(loaded);
			fontLoaded = true;
			setTimeout(() => { heroVisible = true; }, 100);
		}).catch(() => {
			fontLoaded = true;
			heroVisible = true;
		});

		/* Nav scroll */
		const onScroll = () => {
			navScrolled = window.scrollY > 60;

			/* Track active nav section */
			for (const s of [...navSections].reverse()) {
				const el = document.getElementById(s.id);
				if (el && el.getBoundingClientRect().top < 200) {
					activeSection = s.id;
					break;
				}
			}

			/* Track active need pill */
			for (const n of [...needs].reverse()) {
				const el = document.getElementById(`need-${n.id}`);
				if (el && el.getBoundingClientRect().top < 300) {
					activeNeed = n.id;
					break;
				}
			}
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		/* Intersection observer for section reveals */
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					revealedSections = new Set([...revealedSections, entry.target.id]);

					/* Stats counter trigger */
					if (entry.target.id === 'about' && !statsTriggered) {
						statsTriggered = true;
						animateCounter(250, 2000, (v) => { yearsCount = v; });
						animateCounter(50000, 2500, (v) => { jobsCount = v; });
					}
				}
			}
		}, { threshold: 0.15 });

		/* Observe all sections */
		setTimeout(() => {
			document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
		}, 200);

		return () => {
			window.removeEventListener('scroll', onScroll);
			observer.disconnect();
		};
	});

	/* ── All 20 products check ── */
	const allProducts = new Set(needs.flatMap(n => n.products.map(p => p.name)));
</script>

<svelte:head>
	<title>Young Carpets — Commercial Flooring Solutions | Ottawa</title>
	<meta name="description" content="Young Carpets Inc. — Ottawa's commercial flooring installer since 1991. Tell us your problem, we'll recommend the floor. Carpet, LVT, vinyl, rubber, epoxy, hardwood, ceramic." />
</svelte:head>

<div class="yc-page yc-v3">

	<!-- ════════════════════════════════════════════════════════════════════
	     FLOATING NAV
	     ════════════════════════════════════════════════════════════════ -->
	<nav class="yc-nav" class:scrolled={navScrolled}>
		<div class="yc-nav-inner">
			<a href="/young-carpets" class="yc-nav-brand">YOUNG</a>
			<button class="yc-nav-hamburger" onclick={() => mobileMenuOpen = !mobileMenuOpen} aria-label="Toggle navigation menu">
				<span class="yc-hamburger-bar" class:open={mobileMenuOpen}></span>
				<span class="yc-hamburger-bar" class:open={mobileMenuOpen}></span>
				<span class="yc-hamburger-bar" class:open={mobileMenuOpen}></span>
			</button>
			<div class="yc-nav-links" class:open={mobileMenuOpen}>
				{#each navSections as section}
					<button
						class="yc-nav-link"
						class:active={activeSection === section.id}
						onclick={() => scrollToSection(section.id)}
					>
						{section.label}
					</button>
				{/each}
				<a href="tel:613-744-2744" class="yc-nav-phone">613-744-2744</a>
				<ThemeToggle />
			</div>
		</div>
	</nav>

	<!-- ════════════════════════════════════════════════════════════════════
	     HERO
	     ════════════════════════════════════════════════════════════════ -->
	<section class="yc-hero">
		<div class="yc-hero-content" class:visible={heroVisible}>
			<!-- Maple leaf badge -->
			<div class="yc-hero-leaf">
				<svg viewBox="-2015 -2000 4030 4030" class="yc-leaf-svg" aria-hidden="true">
					<path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" />
				</svg>
			</div>

			<!-- YOUNG wordmark -->
			<h1 class="yc-hero-wordmark" class:loaded={fontLoaded}>
				{#each 'YOUNG' as letter, i}
					<span class="yc-hero-letter" style="--delay: {i * 0.08}s">{letter}</span>
				{/each}
			</h1>

			<p class="yc-hero-tagline">Commercial Flooring Solutions</p>
			<p class="yc-hero-sub">Tell us what you need. We will tell you what works.</p>
			<p class="yc-hero-sub2">
				34 years of installing every category of commercial floor covering in Ottawa.
				We do not sell flooring — we solve flooring problems.
			</p>
			<p class="yc-hero-location">Ottawa, Ontario &middot; Since 1991</p>

			<div class="yc-hero-actions">
				<button class="yc-hero-cta" onclick={() => scrollToSection('needs')}>
					Find Your Floor
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<a href="tel:613-744-2744" class="yc-hero-cta-secondary">
					Call Us
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h1.528a1 1 0 0 1 .97.757l.523 2.09a1 1 0 0 1-.462 1.093l-.91.546a.5.5 0 0 0-.212.49c.2 1.05.798 2.048 1.643 2.893s1.843 1.443 2.893 1.643a.5.5 0 0 0 .49-.212l.546-.91a1 1 0 0 1 1.093-.462l2.09.523a1 1 0 0 1 .757.97V12.5A1.5 1.5 0 0 1 13.5 14h-1C6.148 14 1 8.852 1 2.5V2.5z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</a>
			</div>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════════════════════
	     PROBLEM-SOLVER INTRO
	     ════════════════════════════════════════════════════════════════ -->
	<section class="yc-solver-intro">
		<div class="yc-solver-intro-inner">
			<span class="yc-eyebrow">How It Works</span>
			<h2 class="yc-section-title">The Problem-Solver Approach</h2>
			<p class="yc-solver-desc">
				Most flooring websites organize by product. We organize by problem.
				Because you do not walk into a building and think
				<em>"I need LVT"</em> — you think <em>"this floor needs to handle water"</em>
				or <em>"we need something quiet for the open office."</em>
			</p>
			<p class="yc-solver-desc">
				Select your need below. We will show you every product category that solves it,
				with an honest explanation of why each one works — and where it works best.
				This is how our sales team thinks, and now you can see the same logic.
			</p>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════════════════════
	     NEED PILLS — Sticky horizontal scroll bar
	     ════════════════════════════════════════════════════════════════ -->
	<div class="yc-needs-bar" id="needs">
		<div class="yc-needs-bar-inner">
			<span class="yc-needs-bar-label">I need it:</span>
			<div class="yc-needs-pills">
				{#each needs as need}
					<button
						class="yc-need-pill"
						class:active={activeNeed === need.id}
						onclick={() => scrollToNeed(need.id)}
					>
						<span class="yc-need-pill-icon">{need.icon}</span>
						<span class="yc-need-pill-text">{need.label}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- ════════════════════════════════════════════════════════════════════
	     PRODUCT SECTIONS — Problem-Solver Flow
	     ════════════════════════════════════════════════════════════════ -->
	<main class="yc-needs-main">
		{#each needs as need, ni}
			<section
				class="yc-need-section"
				class:alt={ni % 2 === 1}
				class:revealed={revealedSections.has(`need-${need.id}`)}
				id="need-{need.id}"
				data-reveal
			>
				<div class="yc-need-section-inner">
					<div class="yc-need-header">
						<span class="yc-need-icon">{need.icon}</span>
						<div>
							<span class="yc-need-eyebrow">We need it</span>
							<h2 class="yc-need-title">{need.label}</h2>
						</div>
					</div>
					<p class="yc-need-tagline">{need.tagline}</p>
					<p class="yc-need-context">{need.context}</p>

					<div class="yc-need-grid">
						{#each need.products as product, pi}
							<div
								class="yc-product-card"
								style="--stagger: {pi * 0.06}s"
							>
								<h3 class="yc-product-name">{product.name}</h3>
								<p class="yc-product-why">{product.why}</p>
								<span class="yc-product-best">Best for: {product.best}</span>
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/each}
	</main>

	<!-- ════════════════════════════════════════════════════════════════════
	     SUPPLIERS — Auto-scroll marquee
	     ════════════════════════════════════════════════════════════════ -->
	<section class="yc-suppliers" id="suppliers" data-reveal>
		<div class="yc-section-container"
			class:revealed={revealedSections.has('suppliers')}
		>
			<span class="yc-eyebrow">Trusted Partners</span>
			<h2 class="yc-section-title">Suppliers</h2>
			<p class="yc-suppliers-desc">
				We are authorized dealers and certified installers for every major commercial
				flooring manufacturer in Canada. Our relationships with these suppliers mean
				direct pricing, technical support, warranty backing, and access to full sample
				libraries — not just what is in stock at a distribution warehouse.
			</p>
			<div class="yc-marquee-track">
				<div class="yc-marquee-scroll">
					{#each [...suppliers, ...suppliers] as supplier}
						<span class="yc-marquee-item">{supplier}</span>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════════════════════
	     SERVICES
	     ════════════════════════════════════════════════════════════════ -->
	<section class="yc-services" id="services" data-reveal>
		<div class="yc-section-container"
			class:revealed={revealedSections.has('services')}
		>
			<span class="yc-eyebrow">What We Do</span>
			<h2 class="yc-section-title">Services</h2>
			<div class="yc-services-grid">
				{#each services as service, si}
					<div class="yc-service-card" style="--stagger: {si * 0.08}s">
						<h3 class="yc-service-name">{service.title}</h3>
						<p class="yc-service-desc">{service.desc}</p>
						<ul class="yc-service-bullets">
							{#each service.bullets as bullet}
								<li>{bullet}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════════════════════
	     ABOUT
	     ════════════════════════════════════════════════════════════════ -->
	<section class="yc-about" id="about" data-reveal>
		<div class="yc-section-container"
			class:revealed={revealedSections.has('about')}
		>
			<span class="yc-eyebrow">Who We Are</span>
			<h2 class="yc-section-title">Since 1991</h2>

			<div class="yc-about-narrative">
				<p class="yc-about-text">
					Young Carpets Inc. is a family-owned commercial flooring contractor serving Ottawa
					and Eastern Ontario for over three decades. Founded in 1991, the company has grown
					from a two-person carpet installation crew into one of the region's most trusted
					names in commercial floor covering — installing everything from carpet tile in
					federal government offices to epoxy systems in pharmaceutical clean rooms.
				</p>
				<p class="yc-about-text">
					What makes Young Carpets different is the problem-solver approach. We do not push
					products — we ask questions. What does the space do? Who uses it? What has failed
					before? What is the maintenance plan? What is the budget reality, not the brochure
					number? By the time we recommend a product, we have already eliminated everything
					that would not survive the real conditions of that building.
				</p>
				<p class="yc-about-text">
					Our sales team carries a combined 250+ years of flooring experience. Ryan and Derek
					Young carry on the family tradition. Every member of the team has walked thousands of
					job sites across the National Capital Region — from Parliament Hill to the Queensway
					Carleton Hospital, from CFB Uplands to the Rideau Centre. We know what works in
					Ottawa because we have installed it, maintained it, and replaced it here.
				</p>
				<p class="yc-about-text">
					We work with property managers, general contractors, architects, interior designers,
					and facility teams who need floors that perform under real conditions, installed on
					schedule, within budget, and backed by a company that will still be here when the
					warranty call comes in. That is the promise of a family business with 34 years of
					reputation behind every handshake.
				</p>
			</div>

			<div class="yc-stats-row">
				<div class="yc-stat">
					<span class="yc-stat-number">{yearsCount}+</span>
					<span class="yc-stat-label">Years combined experience</span>
				</div>
				<div class="yc-stat">
					<span class="yc-stat-number">{jobsCount.toLocaleString()}+</span>
					<span class="yc-stat-label">Jobs completed</span>
				</div>
				<div class="yc-stat">
					<span class="yc-stat-number">34</span>
					<span class="yc-stat-label">Years in business</span>
				</div>
				<div class="yc-stat">
					<span class="yc-stat-number">12</span>
					<span class="yc-stat-label">Major supplier partnerships</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════════════════════
	     CONTACT
	     ════════════════════════════════════════════════════════════════ -->
	<section class="yc-contact" id="contact" data-reveal>
		<div class="yc-section-container"
			class:revealed={revealedSections.has('contact')}
		>
			<span class="yc-eyebrow">Get In Touch</span>
			<h2 class="yc-section-title">Contact</h2>
			<p class="yc-contact-intro">
				Every conversation starts with listening. Call any member of our sales team directly,
				or reach the main office. We will visit your site, assess the conditions, and give
				you an honest recommendation — even if that recommendation is "the floor you have
				is fine, just maintain it better."
			</p>

			<div class="yc-contact-grid">
				<!-- Sales team -->
				<div class="yc-contact-group">
					<h3 class="yc-contact-group-title">Sales</h3>
					<div class="yc-contact-cards">
						{#each salesTeam as person}
							<div class="yc-contact-card">
								<span class="yc-contact-name">{person.name}</span>
								<a href="tel:{person.phone}" class="yc-contact-link">{person.phone}</a>
								<a href="mailto:{person.email}" class="yc-contact-link">{person.email}</a>
							</div>
						{/each}
					</div>
				</div>

				<!-- Accounting + Office -->
				<div class="yc-contact-group">
					<h3 class="yc-contact-group-title">Accounting</h3>
					<div class="yc-contact-cards">
						<div class="yc-contact-card">
							<span class="yc-contact-name">Alan Young</span>
							<a href="tel:613-878-9911" class="yc-contact-link">613-878-9911</a>
							<a href="mailto:accounting@youngcarpets.com" class="yc-contact-link">accounting@youngcarpets.com</a>
						</div>
						<div class="yc-contact-card">
							<span class="yc-contact-name">Accounts Payable</span>
							<a href="mailto:ap@youngcarpets.com" class="yc-contact-link">ap@youngcarpets.com</a>
						</div>
					</div>

					<h3 class="yc-contact-group-title" style="margin-top: 1.5rem">Office</h3>
					<div class="yc-contact-cards">
						<div class="yc-contact-card">
							<span class="yc-contact-name">Main Line</span>
							<a href="tel:613-744-2744" class="yc-contact-link">613-744-2744</a>
						</div>
						<div class="yc-contact-card">
							<span class="yc-contact-name">Fax</span>
							<span class="yc-contact-detail">613-744-2995</span>
						</div>
						<div class="yc-contact-card">
							<span class="yc-contact-name">Email</span>
							<a href="mailto:info@youngcarpets.com" class="yc-contact-link">info@youngcarpets.com</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════════════════════
	     MAP
	     ════════════════════════════════════════════════════════════════ -->
	<section class="yc-map" data-reveal>
		<div class="yc-section-container"
			class:revealed={revealedSections.has('contact')}
		>
			<div class="yc-map-frame">
				<iframe
					src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=15"
					width="100%"
					height="320"
					style="border:0; border-radius: 18px;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Young Carpets location — 1228 Old Innes Road, Ottawa"
				></iframe>
			</div>
			<p class="yc-map-address">Unit 316 — 1228 Old Innes Road, Ottawa, ON K1B 3V3</p>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════════════════════
	     FOOTER
	     ════════════════════════════════════════════════════════════════ -->
	<footer class="yc-footer">
		<div class="yc-footer-inner">
			<div class="yc-footer-brand">
				<span class="yc-footer-name">Young Carpets Inc.</span>
				<span class="yc-footer-est">Commercial Flooring Since 1991</span>
				<span class="yc-footer-est">Family-Owned &middot; Ottawa, Ontario</span>
			</div>
			<div class="yc-footer-col">
				<span class="yc-footer-heading">Address</span>
				<span>Unit 316 — 1228 Old Innes Road</span>
				<span>Ottawa, ON K1B 3V3</span>
			</div>
			<div class="yc-footer-col">
				<span class="yc-footer-heading">Contact</span>
				<a href="tel:613-744-2744">613-744-2744</a>
				<a href="mailto:info@youngcarpets.com">info@youngcarpets.com</a>
			</div>
			<div class="yc-footer-col">
				<span class="yc-footer-heading">Hours</span>
				<span>Mon–Fri: 10:00–16:00</span>
				<span>Sat–Sun: Closed</span>
			</div>
		</div>
		<div class="yc-footer-bottom">
			<span>&copy; 2026 Young Carpets Inc. All rights reserved.</span>
			<a href="/" class="yc-footer-portal">Portal</a>
		</div>
	</footer>
	<DevColorPicker />
</div>

<style>
	/* ══════════════════════════════════════════════════════════════════════
	   V3 — Problem-Solver Flow (Public-Facing Rebuild)
	   ══════════════════════════════════════════════════════════════════ */

	/* ── Resets & Page ── */
	.yc-v3 {
		min-height: 100vh;
		background: var(--yc-bg, var(--yc-ink));
		color: var(--yc-griege-text);
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-weight: 200;
		font-size: 0.9rem;
		line-height: 1.6;
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
	}

	/* ── Nav ── */
	.yc-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 0.75rem 1rem;
		transition: background 350ms cubic-bezier(0.2, 0.9, 0.25, 1.05),
					backdrop-filter 350ms cubic-bezier(0.2, 0.9, 0.25, 1.05),
					border-color 350ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		border-bottom: 1px solid transparent;
	}
	.yc-nav.scrolled {
		background: var(--yc-ink-45);
		backdrop-filter: blur(var(--yc-blur-20, 20px)) saturate(var(--yc-sat-150, 150%));
		-webkit-backdrop-filter: blur(var(--yc-blur-20, 20px)) saturate(var(--yc-sat-150, 150%));
		border-bottom-color: var(--yc-griege-18);
	}
	.yc-nav-inner {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.yc-nav-brand {
		font-family: 'Square721', system-ui, sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--yc-maple-gold);
		text-decoration: none;
	}
	.yc-nav-hamburger {
		display: none;
		flex-direction: column;
		gap: 4px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		min-width: 44px;
		min-height: 44px;
		align-items: center;
		justify-content: center;
	}
	.yc-hamburger-bar {
		display: block;
		width: 20px;
		height: 2px;
		background: var(--yc-griege-text);
		border-radius: 1px;
		transition: all 250ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}
	.yc-hamburger-bar.open:nth-child(1) {
		transform: rotate(45deg) translate(4px, 4px);
	}
	.yc-hamburger-bar.open:nth-child(2) {
		opacity: 0;
	}
	.yc-hamburger-bar.open:nth-child(3) {
		transform: rotate(-45deg) translate(4px, -4px);
	}
	.yc-nav-links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.yc-nav-link {
		background: none;
		border: none;
		color: var(--yc-griege-text);
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		border-radius: 8px;
		transition: all 250ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		min-height: 44px;
		display: flex;
		align-items: center;
	}
	.yc-nav-link:hover {
		background: var(--yc-griege-08);
	}
	.yc-nav-link.active {
		color: var(--yc-maple-gold);
		background: var(--yc-maple-gold-10);
	}
	.yc-nav-phone {
		color: var(--yc-maple-gold);
		text-decoration: none;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		padding: 0.4rem 0.85rem;
		border: 1px solid var(--yc-maple-gold-45);
		border-radius: 100px;
		transition: all 250ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		min-height: 44px;
		display: flex;
		align-items: center;
		margin-left: 0.25rem;
	}
	.yc-nav-phone:hover {
		background: var(--yc-maple-gold-10);
	}

	/* ── Hero ── */
	.yc-hero {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6rem 1.5rem 4rem;
		position: relative;
		overflow: hidden;
	}
	.yc-hero::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse 60% 50% at 50% 45%, var(--yc-maple-gold-08) 0%, transparent 70%);
		pointer-events: none;
	}
	.yc-hero-content {
		text-align: center;
		max-width: 640px;
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 800ms cubic-bezier(0.2, 0.9, 0.25, 1.05),
					transform 800ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}
	.yc-hero-content.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.yc-hero-leaf {
		width: 56px;
		height: 56px;
		margin: 0 auto 1.5rem;
	}
	.yc-leaf-svg {
		width: 100%;
		height: 100%;
		fill: var(--yc-maple-red);
		filter: drop-shadow(0 0 12px var(--yc-maple-red-55));
		transition: filter 500ms ease;
	}
	.yc-hero-leaf:hover .yc-leaf-svg {
		filter: drop-shadow(0 0 20px var(--yc-maple-red-75));
	}

	.yc-hero-wordmark {
		font-family: 'Square721', system-ui, sans-serif;
		font-size: 5.5rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--yc-text, #e6e6e8);
		margin: 0 0 0.75rem;
		line-height: 1;
		display: flex;
		justify-content: center;
		gap: 0.02em;
		opacity: 0;
		transition: opacity 400ms ease;
	}
	.yc-hero-wordmark.loaded {
		opacity: 1;
	}

	.yc-hero-letter {
		display: inline-block;
		animation: letterBounce 600ms cubic-bezier(0.2, 0.9, 0.25, 1.05) both;
		animation-delay: var(--delay);
	}
	@keyframes letterBounce {
		0% { opacity: 0; transform: translateY(40px) scale(0.8); }
		60% { transform: translateY(-6px) scale(1.04); }
		100% { opacity: 1; transform: translateY(0) scale(1); }
	}

	.yc-hero-tagline {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--yc-maple-gold);
		margin: 0 0 0.75rem;
	}
	.yc-hero-sub {
		font-size: 1.1rem;
		font-weight: 200;
		color: var(--yc-griege-text);
		margin: 0 0 0.5rem;
	}
	.yc-hero-sub2 {
		font-size: 0.88rem;
		font-weight: 300;
		color: var(--yc-text-muted, var(--yc-griege-50));
		margin: 0 0 0.5rem;
		max-width: 480px;
		margin-left: auto;
		margin-right: auto;
		line-height: 1.5;
	}
	.yc-hero-location {
		font-size: 0.8rem;
		font-weight: 300;
		color: var(--yc-text-muted, var(--yc-griege-50));
		margin: 0 0 2rem;
	}
	.yc-hero-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	.yc-hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.75rem;
		border: 1px solid var(--yc-maple-gold-45);
		border-radius: 100px;
		background: var(--yc-maple-gold-10);
		color: var(--yc-maple-gold);
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 300ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		min-height: 44px;
	}
	.yc-hero-cta:hover {
		background: var(--yc-maple-gold-14);
		border-color: var(--yc-maple-gold-60);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px -4px var(--yc-shadow-30);
	}
	.yc-hero-cta-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.75rem;
		border: 1px solid var(--yc-griege-20);
		border-radius: 100px;
		background: transparent;
		color: var(--yc-griege-text);
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		transition: all 300ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		min-height: 44px;
	}
	.yc-hero-cta-secondary:hover {
		border-color: var(--yc-griege-32);
		background: var(--yc-griege-08);
		transform: translateY(-2px);
	}

	/* ── Problem-Solver Intro ── */
	.yc-solver-intro {
		padding: 4rem 1rem 2rem;
		border-top: 1px solid var(--yc-griege-08);
	}
	.yc-solver-intro-inner {
		max-width: 680px;
		margin: 0 auto;
		text-align: center;
	}
	.yc-solver-desc {
		font-size: 0.92rem;
		font-weight: 300;
		line-height: 1.7;
		color: var(--yc-griege-text);
		margin: 0 0 1rem;
	}
	.yc-solver-desc em {
		font-style: italic;
		color: var(--yc-text, #e6e6e8);
	}

	/* ── Need Pills Bar ── */
	.yc-needs-bar {
		position: sticky;
		top: 56px;
		z-index: 90;
		background: var(--yc-ink-55);
		backdrop-filter: blur(var(--yc-blur-24, 24px)) saturate(var(--yc-sat-160, 160%));
		-webkit-backdrop-filter: blur(var(--yc-blur-24, 24px)) saturate(var(--yc-sat-160, 160%));
		border-bottom: 1px solid var(--yc-griege-18);
		padding: 0.75rem 1rem;
	}
	.yc-needs-bar-inner {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.yc-needs-bar-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-text-muted, var(--yc-griege-50));
		white-space: nowrap;
		flex-shrink: 0;
	}
	.yc-needs-pills {
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		padding: 0.25rem 0;
	}
	.yc-needs-pills::-webkit-scrollbar {
		display: none;
	}
	.yc-need-pill {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.85rem;
		border: 1px solid var(--yc-griege-20);
		border-radius: 100px;
		background: var(--yc-ink-45);
		color: var(--yc-griege-text);
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		white-space: nowrap;
		transition: all 250ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		min-height: 44px;
		flex-shrink: 0;
	}
	.yc-need-pill:hover {
		border-color: var(--yc-griege-32);
		background: var(--yc-griege-08);
	}
	.yc-need-pill.active {
		color: var(--yc-maple-gold);
		background: var(--yc-maple-gold-10);
		border-color: var(--yc-maple-gold-45);
	}
	.yc-need-pill-icon {
		font-size: 0.85rem;
		line-height: 1;
	}

	/* ── Need Sections ── */
	.yc-needs-main {
		margin: 0;
		padding: 0;
	}
	.yc-need-section {
		padding: 3.5rem 1rem;
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 600ms cubic-bezier(0.2, 0.9, 0.25, 1.05),
					transform 600ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		border-bottom: 1px solid var(--yc-griege-08);
	}
	.yc-need-section:last-child {
		border-bottom: none;
	}
	.yc-need-section.revealed {
		opacity: 1;
		transform: translateY(0);
	}
	.yc-need-section-inner {
		max-width: 1100px;
		margin: 0 auto;
	}

	.yc-need-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}
	.yc-need-icon {
		font-size: 2rem;
		line-height: 1;
	}
	.yc-need-eyebrow {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--section-eyebrow, var(--yc-griege-55));
	}
	.yc-need-title {
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-size: 2rem;
		font-weight: 200;
		color: var(--yc-text, #e6e6e8);
		margin: 0;
		line-height: 1.1;
	}
	.yc-need-tagline {
		font-size: 0.92rem;
		font-weight: 400;
		color: var(--yc-text, #e6e6e8);
		margin: 0.75rem 0 0.75rem;
		max-width: 700px;
	}
	.yc-need-context {
		font-size: 0.85rem;
		font-weight: 300;
		line-height: 1.65;
		color: var(--yc-text-muted, var(--yc-griege-50));
		margin: 0 0 2rem;
		max-width: 700px;
	}

	/* ── Product Cards ── */
	.yc-need-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}
	.yc-product-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(var(--yc-blur-12, 12px));
		-webkit-backdrop-filter: blur(var(--yc-blur-12, 12px));
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.5rem;
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10),
					0 8px 24px -4px var(--yc-shadow-30);
		transition: all 350ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		transition-delay: var(--stagger);
		display: flex;
		flex-direction: column;
	}
	.yc-product-card:hover {
		border-color: var(--yc-maple-gold-45);
		transform: translateY(-4px);
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-18),
					0 16px 48px -8px var(--yc-shadow-45);
	}
	.yc-product-name {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-maple-gold);
		margin: 0 0 0.75rem;
	}
	.yc-product-why {
		font-size: 0.84rem;
		font-weight: 300;
		line-height: 1.6;
		color: var(--yc-griege-text);
		margin: 0 0 1rem;
		flex: 1;
	}
	.yc-product-best {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--yc-text-muted, var(--yc-griege-50));
		padding-top: 0.75rem;
		border-top: 1px solid var(--yc-griege-08);
	}

	/* ── Suppliers Marquee ── */
	.yc-suppliers {
		padding: 4rem 1rem;
		border-top: 1px solid var(--yc-griege-08);
	}
	.yc-section-container {
		max-width: 1100px;
		margin: 0 auto;
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 600ms cubic-bezier(0.2, 0.9, 0.25, 1.05),
					transform 600ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}
	.yc-section-container.revealed {
		opacity: 1;
		transform: translateY(0);
	}
	.yc-eyebrow {
		display: block;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--section-eyebrow, var(--yc-griege-55));
		margin-bottom: 0.25rem;
	}
	.yc-section-title {
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-size: 2.25rem;
		font-weight: 200;
		color: var(--yc-text, #e6e6e8);
		margin: 0 0 1.25rem;
		line-height: 1.1;
	}
	.yc-suppliers-desc {
		font-size: 0.88rem;
		font-weight: 300;
		line-height: 1.65;
		color: var(--yc-griege-text);
		max-width: 640px;
		margin: 0 0 2rem;
	}

	.yc-marquee-track {
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
		-webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
	}
	.yc-marquee-scroll {
		display: flex;
		gap: 3rem;
		animation: marqueeScroll 30s linear infinite;
		width: max-content;
	}
	@keyframes marqueeScroll {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}
	.yc-marquee-item {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-griege-50);
		white-space: nowrap;
		padding: 0.5rem 0;
	}

	/* ── Services ── */
	.yc-services {
		padding: 4rem 1rem;
		border-top: 1px solid var(--yc-griege-08);
	}
	.yc-services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}
	.yc-service-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(var(--yc-blur-12, 12px));
		-webkit-backdrop-filter: blur(var(--yc-blur-12, 12px));
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.75rem;
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10),
					0 8px 24px -4px var(--yc-shadow-30);
		transition: all 350ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}
	.yc-service-card:hover {
		border-color: var(--yc-griege-32);
		transform: translateY(-2px);
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-14),
					0 12px 32px -6px var(--yc-shadow-35);
	}
	.yc-service-name {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-text, #e6e6e8);
		margin: 0 0 0.75rem;
	}
	.yc-service-desc {
		font-size: 0.85rem;
		font-weight: 300;
		line-height: 1.55;
		color: var(--yc-griege-text);
		margin: 0 0 1rem;
	}
	.yc-service-bullets {
		margin: 0;
		padding: 0 0 0 1.25rem;
		list-style: disc;
	}
	.yc-service-bullets li {
		font-size: 0.8rem;
		font-weight: 300;
		line-height: 1.5;
		color: var(--yc-text-muted, var(--yc-griege-50));
		margin-bottom: 0.35rem;
	}
	.yc-service-bullets li:last-child {
		margin-bottom: 0;
	}

	/* ── About ── */
	.yc-about {
		padding: 4rem 1rem;
		border-top: 1px solid var(--yc-griege-08);
	}
	.yc-about-narrative {
		margin-bottom: 2.5rem;
	}
	.yc-about-text {
		font-size: 0.92rem;
		font-weight: 300;
		line-height: 1.7;
		color: var(--yc-griege-text);
		max-width: 680px;
		margin: 0 0 1.25rem;
	}
	.yc-about-text:last-child {
		margin-bottom: 0;
	}
	.yc-stats-row {
		display: flex;
		gap: 3rem;
		flex-wrap: wrap;
	}
	.yc-stat {
		display: flex;
		flex-direction: column;
	}
	.yc-stat-number {
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-size: 2.75rem;
		font-weight: 200;
		color: var(--yc-maple-gold);
		line-height: 1;
		margin-bottom: 0.25rem;
	}
	.yc-stat-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-text-muted, var(--yc-griege-50));
	}

	/* ── Contact ── */
	.yc-contact {
		padding: 4rem 1rem;
		border-top: 1px solid var(--yc-griege-08);
	}
	.yc-contact-intro {
		font-size: 0.88rem;
		font-weight: 300;
		line-height: 1.65;
		color: var(--yc-griege-text);
		max-width: 640px;
		margin: 0 0 2rem;
	}
	.yc-contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}
	@media (min-width: 600px) {
		.yc-contact-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	.yc-contact-group-title {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-text-muted, var(--yc-griege-50));
		margin: 0 0 0.75rem;
	}
	.yc-contact-cards {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.yc-contact-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(var(--yc-blur-12, 12px));
		-webkit-backdrop-filter: blur(var(--yc-blur-12, 12px));
		border: 1px solid var(--yc-griege-20);
		border-radius: 14px;
		padding: 1rem 1.25rem;
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10);
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.yc-contact-name {
		font-weight: 500;
		color: var(--yc-text, #e6e6e8);
		font-size: 0.85rem;
	}
	.yc-contact-link {
		color: var(--yc-maple-gold);
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 300;
		transition: color 200ms ease;
	}
	.yc-contact-link:hover {
		color: var(--yc-maple-gold-92);
		text-decoration: underline;
	}
	.yc-contact-detail {
		color: var(--yc-griege-text);
		font-size: 0.8rem;
		font-weight: 300;
	}

	/* ── Map ── */
	.yc-map {
		padding: 0 1rem 4rem;
	}
	.yc-map-frame {
		border-radius: 18px;
		overflow: hidden;
		border: 1px solid var(--yc-griege-20);
		box-shadow: 0 8px 24px -4px var(--yc-shadow-30);
	}
	.yc-map-address {
		text-align: center;
		font-size: 0.8rem;
		font-weight: 300;
		color: var(--yc-text-muted, var(--yc-griege-50));
		margin: 1rem 0 0;
	}

	/* ── Footer ── */
	.yc-footer {
		border-top: 1px solid var(--yc-griege-18);
		padding: 3rem 1rem 1.5rem;
	}
	.yc-footer-inner {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--yc-griege-08);
	}
	@media (min-width: 600px) {
		.yc-footer-inner {
			grid-template-columns: 1.5fr repeat(3, 1fr);
		}
	}
	.yc-footer-brand {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.yc-footer-name {
		font-weight: 500;
		color: var(--yc-text, #e6e6e8);
		font-size: 0.95rem;
	}
	.yc-footer-est {
		font-size: 0.75rem;
		font-weight: 300;
		color: var(--yc-text-muted, var(--yc-griege-50));
	}
	.yc-footer-col {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 0.8rem;
		font-weight: 300;
		color: var(--yc-griege-text);
	}
	.yc-footer-col a {
		color: var(--yc-griege-text);
		text-decoration: none;
		transition: color 200ms ease;
	}
	.yc-footer-col a:hover {
		color: var(--yc-maple-gold);
	}
	.yc-footer-heading {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-text-muted, var(--yc-griege-50));
		margin-bottom: 0.25rem;
	}
	.yc-footer-bottom {
		max-width: 1100px;
		margin: 1.25rem auto 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.7rem;
		font-weight: 300;
		color: var(--yc-text-faint, var(--yc-griege-35));
	}
	.yc-footer-portal {
		color: var(--yc-maple-gold);
		text-decoration: none;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.5rem 1rem;
		border: 1px solid var(--yc-griege-20);
		border-radius: 100px;
		transition: all 250ms ease;
		min-height: 44px;
		display: flex;
		align-items: center;
	}
	.yc-footer-portal:hover {
		background: var(--yc-maple-gold-10);
		border-color: var(--yc-maple-gold-45);
	}

	/* ── Responsive ── */
	@media (max-width: 900px) {
		.yc-need-grid {
			grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		}
	}
	@media (max-width: 600px) {
		.yc-hero-wordmark {
			font-size: 3.75rem;
		}
		.yc-nav-hamburger {
			display: flex;
		}
		.yc-nav-links {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			flex-direction: column;
			background: var(--yc-ink-55);
			backdrop-filter: blur(var(--yc-blur-24, 24px)) saturate(var(--yc-sat-160, 160%));
			-webkit-backdrop-filter: blur(var(--yc-blur-24, 24px)) saturate(var(--yc-sat-160, 160%));
			border-bottom: 1px solid var(--yc-griege-18);
			padding: 0.75rem 1rem;
			gap: 0.25rem;
		}
		.yc-nav-links.open {
			display: flex;
		}
		.yc-nav-link {
			padding: 0.75rem 1rem;
			font-size: 0.65rem;
			justify-content: flex-start;
		}
		.yc-nav-phone {
			justify-content: center;
			margin: 0.25rem 0;
		}
		.yc-needs-bar-label {
			display: none;
		}
		.yc-need-title {
			font-size: 1.5rem;
		}
		.yc-section-title {
			font-size: 1.75rem;
		}
		.yc-need-grid {
			grid-template-columns: 1fr;
		}
		.yc-stat-number {
			font-size: 2rem;
		}
		.yc-stats-row {
			gap: 2rem;
		}
		.yc-hero-sub2 {
			font-size: 0.82rem;
		}
	}
	@media (max-width: 390px) {
		.yc-hero-wordmark {
			font-size: 3rem;
		}
		.yc-hero-sub {
			font-size: 0.95rem;
		}
		.yc-hero-sub2 {
			font-size: 0.78rem;
		}
	}

	/* ── Reduced Motion ── */
	@media (prefers-reduced-motion: reduce) {
		.yc-hero-letter {
			animation: none;
			opacity: 1;
		}
		.yc-hero-content {
			transition: none;
			opacity: 1;
			transform: none;
		}
		.yc-need-section {
			transition: none;
			opacity: 1;
			transform: none;
		}
		.yc-section-container {
			transition: none;
			opacity: 1;
			transform: none;
		}
		.yc-product-card {
			transition: none;
		}
		.yc-marquee-scroll {
			animation: none;
		}
	}

	/* ── Light Mode Overrides ── */
	:global(:root[data-theme='light']) .yc-v3 {
		background: #faf7f0;
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-hero::before {
		background: radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255, 226, 122, 0.06) 0%, transparent 70%);
	}
	:global(:root[data-theme='light']) .yc-nav.scrolled {
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(20px) saturate(120%);
		-webkit-backdrop-filter: blur(20px) saturate(120%);
		border-bottom-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-nav-brand {
		color: #7a5d10;
	}
	:global(:root[data-theme='light']) .yc-nav-link {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-nav-link.active {
		color: #7a5d10;
		background: rgba(122, 93, 16, 0.08);
	}
	:global(:root[data-theme='light']) .yc-nav-phone {
		color: #7a5d10;
		border-color: rgba(122, 93, 16, 0.35);
	}
	:global(:root[data-theme='light']) .yc-nav-phone:hover {
		background: rgba(122, 93, 16, 0.08);
	}
	:global(:root[data-theme='light']) .yc-nav-links {
		background: rgba(255, 255, 255, 0.92);
	}
	@media (min-width: 601px) {
		:global(:root[data-theme='light']) .yc-nav-links {
			background: transparent;
		}
	}
	:global(:root[data-theme='light']) .yc-hero-wordmark {
		color: #1d1d1f;
	}
	:global(:root[data-theme='light']) .yc-hero-tagline {
		color: #7a5d10;
	}
	:global(:root[data-theme='light']) .yc-hero-sub {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-hero-sub2 {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .yc-hero-location {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .yc-hero-cta {
		color: #7a5d10;
		background: rgba(122, 93, 16, 0.08);
		border-color: rgba(122, 93, 16, 0.35);
	}
	:global(:root[data-theme='light']) .yc-hero-cta:hover {
		background: rgba(122, 93, 16, 0.12);
		border-color: rgba(122, 93, 16, 0.5);
	}
	:global(:root[data-theme='light']) .yc-hero-cta-secondary {
		color: #3d3832;
		border-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-hero-cta-secondary:hover {
		border-color: #c2b39a;
		background: rgba(122, 116, 106, 0.06);
	}
	:global(:root[data-theme='light']) .yc-solver-desc {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-solver-desc em {
		color: #1d1d1f;
	}

	/* Light mode pills bar */
	:global(:root[data-theme='light']) .yc-needs-bar {
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(20px) saturate(120%);
		-webkit-backdrop-filter: blur(20px) saturate(120%);
		border-bottom-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-needs-bar-label {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .yc-need-pill {
		background: #ffffff;
		border-color: #e5dfd0;
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-need-pill:hover {
		border-color: #c2b39a;
		background: #f7f4ec;
	}
	:global(:root[data-theme='light']) .yc-need-pill.active {
		color: #7a5d10;
		background: rgba(122, 93, 16, 0.08);
		border-color: rgba(122, 93, 16, 0.4);
	}

	/* Light mode need sections — alternating backgrounds */
	:global(:root[data-theme='light']) .yc-need-section {
		background: #faf7f0;
		border-bottom-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-need-section.alt {
		background: #ffffff;
	}
	:global(:root[data-theme='light']) .yc-need-eyebrow {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .yc-need-title {
		color: #1d1d1f;
	}
	:global(:root[data-theme='light']) .yc-need-tagline {
		color: #1d1d1f;
	}
	:global(:root[data-theme='light']) .yc-need-context {
		color: #5a5249;
	}

	/* Light mode product cards */
	:global(:root[data-theme='light']) .yc-product-card {
		background: #ffffff;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: #e5dfd0;
		box-shadow: 0 1px 3px rgba(60, 50, 30, 0.06),
					0 4px 12px rgba(60, 50, 30, 0.04);
	}
	:global(:root[data-theme='light']) .yc-product-card:hover {
		border-color: rgba(122, 93, 16, 0.4);
		box-shadow: 0 4px 12px rgba(60, 50, 30, 0.08),
					0 12px 32px rgba(60, 50, 30, 0.06);
	}
	:global(:root[data-theme='light']) .yc-product-name {
		color: #7a5d10;
	}
	:global(:root[data-theme='light']) .yc-product-why {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-product-best {
		color: #5a5249;
		border-top-color: #e5dfd0;
	}

	/* Light mode section titles */
	:global(:root[data-theme='light']) .yc-section-title {
		color: #1d1d1f;
	}
	:global(:root[data-theme='light']) .yc-eyebrow {
		color: #5a5249;
	}

	/* Light mode suppliers */
	:global(:root[data-theme='light']) .yc-suppliers {
		background: #ffffff;
		border-top-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-suppliers-desc {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-marquee-item {
		color: #5a5249;
	}

	/* Light mode services */
	:global(:root[data-theme='light']) .yc-services {
		background: #faf7f0;
		border-top-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-service-card {
		background: #ffffff;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: #e5dfd0;
		box-shadow: 0 1px 3px rgba(60, 50, 30, 0.06),
					0 4px 12px rgba(60, 50, 30, 0.04);
	}
	:global(:root[data-theme='light']) .yc-service-card:hover {
		border-color: #c2b39a;
		box-shadow: 0 4px 12px rgba(60, 50, 30, 0.08),
					0 12px 32px rgba(60, 50, 30, 0.06);
	}
	:global(:root[data-theme='light']) .yc-service-name {
		color: #1d1d1f;
	}
	:global(:root[data-theme='light']) .yc-service-desc {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-service-bullets li {
		color: #5a5249;
	}

	/* Light mode about */
	:global(:root[data-theme='light']) .yc-about {
		background: #ffffff;
		border-top-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-about-text {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-stat-number {
		color: #7a5d10;
	}
	:global(:root[data-theme='light']) .yc-stat-label {
		color: #5a5249;
	}

	/* Light mode contact */
	:global(:root[data-theme='light']) .yc-contact {
		background: #faf7f0;
		border-top-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-contact-intro {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-contact-group-title {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .yc-contact-card {
		background: #ffffff;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: #e5dfd0;
		box-shadow: 0 1px 3px rgba(60, 50, 30, 0.06);
	}
	:global(:root[data-theme='light']) .yc-contact-name {
		color: #1d1d1f;
	}
	:global(:root[data-theme='light']) .yc-contact-link {
		color: #7a5d10;
	}
	:global(:root[data-theme='light']) .yc-contact-link:hover {
		color: #5a4108;
	}
	:global(:root[data-theme='light']) .yc-contact-detail {
		color: #3d3832;
	}

	/* Light mode map */
	:global(:root[data-theme='light']) .yc-map-frame {
		border-color: #e5dfd0;
		box-shadow: 0 4px 16px rgba(60, 50, 30, 0.08);
	}
	:global(:root[data-theme='light']) .yc-map-address {
		color: #5a5249;
	}

	/* Light mode footer */
	:global(:root[data-theme='light']) .yc-footer {
		background: #ffffff;
		border-top-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-footer-inner {
		border-bottom-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-footer-name {
		color: #1d1d1f;
	}
	:global(:root[data-theme='light']) .yc-footer-est {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .yc-footer-col {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-footer-col a {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .yc-footer-col a:hover {
		color: #7a5d10;
	}
	:global(:root[data-theme='light']) .yc-footer-heading {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .yc-footer-bottom {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .yc-footer-portal {
		color: #7a5d10;
		border-color: #e5dfd0;
	}
	:global(:root[data-theme='light']) .yc-footer-portal:hover {
		background: rgba(122, 93, 16, 0.08);
		border-color: rgba(122, 93, 16, 0.35);
	}

	/* Light mode hamburger */
	:global(:root[data-theme='light']) .yc-hamburger-bar {
		background: #3d3832;
	}
</style>
