import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Link } from "preact-router/match";
import style from "./style.scss";

// Note: `name` comes from the URL, courtesy of our router
const Country = ({ code }) => {
  const [borderCountries, setBorderCountries] = useState([]);
  const [country, setCountry] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCountry = useCallback((countryCode) => {
    return fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`)
      .then((res) => res.json())
      .then((jsonRes) => jsonRes)
      .catch((error) => console.error(error));
  }, []);

  useEffect(async () => {
    setLoading(true);
    const initializedCountry = await fetchCountry(code);
    setCountry(initializedCountry);
    setLoading(false);
  }, [fetchCountry]);

  useEffect(() => {
    if (
      country.borders &&
      Array.isArray(country.borders) &&
      country.borders.length
    ) {
      const promises = [];

      setLoading(true);
      country.borders.forEach((border) => promises.push(fetchCountry(border)));
      Promise.all(promises).then((promiseArray) =>
        setBorderCountries(promiseArray)
      );
      setLoading(false);
    }
  }, [country, fetchCountry]);

  return (
    <div class={style.country}>
      <section class="section">
        <nav class="level px-3">
          <div class="level-left">
            <div class="level-item">
              <Link class="button" href="/">
                <span class="icon">
                  <i class="fas fa-arrow-left"></i>
                </span>
                <span>Back</span>
              </Link>
            </div>
          </div>
        </nav>
        {loading ? (
          <div class="has-text-centered">
            <span class="icon is-large is-left">
              <i class="fas fa-circle-notch fa-3x fa-spin"></i>
            </span>
          </div>
        ) : (
          <div class="columns px-3">
            <div class="column is-half">
              <img
                class="image is-fullwidth is-is-fullheight"
                src={country.flag}
                alt={`Flag of ${country.name}`}
              />
            </div>
            <div class="column is-half">
              <div class="section">
                <h1 class="title has-text-weight-bold">{country.name}</h1>
                <div class="columns">
                  <div class="column">
                    <p>
                      <span class="has-text-weight-bold">Native Name: </span>{" "}
                      {country.nativeName}
                    </p>
                    <p>
                      <span class="has-text-weight-bold">Population: </span>{" "}
                      {new Intl.NumberFormat().format(country.population)}
                    </p>
                    <p>
                      <span class="has-text-weight-bold">Region: </span>{" "}
                      {country.region}
                    </p>
                    <p>
                      <span class="has-text-weight-bold">Sub Region: </span>{" "}
                      {country.subregion}
                    </p>
                    <p>
                      <span class="has-text-weight-bold">Capital: </span>{" "}
                      {country.capital}
                    </p>
                  </div>
                  <div class="column">
                    <p>
                      <span class="has-text-weight-bold">
                        Top Level Domain:{" "}
                      </span>{" "}
                      {country.topLevelDomain}
                    </p>
                    <p>
                      <span class="has-text-weight-bold">Currencies: </span>{" "}
                      {country.currencies?.map(({ name }, index) => (
                        <span>
                          {index + 1 === country.currencies.length
                            ? name
                            : name + ", "}
                        </span>
                      ))}
                    </p>
                    <p>
                      <span class="has-text-weight-bold">Languages: </span>{" "}
                      {country.languages?.map(({ name }, index) => (
                        <span>
                          {index + 1 === country.languages.length
                            ? name
                            : name + ", "}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                {borderCountries.length ? (
                  <div class={`level ${style["country-level"]}`}>
                    <span class="level-item is-narrow mr-2 has-text-weight-bold">
                      Border Countries:{" "}
                    </span>
                    {borderCountries.map((borderCountry) => (
                      <button
                        class="level-item is-narrow button mx-1 my-1"
                        onClick={() => setCountry(borderCountry)}
                      >
                        {borderCountry.name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Country;
