import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import { API_URL } from "../app/constants";
import axios from 'axios'
import { router } from 'expo-router'

const PokemonContext = React.createContext();

const downloadImage = async (domain, fileName) => {
    const newFileName = fileName.substring(1, fileName.length);
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'image', { intermediates: true });
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'image/sprite', { intermediates: true });
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'image/thumbnail', { intermediates: true });
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'image/hi_res', { intermediates: true });
    const fileUri = FileSystem.documentDirectory + newFileName;
    let fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
        console.log('saved:', fileInfo.uri);
        return fileInfo.uri;
    }

    console.log('downloading:', domain + newFileName);
    const { uri } = await FileSystem.downloadAsync(
        domain + newFileName,
        fileUri
    );
    console.log('downloaded:', fileUri);
    return fileUri;
}

function PokemonProvider({ children }) {
    const [allPokemons, setAllPokemons] = React.useState([]);
    const [caughtPokemons, setCaughtPokemons] = React.useState([]);

    const updatePokemonList = async () => {
        // await FileSystem.deleteAsync(FileSystem.documentDirectory + 'image', { idempotent: true });
        // await AsyncStorage.clear();
        // return true;
        const { data } = await axios.get(`${API_URL}/pokemon`)
        const pokemonByGroups = [];
        try {
            const allPokemonsJson = await AsyncStorage.getItem("pokemonList");
        if (allPokemonsJson) {
            console.log('allPokemonsJson', allPokemonsJson);
            const allPokemonList = JSON.parse(allPokemonsJson);
            console.log('allPokemonList', allPokemonList);
            setAllPokemons(allPokemonList);
            console.log('saved pokemons', allPokemonList.length);
            return true;
        }
        
        data.forEach((value, key) => {
            const types = value.type.join(" - ")
            const group =  pokemonByGroups.find((value) => value.type == types)
            if(value.id < 10){
            if(group == null) {
                pokemonByGroups.push({
                    type: types,
                    data: [ value ]
                })
            } else if(group.data.findIndex(data => data.id == value.id) < 0){
                group.data.push(value)
            }
            }
            });
        const jsonValues = JSON.stringify(pokemonByGroups);
        AsyncStorage.setItem('pokemonList', jsonValues);
        
        const jsonValue = JSON.parse(await AsyncStorage.getItem('pokemonList'));
        console.log(pokemonByGroups)
        setAllPokemons(pokemonByGroups)
        return true;
        } catch (error) {
            console.log(error)
        }
        
    };

    const getPokemonById = (id) => {

        if(allPokemons.length !== 0 && id !== 0){
            for (const pokemon of allPokemons) {
                const data = pokemon.data.find(data => data.id == id)
                if(data) {
                    return data;
                }
            }
        }
    };

    const updatePokemon = ({ id, name }) => {
        const pokemon = getPokemonById(id);
        console.log('updatePokemon', id, name, pokemon);
        if (pokemon) {
            pokemon.name.english = name;
            setAllPokemons([...allPokemons]);

            AsyncStorage.setItem('allPokemons', JSON.stringify(allPokemons));
        }
    };

    const deletePokemon = (id) => {
        const pokemon = getPokemonById(id);

        for (const pokemonss of allPokemons){
            const index = pokemonss.data.indexOf(pokemon)
            pokemonss.data.splice(index, 1)
            setAllPokemons([...pokemonss]);
        }
        router.replace('pokedex/(tabs)')
    };

    return (
        <PokemonContext.Provider value={{ allPokemons, updatePokemonList, updatePokemon, deletePokemon, getPokemonById }}>
            {children}
        </PokemonContext.Provider>
    );
}

const usePokemons = () => React.useContext(PokemonContext);

export { PokemonProvider, usePokemons };