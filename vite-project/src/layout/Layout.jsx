import Header from "../components/Header";
// import Footer from "../../components/Footer";
import Footer from "../components/Footer";

// Este layout envuelve todas las páginas, incluyendo el header y el footer
function Layout({ children, sidebarOpen, sidebarTab, onSidebarOpen, onSidebarClose }) {
  return (
    <>
      <Header
        sidebarOpen={sidebarOpen}
        sidebarTab={sidebarTab}
        onSidebarOpen={onSidebarOpen}
        onSidebarClose={onSidebarClose}
      />

        {/* children será el contenido de cada página */}
      {children}   

      <Footer />
    </>
  );
}

export default Layout;