import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage, setPokemonsPerPage] = useState(12); // Number of pokemons per page

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=100").then((response) => {
      const fetches = response.data.results.map((pokemon) =>
        axios.get(pokemon.url)
      );
      Promise.all(fetches).then((results) =>
        setPokemons(results.map((res) => res.data))
      );
    });
  }, []);

  useEffect(() => {
    const filtered = filterType === "all"
      ? pokemons
      : pokemons.filter((pokemon) =>
          pokemon.types.some((type) => type.type.name === filterType)
        );
    setFilteredPokemons(filtered);
  }, [pokemons, filterType]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleViewDetails = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseDetails = () => {
    setSelectedPokemon(null);
  };

  const filteredResults = filteredPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredResults.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredResults.length / pokemonsPerPage);

  return (
    <div className="App">
      <h1>Pokémon Gallery</h1>

      <div className="filter-bar">
        <select value={filterType} onChange={handleFilterChange}>
          <option value="all">All Types</option>
          <option value="grass">Grass</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          {/* Add more types as needed */}
        </select>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="pokemon-list">
        {currentPokemons.map((pokemon) => (
          <div key={pokemon.id} className="card">
            <div className="card-body">
              <h5 className="card-title">{pokemon.name}</h5>
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="card-img-top"
              />
              <button
                className="btn-primary"
                onClick={() => handleViewDetails(pokemon)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {[...Array(totalPages).keys()].map(pageNumber => (
          <div
            key={pageNumber + 1}
            className={`page-item ${currentPage === pageNumber + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNumber + 1)}
        >
            <span className="page-link">{pageNumber + 1}</span>
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <div className="pokemon-details">
          <h2>{selectedPokemon.name}</h2>
          <img
            src={selectedPokemon.sprites.front_default}
            alt={selectedPokemon.name}
            className="details-img"
          />
          <p>Height: {selectedPokemon.height / 80} m</p>
          <p>Weight: {selectedPokemon.weight / 80} kg</p>
          <p>Types: {selectedPokemon.types.map(type => type.type.name).join(', ')}</p>
          <p>Abilities: {selectedPokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
          <div className="stats">
            <button className="btn-primary btn-close" onClick={handleCloseDetails}>
              Close
            </button>
            <ul>
              {selectedPokemon.stats.map(stat => (
                <li key={stat.stat.name}>
                  {/* {stat.stat.name}: {stat.base_stat} */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;