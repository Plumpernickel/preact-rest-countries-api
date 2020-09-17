import { h } from "preact";
import { Link } from "preact-router/match";
import { useCallback, useEffect, useState } from "preact/hooks";
import useDebounce from '../../hooks/use-debounce';
import style from "./style.scss";

const Home = () => {
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  const [countries, setCountries] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  const fetchCountries = useCallback((specificity = 'all', paramValue = '') => {
    const requestTypeUrlMap = {
      all: 'https://restcountries.eu/rest/v2/all',
      name: `https://restcountries.eu/rest/v2/name/${paramValue}`,
      region: `https://restcountries.eu/rest/v2/region/${paramValue}`
    };

    return fetch(requestTypeUrlMap[specificity])
      .then((res) => res.json())
      .then((jsonRes) => jsonRes)
      .catch((error) => console.error(error));
  }, []);

  useEffect(async () => {
    if (selectedRegion) {
      setLoading(true);
      const jsonCountries = await fetchCountries('region', selectedRegion);
      setCountries(jsonCountries);
      setLoading(false);
    }
  }, [selectedRegion]);

  useEffect(async () => {
    if (debouncedSearchTerm) {
      setLoading(true);
      const jsonCountries = await fetchCountries('name', searchValue);
      setCountries(jsonCountries);
      setLoading(false);
    } else {
      setLoading(true);
      const jsonCountries = await fetchCountries();
      setCountries(jsonCountries);
      setLoading(false);
    }

    setSelectedRegion('');
  }, [debouncedSearchTerm]);

  const renderCountryBox = ({ alpha3Code, capital, flag, name, population, region }) => (
    <div class="column is-one-quarter">
      <Link href={`/countries/${alpha3Code}`}>
        <div class={`tile is-parent ${style['country-box']}`}>
          <article class={`tile is-child box ${style["p-0"]}`}>
            <figure class="image is-16by9">
              <img loading="lazy" class={style.flag} src={flag} alt={`Flag of ${name}`} />
            </figure>
            <div class="px-4 py-4">
              <p class="title mb-2 is-size-4 has-text-weight-bold">{name}</p>
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
                    <ion-icon name="search-outline"></ion-icon>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="level-right">
            <div class="select">
              <select value={selectedRegion} onChange={({ target: { value } }) => setSelectedRegion(value)}>
                <option disabled selected value="">
                  Filter by Region
                </option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </nav>

        {loading ? (
          <div class="has-text-centered">
            <span class={`icon is-large ${style.spin}`}>
              <ion-icon name="logo-ionic" style={{ fontSize: '64px' }}></ion-icon>
            </span>
          </div>
        ) : (
          <div class="columns is-multiline">
            {countries.map((country) => renderCountryBox(country))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
