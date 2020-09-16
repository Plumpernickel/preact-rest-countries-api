import { h } from "preact";
import { Link } from "preact-router/match";

import PreactIcon from "../../assets/icons/android-chrome-192x192.png";

const Header = () => (
  <header>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <Link class="navbar-item" href="/">
          <img src={PreactIcon} alt="Home Link Icon" />
        </Link>
        <div class="navbar-item has-text-weight-bold is-size-5">
          Where in the world?
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
