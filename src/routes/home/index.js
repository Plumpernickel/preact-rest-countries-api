import { h } from "preact";
import { Link } from "preact-router/match";
import { useEffect, useState } from "preact/hooks";
import style from "./style.scss";

const Home = () => {
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  const [searchValue, setSearchValue] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(async () => {
    function fetchCountries() {
      return fetch("https://restcountries.eu/rest/v2/all")
        .then((res) => res.json())
        .then((jsonRes) => jsonRes)
        .catch((error) => console.error(error));
    }

    const jsonCountries = await fetchCountries();
    setCountries(jsonCountries);
  }, []);

  const renderCountryBox = ({ alpha3Code, capital, flag, name, population, region }) => (
    <div class="column is-one-quarter">
      <Link href={`/countries/${alpha3Code}`}>
        <div class={`tile is-parent ${style['country-box']}`}>
          <article class={`tile is-child box ${style["p-0"]}`}>
            <figure class="image is-16by9">
              <img loading="lazy" class={style.flag} src={flag} alt={`Flag of ${name}`} />
            </figure>
            <div class="px-4 py-4">
              <p class="title mb-2">{name}</p>
              <p>
                <span class="has-text-weight-bold">Population:</span>{" "}
                {new Intl.NumberFormat().format(population)}
                <br />
                <span class="has-text-weight-bold">Region:</span> {region}
                <br />
                <span class="has-text-weight-bold">Capital:</span> {capital}
              </p>
            </div>
          </article>
        </div>
      </Link>
    </div>
  );

  return (
    <div class={style.home}>
      <section class="section">
        <nav class="level px-3">
          <div class="level-left">
            <div class="level-item">
              <div class="field">
                <p class="control has-icons-left">
                  <input
                    class="input"
                    value={searchValue}
                    onInput={({ target: { value } }) => setSearchValue(value)}
                    placeholder="Search for a country..."
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="level-right">
            <div class="select">
              <select>
                <option disabled selected>
                  Filter by Region
                </option>
                {regions.map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </nav>

        {countries && countries.length ? (
          <div class="columns is-multiline">
            {countries.map((country) => renderCountryBox(country))}
          </div>
        ) : (
          <progress class="progress is-medium is-dark" max="100"></progress>
        )}
      </section>
    </div>
  );
};

export default Home;
