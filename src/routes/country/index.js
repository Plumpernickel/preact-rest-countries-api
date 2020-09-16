import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import { Link } from "preact-router/match";
import style from './style.scss';

// Note: `name` comes from the URL, courtesy of our router
const Country = ({ code }) => {
  const [country, setCountry] = useState({});
  useEffect(async () => {
    function fetchCountry() {
      return fetch(`https://restcountries.eu/rest/v2/alpha/${code}`)
        .then((res) => res.json())
        .then((jsonRes) => jsonRes)
        .catch((error) => console.error(error));
    }

    const jsonCountry = await fetchCountry();
    console.log(jsonCountry);
    setCountry(jsonCountry);
  }, []);

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
			  <h1>{JSON.stringify(country)}</h1>
      </section>
		</div>
	);
}

export default Country;
