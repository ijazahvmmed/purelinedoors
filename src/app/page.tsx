import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink, Eyebrow, ProductCard } from "@/components/ui";
import { families, faqs } from "@/lib/content";
import { getProducts, isPreview } from "@/lib/catalogue";
import { ManagedPage } from "@/components/managed-page";
import { metadata as meta } from "@/lib/seo";
import { MotionGrid } from "@/components/motion-elements";
import { ArchitecturePhoto } from "@/components/architecture-photo";
import { HomeBenefits } from "@/components/home-benefits";
import { HomeDisclosure } from "@/components/home-disclosure";
import { EntranceExperience } from "@/components/entrance-experience";

export const metadata = meta(
  "GRP & composite doors for considered spaces",
  "Discover Pureline’s door families, authentic catalogue designs and project enquiry pathways.",
  "/",
);

export default async function Home() {
  const products = await getProducts();
  if (!isPreview)
    return (
      <ManagedPage slug="home">
        <section className="section">
          <MotionGrid itemsKey={products.slice(0, 8).map(p => p.id).join(",")}>
            {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p}/>)}
          </MotionGrid>
        </section>
      </ManagedPage>
    );

  const { props: mobileHero } = getImageProps({
    src: "/images/architecture/forest-residence-mobile.webp", alt: "Architectural inspiration", fill: true, sizes: "100vw", quality: 65,
  });
  const orderedFamilies = [families[0], families[2], families[1], ...families.slice(3)];

  return (
    <div className="homepage-edition">
      <section className="hero cinematic-hero reference-hero atmospheric-hero">
        <div className="hero-visual"><div className="hero-parallax" data-parallax>
          <picture>
            <source type="image/avif" media="(max-width:760px)" srcSet="/images/architecture/forest-residence-mobile-480.avif 480w, /images/architecture/forest-residence-mobile-768.avif 768w, /images/architecture/forest-residence-mobile-993.avif 993w" sizes="100vw"/>
            <source type="image/avif" srcSet="/images/architecture/forest-residence-1280.avif 1280w, /images/architecture/forest-residence-1920.avif 1920w, /images/architecture/forest-residence-2400.avif 2400w" sizes="96vw"/>
            <source media="(max-width:760px)" srcSet={mobileHero.srcSet} sizes="100vw"/>
            <Image src="/images/architecture/forest-residence.webp" alt="A contemporary timber and stone residence framed by mature woodland; architectural inspiration, not a Pureline installation" fill loading="eager" fetchPriority="high" sizes="96vw"/>
          </picture>
        </div></div>
        <div className="hero-brand" aria-hidden="true">COMPOSITE DOORS</div>
        <div className="hero-heading">
          <Eyebrow>Considered openings / UK catalogue preview</Eyebrow>
          <h1><span>Engineered to endure.</span><span>Designed to belong.</span></h1>
        </div>
        <div className="hero-copy">
          <p>Considered form. Everyday practicality. Explore composite door designs for the spaces you call your own.</p>
          <div className="hero-actions">
            <ButtonLink href="/request-quote">Request a quote</ButtonLink>
            <ButtonLink href="/doors" outline>Explore our doors</ButtonLink>
          </div>
        </div>
        <Link href="/products/arch" className="hero-model">
          <div className="hero-model-image"><Image src="/images/arch.webp" alt="Arch — original Pureline catalogue design" width={400} height={780} sizes="80px"/></div>
          <span>From the catalogue</span><strong>Arch</strong>
          <span className="hero-model-action">Discover the design<ArrowUpRight size={18}/></span>
        </Link>
        <div className="hero-context"><span>For your setting</span><p>GRP, metal<br/> & interior doors.</p><Link href="/request-quote?type=specification">Discuss a specification<ArrowUpRight size={15}/></Link></div>
        <div className="hero-foot"><span>Thoughtful design. Inside and out.</span><a href="#introduction" className="hero-scroll">Discover Pureline<span aria-hidden="true">↓</span></a></div>
        <p className="hero-image-note">Architectural inspiration · Max Vakhtbovych / Pexels</p>
      </section>

      <section className="section brand-introduction" id="introduction">
        <Eyebrow>01 / The Pureline approach</Eyebrow>
        <div>
          <h2>A considered entrance.<br/>A lasting impression.</h2>
          <div className="introduction-details">
            <p>A door is part of everyday life. Its proportions, surface, glazing and construction all deserve a closer look.</p>
            <div><p>From a welcoming front door to a quiet interior. Explore the families, then define a specification that belongs in your space.</p><Link href="/why-pureline" className="text-link">Get to know Pureline<ArrowUpRight size={17}/></Link></div>
          </div>
        </div>
      </section>

      <section className="section collections collection-library home-collection-library" aria-labelledby="collections-heading">
        <div className="section-heading">
          <div><Eyebrow>02 / The door collections</Eyebrow><h2 id="collections-heading">Find your kind<br/>of welcome.</h2></div>
          <div><p>Panelled, glazed or quietly minimal. Genuine catalogue designs, for different spaces and different ways of living.</p><Link href="/doors" className="text-link">View all collections<ArrowUpRight size={17}/></Link></div>
        </div>
        <div className="collection-grid">
          {orderedFamilies.map((family, index) => (
            <Link className={`collection-plate collection-plate-${index} ${index < 3 ? "collection-feature" : "collection-secondary"}`} key={family.slug} href={`/doors/${family.slug}`}>
              <div className="collection-plate-media family-image">
                <span className="plate-index">{String(index + 1).padStart(2, "0")}</span>
                <Image src={family.image} alt={`${family.name} — original Pureline catalogue reference`} width={400} height={700} sizes="(max-width:760px) 130px, (max-width:1000px) 160px, 200px"/>
                <ArrowUpRight size={21}/>
              </div>
              <div className="collection-plate-caption"><h3>{family.name}</h3><p>{family.description}</p></div>
            </Link>
          ))}
        </div>
        <div className="model-library-heading"><Eyebrow>A closer look / Exterior designs</Eyebrow><Link href="/doors/exterior-grp" className="text-link">Browse the models<ArrowUpRight size={17}/></Link></div>
        <MotionGrid className="product-grid home-products" itemsKey={products.slice(0, 4).map(p => p.id).join(",")}>
          {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} imageSizes="(max-width:760px) 110px, 150px"/>)}
        </MotionGrid>
      </section>

      <EntranceExperience/>

      <section className="section home-benefits" aria-labelledby="benefits-heading">
        <div className="section-heading"><div><Eyebrow>03 / Why Pureline</Eyebrow><h2 id="benefits-heading">Good design.<br/>Beyond the surface.</h2></div><div><p>Consider every part of the opening. Explore the details that matter to your project, then confirm the evidence for your selected doorset.</p><span className="benefits-instruction">Explore a benefit to see the detail<ArrowUpRight size={16}/></span></div></div>
        <HomeBenefits/>
        <p className="performance-note">Performance and availability are model and assembly specific. Catalogue studies illustrate the design; tested performance and suitability are confirmed during specification.</p>
      </section>

      <section className="section performance-chapter engineering-chapter home-engineering" aria-labelledby="performance-heading">
        <div className="section-heading"><div><Eyebrow>04 / Engineered for performance</Eyebrow><h2 id="performance-heading">Every layer.<br/>Every detail.</h2></div><p>The surface is only the beginning. Consider the complete doorset: leaf, core, frame, glazing and hardware.</p></div>
        <div className="performance-grid">
          <article className="performance-primary" data-feature-story>
            <ArchitecturePhoto name="woodland-entrance" className="story-art"/>
            <div className="feature-copy"><Eyebrow>Architecture / Everyday use</Eyebrow><h3>A better boundary<br/>between inside and out.</h3><p>A welcoming entrance must suit its exposure. Start with the setting and use, then specify the assembly that meets your requirements.</p><Link href="/request-quote?type=specification" className="text-link">Explore your specification<ArrowUpRight size={17}/></Link></div>
          </article>
          <div className="performance-support">
            <article className="thermal-panel" data-feature-story>
              <div className="feature-detail-image"><Image src="/images/details/grp-construction.webp" alt="Original catalogue GRP exterior door construction and glazing cross-section" width={652} height={564} sizes="(max-width:760px) 85vw, 36vw"/></div>
              <div className="feature-copy"><Eyebrow>Original catalogue / p.23</Eyebrow><h3>Construction,<br/>considered.</h3><p>Core, glazing and edge details shape the complete doorset. GRP means glass reinforced plastic; construction varies by model.</p><Link href="/manufacturing-quality" className="text-link">Materials & quality<ArrowUpRight size={17}/></Link></div>
            </article>
          </div>
        </div>
        <div className="performance-secondary engineering-grid" data-feature-story>
          <figure className="construction-study"><div className="engineering-image"><Image src="/images/details/frame-construction.webp" alt="Original ENM exterior frame construction diagram showing the catalogue’s illustrated frame layers" width={628} height={560} sizes="(max-width:760px) 85vw, 30vw"/></div><figcaption>ENM exterior frame / Original catalogue construction detail, p.23</figcaption></figure>
          <div className="feature-copy"><Eyebrow>Catalogue study / ENM 4 Panel</Eyebrow><h3>Precision starts<br/>with the specification.</h3><p>Dimensions are a starting point, not a complete doorset specification. Confirm finishes, hardware and tested performance for the exact assembly.</p><Link href="/products/enm-four-panel" className="text-link">View ENM 4 Panel<ArrowUpRight size={17}/></Link></div>
          <div className="engineering-specification">
            <dl className="technical-register"><div><dt>Catalogue design</dt><dd>ENM 4 Panel</dd></div><div><dt>Printed thickness</dt><dd>46 <span>mm</span></dd></div><div><dt>Printed frame width</dt><dd>1000 <span>mm</span></dd></div><div><dt>Printed frame height</dt><dd>2100 <span>mm</span></dd></div><div><dt>Source</dt><dd>Original catalogue, p.11</dd></div></dl>
            <p className="technical-note">Catalogue reference, subject to review. Frame dimensions are not leaf dimensions. The ENM frame drawing is a family reference; applicability to this model requires confirmation.</p>
          </div>
        </div>
      </section>

      <section className="manufacturing-teaser quality-chapter home-quality" aria-labelledby="quality-heading">
        <div className="manufacturing-title"><Eyebrow>05 / Manufacturing & quality</Eyebrow><h2 id="quality-heading">Confidence begins<br/>with the details.</h2><p>Good specification is built on clear product identity, traceable documentation and the right questions.</p><ButtonLink href="/manufacturing-quality" light>Explore materials & quality</ButtonLink></div>
        <div className="quality-evidence">
          <div className="quality-document"><span>Construction reference / 23</span><Image src="/images/details/frame-construction.webp" alt="ENM frame illustration from the original catalogue, not a factory photograph or a certification document" width={628} height={560} sizes="(max-width:760px) 85vw, 28vw"/><p>Original catalogue illustration<br/>ENM exterior frame</p></div>
          <div className="quality-register"><div><span>01</span><p>Identify the product<br/>and complete assembly.</p></div><div><span>02</span><p>Request evidence for<br/>the intended application.</p></div><div><span>03</span><p>Confirm installation<br/>and care requirements.</p></div></div>
          <p className="quality-scope">Test documentation must cover the exact model and configuration. Request matching installation and care guidance.</p>
        </div>
      </section>

      <section className="section applications-preview architectural-applications home-applications" aria-labelledby="applications-heading">
        <div className="section-heading"><div><Eyebrow>06 / Spaces & applications</Eyebrow><h2 id="applications-heading">For the way<br/>a space is lived.</h2></div><div><p>A personal welcome. A busy workplace. A wider specification. Different settings ask different questions.</p><Link href="/applications" className="text-link">Explore the applications<ArrowUpRight size={17}/></Link></div></div>
        <div className="application-compositions">
          <article className="application-residential"><ArchitecturePhoto name="quiet-interior"/><div className="application-caption"><span>01 / Residential & renovations</span><h3>A welcome<br/>that feels like you.</h3><p>Explore a design for your home and share what you have in mind.</p><Link href="/request-quote" className="text-link">Talk about your home<ArrowUpRight size={17}/></Link></div></article>
          <article className="application-commercial"><ArchitecturePhoto name="public-interior"/><div className="application-caption"><span>02 / Offices, commercial & institutional</span><h3>Your project.<br/>Every opening.</h3><p>For architects, contractors and trade buyers. Start with the brief, quantity and specification for offices, education and public settings.</p><Link href="/trade-projects" className="text-link">Discuss a project<ArrowUpRight size={17}/></Link></div></article>
        </div>
      </section>

      <section className="section home-faq" aria-labelledby="faq-heading">
        <div><Eyebrow>07 / A little clarity</Eyebrow><h2 id="faq-heading">Considered doors.<br/>Clear answers.</h2><p>A few useful starting points, before we talk about your project.</p><Link href="/contact" className="text-link">Ask us a question<ArrowUpRight size={17}/></Link></div>
        <div className="home-faq-list">{faqs.map((faq, index) => <HomeDisclosure key={faq.question} className="home-faq-row" summary={<><span className="faq-index">{String(index + 1).padStart(2, "0")}</span><span>{faq.question}</span><span className="faq-toggle" aria-hidden="true">+</span></>}><p>{faq.answer}</p></HomeDisclosure>)}</div>
      </section>

      <section className="enquiry-banner home-enquiry">
        <Eyebrow>Your next opening</Eyebrow><h2>Let’s make<br/>an entrance.</h2><p>A single entrance or a wider specification.<br/>Tell us what you have in mind.</p>
        <div className="home-enquiry-actions"><ButtonLink href="/request-quote">Request a quote</ButtonLink><Link href="/doors" className="text-link">Explore the collections<ArrowUpRight size={17}/></Link></div>
        <div className="steps-strip"><div><span>01</span><h3>Find your design</h3><p>Explore the collections.</p></div><div><span>02</span><h3>Share your requirements</h3><p>Tell us about your space.</p></div><div><span>03</span><h3>Discuss the details</h3><p>Confirm the specification.</p></div></div>
      </section>
    </div>
  );
}
