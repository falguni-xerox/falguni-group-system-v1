import "../styles/header.css";
function Header() {
  return (
    <header className="header">

      {/* Background Decoration */}
      <div className="header-bg-icon left">☕</div>
      <div className="header-bg-icon right-top">🍜</div>
      <div className="header-bg-icon right-bottom">🥤</div>

      <div className="header-content">

        {/* Logo */}
        <div className="logo-circle">
          <span className="logo-f">F</span>
          <span className="logo-cup">☕</span>
        </div>

        {/* Shop Details */}
        <div className="header-text">
          <h1>Falguni Parlour & Maggi House</h1>

          <p className="tagline">
            Fresh Food • Quick Order
          </p>

          <div className="table-badge">
            🍽 Table 1
          </div>
        </div>

      </div>

    </header>
  );
}

export default Header;