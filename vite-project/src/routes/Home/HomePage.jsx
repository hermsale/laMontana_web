import SectionHero from "../../components/SectionHero/Sectionhero";
import SectionNews from "../../components/SectionNews/SectionNews";
import SectionCatalog from "../../components/SectionCatalog/SectionCatalog";

// HomePage envuelta por el Layout en App.jsx
function HomePage({onRequestAuth}) {
  return (
    <>
           
            <SectionHero />
            <SectionNews />
            <SectionCatalog
              onRequestAuth={onRequestAuth}
            />
    </>
  );
}
export default HomePage;
